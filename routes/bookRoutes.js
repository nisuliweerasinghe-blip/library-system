const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/',bookController.getAllBooks);
router.post('/', authenticate, authorize('librarian', 'admin'), bookController.createBook);
router.put('/:id', authenticate, authorize('librarian', 'admin'), bookController.updateBook);
router.delete('/:id', authenticate, authorize('librarian', 'admin'), bookController.deleteBook);

module.exports = router;