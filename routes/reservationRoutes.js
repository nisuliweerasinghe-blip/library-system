const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

router.post('/', reservationController.reserveBook);
router.get('/:bookId', reservationController.getQueueForBook);
router.get('/', reservationController.getAllReservationsForBook);

module.exports = router;