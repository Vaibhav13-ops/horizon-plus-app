const express = require('express');
const router = express.Router();
const { getReviewsForConsultant, createReview, updateReview, deleteReview } = require('../controllers/reviewController.js');
const { protect } = require('../middleware/authMiddleware.js');

const isUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Only users can perform this action.' });
  }
};


router.route('/:consultantId').get(getReviewsForConsultant).post(protect, isUser, createReview);
router.route('/:reviewId').put(protect, isUser, updateReview).delete(protect, isUser, deleteReview);

module.exports = router;