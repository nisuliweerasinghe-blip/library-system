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