const express = require('express');

const { processPayment, add_card } = require('../controllers/paymentController');

const router = express.Router();

router.post('/pay', processPayment);
router.post('/add_card', add_card);

module.exports = router;
