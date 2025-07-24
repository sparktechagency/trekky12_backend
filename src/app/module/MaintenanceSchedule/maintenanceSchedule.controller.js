const MaintenanceSchedule = require('./MaintenanceSchedule');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const deleteFile = require('../../../utils/unlinkFile');


exports.createMaintenanceSchedule = asyncHandler(async (req, res) => {
    const maintenanceSchedule = await MaintenanceSchedule.create(req.body);
    if (!maintenanceSchedule) throw new ApiError('MaintenanceSchedule not created', 500);
    const images = req.files.map(file => file.path);
    maintenanceSchedule.images = images;
    await maintenanceSchedule.save();
    res.status(201).json({
        success: true,
        message: 'MaintenanceSchedule created successfully',
        maintenanceSchedule
    });
});

exports.getMaintenanceSchedule = asyncHandler(async (req, res) => {
    const maintenanceSchedule = await MaintenanceSchedule.find();
    if (!maintenanceSchedule) throw new ApiError('MaintenanceSchedule not found', 404);
    return res.status(200).json({
        success: true,
        message: 'MaintenanceSchedule retrieved successfully',
        maintenanceSchedule
    });
});

exports.getMaintenanceScheduleById = asyncHandler(async (req, res) => {
    const maintenanceSchedule = await MaintenanceSchedule.findById(req.params.id);
    if (!maintenanceSchedule) throw new ApiError('MaintenanceSchedule not found', 404);
    return res.status(200).json({
        success: true,
        message: 'MaintenanceSchedule retrieved successfully',
        maintenanceSchedule
    });
});

exports.updateMaintenanceSchedule = asyncHandler(async (req, res) => {
    const maintenanceSchedule = await MaintenanceSchedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!maintenanceSchedule) throw new ApiError('MaintenanceSchedule not found', 404);
    const images = req.files.map(file => file.path);
    maintenanceSchedule.images = images;
    await maintenanceSchedule.save();
    res.status(200).json({
        success: true,
        message: 'MaintenanceSchedule updated successfully',
        maintenanceSchedule
    });
});

exports.deleteMaintenanceSchedule = asyncHandler(async (req, res) => {
    const maintenanceSchedule = await MaintenanceSchedule.findByIdAndDelete(req.params.id);
    if (!maintenanceSchedule) throw new ApiError('MaintenanceSchedule not found', 404);
    deleteFile(maintenanceSchedule.images);
    res.status(200).json({
        success: true,
        message: 'MaintenanceSchedule deleted successfully',
        maintenanceSchedule
    });
});
