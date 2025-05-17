const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const {
    addTrip,
    getTrips,
    getTripById,
    updateTripStatus
} = require('../controllers/trips.controller');

// Routes
router.post('/add', authenticate, addTrip);
router.get('/', authenticate, getTrips);
router.get('/:id', authenticate, getTripById);
router.patch('/update/:id', authenticate, updateTripStatus);

module.exports = router;