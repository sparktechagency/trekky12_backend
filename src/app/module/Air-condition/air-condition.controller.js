const AirCondition = require('../Air-condition/Air-condition');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');

exports.createAirCondition = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const airCondition = await AirCondition.create({ ...req.body, user: userId });
    const images = req.files;
    if (!airCondition) throw new ApiError('AirCondition not created', 500);
    
    if (images && images.length > 0) {
        const imagePaths = images.map(image => image.path);
        airCondition.images = imagePaths;
        await airCondition.save();
    }
    res.status(201).json({
        success: true,
        message: 'AirCondition created successfully',
        airCondition
    });
});


exports.getAirConditions = asyncHandler(async (req, res) => {
    const airConditions = await AirCondition.find({ user: req.user._id });
    if (!airConditions) throw new ApiError('AirConditions not found', 404);
    return res.status(200).json({
        success: true,
        message: 'AirConditions retrieved successfully',
        airConditions
    });
});


exports.getAirConditionById = asyncHandler(async (req, res) => {
    const airCondition = await AirCondition.findById(req.params.id);
    if (!airCondition) throw new ApiError('AirCondition not found', 404);
    return res.status(200).json({
        success: true,
        message: 'AirCondition retrieved successfully',
        airCondition
    });
});


exports.updateAirCondition = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const airCondition = await AirCondition.findByIdAndUpdate(req.params.id, { ...req.body, user: userId }, { new: true });
    if (!airCondition) throw new ApiError('AirCondition not found', 404);
    return res.status(200).json({
        success: true,
        message: 'AirCondition updated successfully',
        airCondition
    });
});


exports.deleteAirCondition = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const airCondition = await AirCondition.findByIdAndDelete(req.params.id, { user: userId });
    if (!airCondition) throw new ApiError('AirCondition not found', 404);
    return res.status(200).json({
        success: true,
        message: 'AirCondition deleted successfully',
        airCondition
    });
});
