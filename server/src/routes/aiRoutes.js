const express = require('express');
const router = express.Router();
const { getCoachingResponse } = require('../controllers/aiController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.route('/').post(protect, getCoachingResponse);
module.exports = router;
