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
