const AirCondition = require('../Air-condition/Air-condition');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const User = require('../User/User')
const getSelectedRvByUserId = require('../../../utils/currentRv')
const QueryBuilder = require('../../../builder/queryBuilder')

exports.createAirCondition = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const selectedRvId = await getSelectedRvByUserId(userId);
    let rvId = req.body.rvId;
    if(!rvId && !selectedRvId) throw new ApiError('No selected RV found', 404);
    if(!rvId) rvId = selectedRvId;
    const airCondition = await AirCondition.create({ ...req.body, user: userId, rvId });
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
    const userId = req.user.id || req.user._id;
    const selectedRvId = await getSelectedRvByUserId(userId);
    let rvId = req.query.rvId;
    if(!rvId && !selectedRvId) throw new ApiError('No selected RV found', 404);
    if(!rvId) rvId = selectedRvId;
    // Base query with user and RV filters
    const baseQuery = { user: userId, rvId };
    
    // Merge base query with request query parameters
    const mergedQuery = { ...req.query, ...baseQuery };
    
    // Initialize QueryBuilder with the base model query
    const airConditionQuery = new QueryBuilder(
        AirCondition.find(baseQuery),
        req.query
    );
    
    // Apply query builder methods for filtering, sorting, pagination, and field selection
    const airConditions = await airConditionQuery
        .search(['name', 'brand', 'model', 'description']) // Add searchable fields as needed
        .filter()
        .sort()
        .paginate()
        .fields()
        .modelQuery;
    
    // Get pagination metadata
    const meta = await new QueryBuilder(
        AirCondition.find(baseQuery),
        req.query
    ).countTotal();
    
    if (!airConditions || airConditions.length === 0) {
        throw new ApiError('AirConditions not found', 404);
    }
    
    return res.status(200).json({
        success: true,
        message: 'AirConditions retrieved successfully',
        meta,
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
