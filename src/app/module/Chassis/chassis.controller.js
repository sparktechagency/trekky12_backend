const Chassis = require('./Chassis');
const { ApiError } = require('../../../errors/errorHandler');
const asyncHandler = require('../../../utils/asyncHandler');

exports.createChassis = asyncHandler(async (req, res) => {
    const chassis = await Chassis.create(req.body);
    return res.status(201).json({
        success: true,
        message: 'Chassis created successfully',
        chassis
    });
});

exports.getChassis = asyncHandler(async (req, res) => {
    const chassis = await Chassis.find();
    if (!chassis) throw new ApiError('Chassis not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Chassis retrieved successfully',
        chassis
    });
});

exports.getChassisById = asyncHandler(async (req, res) => {
    const chassis = await Chassis.findById(req.params.id);
    if (!chassis) throw new ApiError('Chassis not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Chassis retrieved successfully',
        chassis
    });
});

exports.updateChassis = asyncHandler(async (req, res) => {
    const chassis = await Chassis.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!chassis) throw new ApiError('Chassis not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Chassis updated successfully',
        chassis
    });
});

exports.deleteChassis = asyncHandler(async (req, res) => {
    const chassis = await Chassis.findByIdAndDelete(req.params.id);
    if (!chassis) throw new ApiError('Chassis not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Chassis deleted successfully',
        chassis
    });
});
