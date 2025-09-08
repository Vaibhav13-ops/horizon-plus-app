const express = require('express');
const router = express.Router();
const { finalizeBooking } = require('../controllers/bookingController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.route('/finalize').post(protect, finalizeBooking);
module.exports = router;