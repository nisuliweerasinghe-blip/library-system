const Book = require('../models/Book');

exports.createBook = async (req, res) => {
    try {
        const { title, author, isbn, totalQty } = req.body;

        const book = await Book.create({
            title,
            author,
            isbn,
            totalQty,
            availableQty: totalQty
        });

        res.status(201).json(book);
    }   catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    }   catch (err) {
        res.status(500).json({ error: err.message });
    }   
};

exports.updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const book = await Book.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true
        });

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.status(200).json(book);
    }   catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findByIdAndDelete(id);

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }   

        res.status(200).json({ message: 'Book deleted successfully' });
    }   catch (err) {
        res.status(400).json({ error: err.message });       
    }
};