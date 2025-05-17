const Chassis = require('../models/chassis.model');

// Add new chassis
const addChassis = async (req, res) => {
    try {
        const {
            fuelType,
            addBelt,
            addAnotherBelt,
            addOilFilter,
            addAnotherOuilFilter,
            hoursePower,
            mfg,
            model,
            name,
            serialId,
            engineModel,
            rvId
        } = req.body;

        const newChassis = await Chassis.create({
            fuelType,
            addBelt,
            addAnotherBelt,
            addOilFilter,
            addAnotherOuilFilter,
            hoursePower,
            mfg,
            model,
            name,
            serialId,
            engineModel,
            rvId,
            userId: req.user.id || req.user._id || req.user.userId
        });

        res.status(201).json({
            success: true,
            message: 'Chassis added successfully',
            chassis: newChassis
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add chassis',
            error: error.message
        });
    }
};

// Get all chassis for a user
const getChassis = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id || req.user.userId;
        const chassisList = await Chassis.find({ userId })
            .populate('rvId', 'nickname manufacturer model')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            chassis: chassisList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch chassis',
            error: error.message
        });
    }
};

// Get single chassis by ID
const getChassisById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id || req.user._id || req.user.userId;

        const chassis = await Chassis.findOne({
            _id: id,
            userId
        }).populate('rvId', 'nickname manufacturer model');

        if (!chassis) {
            return res.status(404).json({
                success: false,
                message: 'Chassis not found or unauthorized'
            });
        }

        res.status(200).json({
            success: true,
            chassis
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch chassis',
            error: error.message
        });
    }
};

// Update chassis
const updateChassis = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id || req.user._id || req.user.userId;
        const updateData = req.body;

        const chassis = await Chassis.findOneAndUpdate(
            { _id: id, userId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!chassis) {
            return res.status(404).json({
                success: false,
                message: 'Chassis not found or unauthorized'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Chassis updated successfully',
            chassis
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update chassis',
            error: error.message
        });
    }
};

// Delete chassis
const deleteChassis = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id || req.user._id || req.user.userId;

        const chassis = await Chassis.findOneAndDelete({
            _id: id,
            userId
        });

        if (!chassis) {
            return res.status(404).json({
                success: false,
                message: 'Chassis not found or unauthorized'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Chassis deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete chassis',
            error: error.message
        });
    }
};

module.exports = {
    addChassis,
    getChassis,
    getChassisById,
    updateChassis,
    deleteChassis
};