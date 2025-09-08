const express = require('express');
const router = express.Router();
const { getMyProfile, updateMyProfile, updateAvailability, getAllConsultants,getConsultantById, getMyBookings } = require('../controllers/consultantController.js');
const { protect } = require('../middleware/authMiddleware.js');

const isConsultant = (req, res, next) => {
  if (req.user && req.user.role === 'consultant') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Not a consultant.' });
  }
};

router.route('/profile/me').get(protect, isConsultant, getMyProfile);
router.route('/profile').put(protect, isConsultant, updateMyProfile);

router.route('/').get(getAllConsultants);
router.route('/:id').get(getConsultantById);


router.route('/availability').put(protect, isConsultant, updateAvailability);
router.route('/bookings/my').get(protect, isConsultant, getMyBookings);

module.exports = router;