const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/issue', authenticate, authorize('librarian', 'admin'), borrowController.issueBook);
router.post('/return', authenticate, authorize('librarian', 'admin'), borrowController.returnBook);

module.exports = router;