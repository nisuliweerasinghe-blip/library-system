const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requestedAt: {
        type: Date,
        default: Date.now
    },
    queuePosition: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Reservation', reservationSchema);