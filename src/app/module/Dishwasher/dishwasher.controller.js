const Dishwasher = require('./Dishwasher');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const QueryBuilder = require('../../../builder/queryBuilder');
const deleteDocumentWithFiles = require('../../../utils/deleteDocumentWithImages');
const getSelectedRvByUserId = require('../../../utils/currentRv');
const User = require('../../module/User/User');

exports.createDishwasher = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const selectedRvId = await getSelectedRvByUserId(userId);
    // console.log(selectedRvId)
    let rvId = req.body.rvId;
    console.log(rvId)
    
    if(!rvId && !selectedRvId) throw new ApiError('No selected RV found', 404);
    if(!rvId) {
        // console.log("selectedRvId", selectedRvId)
        rvId = selectedRvId;
    };

    
    const dishwasher = await Dishwasher.create({
        rvId,
        ...req.body,
        user: userId,
    });

    if (!dishwasher) throw new ApiError('Dishwasher not created', 500);

    const images = req.files;
    if (images && images.length > 0) {
        const imagePaths = images.map(image => image.location);
        dishwasher.images = imagePaths;
        await dishwasher.save();
    }

    return res.status(201).json({
        success: true,
        message: 'Dishwasher created successfully',
        dishwasher
    });
});

exports.getDishwashers = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    // console.log(userId)
    const user = await User.findById(userId);
    console.log(user)
    const selectedRvId = await getSelectedRvByUserId(userId);
    console.log(selectedRvId)
    let rvId = req.query.rvId;
    console.log(rvId)
    if(!rvId && !selectedRvId) throw new ApiError('No selected RV found', 404);
    if(!rvId) rvId = selectedRvId;

    // console.log(rvId)
    
    const baseQuery = { user: userId, rvId };
    
    const dishwasherQuery = new QueryBuilder(
        Dishwasher.find(baseQuery),
        req.query
    )
    .search(['name', 'brand', 'model'])
    .filter()
    .sort()
    .paginate()
    .fields();

    const dishwashers = await dishwasherQuery.modelQuery;
    
    const meta = await new QueryBuilder(
        Dishwasher.find(baseQuery),
        req.query
    ).countTotal();

    if (!dishwashers || dishwashers.length === 0) {
        throw new ApiError('No dishwashers found', 404);
    }

    return res.status(200).json({
        success: true,
        message: 'Dishwashers retrieved successfully',
        meta,
        dishwashers
    });
});

exports.getDishwasherById = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const dishwasher = await Dishwasher.findOne({ _id: req.params.id, user: userId });
    
    if (!dishwasher) throw new ApiError('Dishwasher not found', 404);
    
    return res.status(200).json({
        success: true,
        message: 'Dishwasher retrieved successfully',
        dishwasher
    });
});

exports.updateDishwasher = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const update = { ...req.body };
    
    if (req.files && req.files.length > 0) {
        // Get current dishwasher to delete old images
        const currentDishwasher = await Dishwasher.findById(req.params.id);
        if (currentDishwasher && currentDishwasher.images) {
            // Delete old images from storage if needed
            // This depends on your storage solution
        }
        
        // Set new images
        update.images = req.files.map(file => file.location);
    }
    
    const dishwasher = await Dishwasher.findOneAndUpdate(
        { _id: req.params.id, user: userId },
        update,
        { new: true, runValidators: true }
    );
    
    if (!dishwasher) throw new ApiError('Dishwasher not found', 404);
    
    return res.status(200).json({
        success: true,
        message: 'Dishwasher updated successfully',
        dishwasher
    });
});

exports.deleteDishwasher = asyncHandler(async (req, res) => {
    const dishwasher = await deleteDocumentWithFiles(Dishwasher, req.params.id, "uploads");
    if (!dishwasher) throw new ApiError("Dishwasher not found", 404);

    return res.status(200).json({
        success: true,
        message: "Dishwasher deleted successfully (with images)",
        dishwasher,
    });
});
