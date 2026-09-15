const mongoose = require('mongoose');
const Book = require('../models/Book');
const BorrowRecord = require('../models/BorrowRecord');

const LOAN_DAYS = 14;

exports.issueBook = async (req, res) => {
    const { bookId, studentId } = req.body;
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const book = await Book.findById(bookId).session(session);

        if (!book) {
            throw new Error('Book not found');
        }

        if (book.availableQty < 1) {
            throw new Error('No copies available right now');
        }

        book.availableQty -= 1;
        await book.save({ session });

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + LOAN_DAYS);

        const record = await BorrowRecord.create(
            [{ book: bookId, student: studentId, dueDate }], 
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ message: 'Book issued successfully', record: record[0] });
    }   catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ error: err.message });
    }
};

const FINE_PER_DAY = 10; 

exports.returnBook = async (req, res) => {
    const { recordId } = req.body;
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const record = await BorrowRecord.findById(recordId).session(session);

        if (!record) {
            throw new Error('Borrow record not found');
        }

        if (record.status === 'returned') {
            throw new Error('This book has already been returned');
        }

        const returnedAt = new Date();
        const msLate = returnedAt - record.dueDate;
        const daysLate = Math.floor(msLate / (1000 * 60 * 60 * 24));
        const fine = daysLate > 0 ? daysLate * FINE_PER_DAY : 0;

        record.returnedAt = returnedAt;
        record.status = 'returned';
        record.fineAmount = fine;
        await record.save({ session });

        const book = await Book.findById(record.book).session(session);
        book.availableQty += 1;
        await book.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Book returned successfully', fine });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ error: err.message });
    }
};