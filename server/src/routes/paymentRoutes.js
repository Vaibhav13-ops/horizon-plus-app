const express = require('express');
const router = express.Router();
const { createPaymentIntent, createJourneyPaymentIntent } = require('../controllers/paymentController.js');
const { protect } = require('../middleware/authMiddleware.js');


router.route('/create-payment-intent').post(protect, createPaymentIntent);
router.route('/create-journey-payment-intent').post(protect, createJourneyPaymentIntent);
module.exports = router;