const MaintenanceSchedule = require('./MaintenanceSchedule');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const getSelectedRvByUserId = require('../../../utils/currentRv');
const User = require('../../module/User/User');
const checkValidRv = require('../../../utils/checkValidRv');

// @desc    Create a new maintenance schedule
// @route   POST /api/v1/maintenance-schedule
// @access  Private
exports.createMaintenanceSchedule = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const selectedRvId = await getSelectedRvByUserId(userId);
    
    // Use provided rvId or fallback to selected RV
    let rvId = req.body?.rvId;
    if (!rvId && !selectedRvId) {
        throw new ApiError('No RV selected. Please select an RV first.', 400);
    }
    if (!rvId) rvId = selectedRvId;

    // Verify the user has access to the specified RV
    // This assumes you have a function to check RV ownership
    const hasAccess = await checkValidRv(userId, rvId);
    if (!hasAccess) {
        throw new ApiError('You do not have permission to add maintenance for this RV', 403);
    }

    const maintenanceSchedule = await MaintenanceSchedule.create({
        ...req.body,
        user: userId,
        rvId
    });

    if (!maintenanceSchedule) {
        throw new ApiError('Failed to create maintenance schedule', 500);
    }

    res.status(201).json({
        success: true,
        message: 'Maintenance schedule created successfully',
        data: maintenanceSchedule
    });
});

// @desc    Get all maintenance schedules with filtering
// @route   GET /api/v1/maintenance-schedule
// @access  Private
exports.getMaintenanceSchedule = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const selectedRvId = await getSelectedRvByUserId(userId);
    
    let rvId = req.query.rvId;
    if (!rvId && !selectedRvId) {
        throw new ApiError('No RV selected. Please select an RV first.', 400);
    }
    if (!rvId) rvId = selectedRvId;

    // Verify the user has access to the specified RV
    const hasAccess = await checkRvOwnership(userId, rvId);
    if (!hasAccess) {
        throw new ApiError('You do not have permission to view maintenance for this RV', 403);
    }
    
    const maintenanceSchedules = await MaintenanceSchedule.find({
        user: userId,
        rvId
    });

    res.status(200).json({
        success: true,
        message: 'Maintenance schedules retrieved successfully',
        data: maintenanceSchedules
    });
});

// @desc    Get single maintenance schedule by ID
// @route   GET /api/v1/maintenance-schedule/:id
// @access  Private
exports.getMaintenanceScheduleById = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    
    const maintenanceSchedule = await MaintenanceSchedule.findOne({
        _id: req.params.id,
        user: userId
    });

    if (!maintenanceSchedule) {
        throw new ApiError('Maintenance schedule not found or access denied', 404);
    }

    res.status(200).json({
        success: true,
        message: 'Maintenance schedule retrieved successfully',
        data: maintenanceSchedule
    });
});

// @desc    Update a maintenance schedule
// @route   PUT /api/v1/maintenance-schedule/:id
// @access  Private
exports.updateMaintenanceSchedule = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    
    // First find the existing maintenance schedule
    const existingSchedule = await MaintenanceSchedule.findOne({
        _id: req.params.id,
        user: userId
    });

    if (!existingSchedule) {
        throw new ApiError('Maintenance schedule not found or access denied', 404);
    }

    // If rvId is being updated, verify the user has access to the new RV
    if (req.body.rvId && req.body.rvId !== existingSchedule.rvId.toString()) {
        const hasAccess = await checkRvOwnership(userId, req.body.rvId);
        if (!hasAccess) {
            throw new ApiError('You do not have permission to assign maintenance to this RV', 403);
        }
    }

    const maintenanceSchedule = await MaintenanceSchedule.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        message: 'Maintenance schedule updated successfully',
        data: maintenanceSchedule
    });
});

// @desc    Delete a maintenance schedule
// @route   DELETE /api/v1/maintenance-schedule/:id
// @access  Private
exports.deleteMaintenanceSchedule = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    
    const maintenanceSchedule = await MaintenanceSchedule.findOneAndDelete({
        _id: req.params.id,
        user: userId
    });

    if (!maintenanceSchedule) {
        throw new ApiError('Maintenance schedule not found or access denied', 404);
    }

    res.status(200).json({
        success: true,
        message: 'Maintenance schedule deleted successfully',
        data: {}
    });
});

// Helper function to check if user has access to the RV
async function checkRvOwnership(userId, rvId) {
    // Check if the user has the specified RV in their user schema
    const user = await User.findById(userId).select('rvIds');
    if (!user || !user.rvIds.includes(rvId)) {
        return false;
    }
    return true;
}
