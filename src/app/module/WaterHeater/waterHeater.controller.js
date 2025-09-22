const WaterHeater = require('./WaterHeater');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const fs = require('fs');
const path = require('path');
const QueryBuilder = require('../../../builder/queryBuilder');
const deleteDocumentWithFiles = require('../../../utils/deleteDocumentWithImages');
const getSelectedRvByUserId = require('../../../utils/currentRv')
const deleteFile = require('../../../utils/unlinkFile');

const uploadPath = path.join(__dirname, '../uploads');

exports.createWaterHeater = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const selectedRvId = await getSelectedRvByUserId(userId);
    let rvId = req.body.rvId;
    if(!rvId && !selectedRvId) throw new ApiError('No selected RV found', 404);
    if(!rvId) rvId = selectedRvId;
    const waterHeater = await WaterHeater.create({
        rvId,
        ...req.body,
        user: userId,
    });
    const images = req.files;
    if (!waterHeater) throw new ApiError('WaterHeater not created', 500);

    if (images && images.length > 0) {
        const imagePaths = images.map(image => image.path);
        waterHeater.images = imagePaths;
        await waterHeater.save();
    }

    res.status(201).json({
        success: true,
        message: 'WaterHeater created successfully',
        waterHeater
    });
});


exports.getWaterHeater = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const selectedRvId = await getSelectedRvByUserId(userId);
    let rvId = req.query.rvId;
    if(!rvId && !selectedRvId) throw new ApiError('No selected RV found', 404);
    if(!rvId) rvId = selectedRvId;
    const baseQuery = { user: userId, rvId };
    const s = { ...req.query, ...baseQuery };

    const waterHeatersQuery = new QueryBuilder(
        WaterHeater.find(baseQuery),
        req.query
    )
    
    const waterHeaters = await waterHeatersQuery
        .search(['name', 'modelNumber'])
        .filter()
        .sort()
        .paginate()
        .fields()
        .modelQuery;

    const meta = await new QueryBuilder(
        WaterHeater.find(baseQuery),
        req.query
    ).countTotal();

    if (!waterHeaters || waterHeaters.length === 0) {
        throw new ApiError('WaterHeaters not found', 404);
    }

    return res.status(200).json({
        success: true,
        message: 'WaterHeater retrieved successfully',
        meta,
        waterHeaters
    });
});


exports.getWaterHeaterById = asyncHandler(async (req, res) => {
    const waterHeater = await WaterHeater.findById(req.params.id);
    if (!waterHeater) throw new ApiError('waterHeater not found', 404);
    return res.status(200).json({
        success: true,
        message: 'waterHeater retrieved successfully',
        waterHeater
    });
});



exports.updateWaterHeater = asyncHandler(async (req, res) => {
    const waterHeater = await WaterHeater.findById(req.params.id);
    if (!waterHeater) throw new ApiError('WaterHeater not found', 404);


    // Update waterHeater fields from req.body
    Object.keys(req.body).forEach(key => {
        waterHeater[key] = req.body[key];
    });

    await waterHeater.save();

    if (req.files && req.files.length > 0) {
        const oldImages = waterHeater.images;

        // Delete old images from disk
        oldImages.forEach(image => {
            const path = image.split('/').pop();
            try {
                fs.unlinkSync(`${uploadPath}/${path}`);
            } catch (err) {
                if (err.code !== 'ENOENT') {
                    console.error(err);
                }
            }
        });

        // Set only new images
        const newImages = req.files.map(image => image.path.replace('upload/', ''));
        waterHeater.images = newImages;
    }

    return res.status(200).json({
        success: true,
        message: 'WaterHeater updated successfully',
        waterHeater
    });
});

exports.deleteWaterHeater = asyncHandler(async (req, res) => {
    const waterHeater = await deleteDocumentWithFiles(WaterHeater, req.params.id, "uploads");
    if (!waterHeater) throw new ApiError("WaterHeater not found", 404);

    return res.status(200).json({
        success: true,
        message: "WaterHeater deleted successfully",
        waterHeater,
    });
});
