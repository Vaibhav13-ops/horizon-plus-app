const express = require('express');
const router = express.Router();
const {
    createJourney,
    getMyJourneys,
    getAllPublishedJourneys,
    updateJourney,
    isConsultant,
    enrollInJourney,
    getJourneyById,
    getMyEnrollments,
    getEnrollmentStatus
} = require('../controllers/journeyController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.route('/').get(getAllPublishedJourneys);
router.route('/').post(protect, isConsultant, createJourney);
router.route('/my-journeys').get(protect, isConsultant, getMyJourneys);
router.route('/my-enrollments').get(protect, getMyEnrollments);


router.route('/enroll').post(protect, enrollInJourney);

router.route('/:id').get(getJourneyById);
router.route('/:id').put(protect, isConsultant, updateJourney);

router.route('/:id/enrollment-status').get(protect, getEnrollmentStatus);

module.exports = router;
