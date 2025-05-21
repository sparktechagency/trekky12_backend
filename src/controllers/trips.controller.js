const Trip = require('../models/trips.model');

// Add new trip
const addTrip = async (req, res) => {
    try {
        const {
            rvId,
            tripTitle,
            description,
            startDate,
            endDate,
            state,
            visitStatus,
            tripType
        } = req.body;

        const newTrip = await Trip.create({
            userId: req.user.id || req.user._id || req.user.userId,
            rvId,
            tripTitle,
            description,
            startDate,
            endDate,
            state,
            visitStatus,
            tripType
        });

        res.status(201).json({
            success: true,
            message: 'Trip added successfully',
            trip: newTrip
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add trip',
            error: error.message
        });
    }
};

// Get all trips for a user
const getTrips = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id || req.user.userId;
        const trips = await Trip.find({ userId })
            .populate('rvId', 'nickname manufacturer model')
            .sort({ startDate: -1 });

        res.status(200).json({
            success: true,
            trips
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch trips',
            error: error.message
        });
    }
};

// Get single trip by ID
const getTripById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id || req.user._id || req.user.userId;

        const trip = await Trip.findOne({
            _id: id,
            userId
        }).populate('rvId', 'nickname manufacturer model');

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found or unauthorized'
            });
        }

        res.status(200).json({
            success: true,
            trip
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch trip',
            error: error.message
        });
    }
};

// Update trip state and visit status
const updateTripStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { state, visitStatus,tripType } = req.body;
        const userId = req.user.id || req.user._id || req.user.userId;

        const updatedTrip = await Trip.findOneAndUpdate(
            { _id: id, userId },
            { state, visitStatus, tripType },
            { new: true, runValidators: true }
        );

        if (!updatedTrip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found or unauthorized'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Trip status updated successfully',
            trip: updatedTrip
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update trip status',
            error: error.message
        });
    }
};


const deleteTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id || req.user._id || req.user.userId;

        const trip = await Trip.findOneAndDelete({
            _id: id,
            userId
        });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: 'Trip not found or unauthorized'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Trip deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete trip',
            error: error.message
        });
    }
};


module.exports = {
    addTrip,
    getTrips,
    getTripById,
    updateTripStatus,
    deleteTrip
}; 

