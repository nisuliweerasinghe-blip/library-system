const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');

router.post('/issue', borrowController.issueBook);
router.post('/return', borrowController.returnBook);

module.exports = router;