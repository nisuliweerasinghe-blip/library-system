const Book = require('../models/Book');
const Reservation = require('../models/Reservation');

exports.reserveBook = async (req, res) => {
    try {
        const { bookId, studentId } = req.body;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if(book.availableQty > 0) {
            return res.status(400).json({ error: 'Copies are available - no need to reserve' });
        }

        const alreadyReserved = await Reservation.findOne({ 
            book: bookId, 
            student: studentId,
            status: 'waiting'
        });

        if (alreadyReserved) {
            return res.status(400).json({ error: 'You already have an active reservation for this book' });
        }

        const queueCount = await Reservation.countDocuments({ 
            book: bookId, 
            status: 'waiting' 
        });

        const reservation = await Reservation.create({
            book: bookId,
            student: studentId,
            queuePosition: queueCount + 1,
        });

        res.status(201).json(reservation);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getQueueForBook = async (req, res) => {
    try {
        const { bookId } = req.params;

        const queue = await Reservation.find({
            book: bookId,
            status: 'waiting'
        })
        .sort({ 'queuePosition': 1 })
        .populate('student', 'name email');

        res.status(200).json(queue);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllReservationsForBook = async (req, res) => {
    try {
        const { bbokid } = req.params;

        const reservations = await Reservation.find({ book: bookId })
            .sort({ 'queuePosition': 1 })
            .populate('student', 'name email');

        res.status(200).json(reservations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
