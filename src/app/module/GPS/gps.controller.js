const Gps = require('./Gps');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const fs = require('fs');
const path = require('path');
const QueryBuilder = require('../../../builder/queryBuilder');
const deleteDocumentWithFiles = require('../../../utils/deleteDocumentWithImages');
const getSelectedRvByUserId = require('../../../utils/currentRv');
const deleteFile = require('../../../utils/unlinkFile');
const uploadPath = path.join(__dirname, '../uploads');

exports.createGps = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const selectedRvId = await getSelectedRvByUserId(userId);
    let rvId = req.body.rvId;
    if(!rvId && !selectedRvId) throw new ApiError('No selected RV found', 404);
    if(!rvId) rvId = selectedRvId;
    
    const gps = await Gps.create({
        rvId,
        ...req.body,
        user: userId,
    });
    
    const images = req.files;
    if (!gps) throw new ApiError('GPS device not created', 500);

    if (images && images.length > 0) {
        const imagePaths = images.map(image => image.location);
        gps.images = imagePaths;
        await gps.save();
    }

    res.status(201).json({
        success: true,
        message: 'GPS device created successfully',
        gps
    });
});

exports.getGps = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const selectedRvId = await getSelectedRvByUserId(userId);
    let rvId = req.query.rvId;
    if(!rvId && !selectedRvId) throw new ApiError('No selected RV found', 404);
    if(!rvId) rvId = selectedRvId;
    
    const baseQuery = { user: userId, rvId };

    const gpsQuery = new QueryBuilder(
        Gps.find(baseQuery),
        req.query
    )
    
    const gps = await gpsQuery
        .search(['name', 'brand', 'modelNumber'])
        .filter()
        .sort()
        .paginate()
        .fields()
        .modelQuery;

    const meta = await new QueryBuilder(
        Gps.find(baseQuery),
        req.query
    ).countTotal();

    if (!gps || gps.length === 0) {
        throw new ApiError('GPS devices not found', 404);
    }

    return res.status(200).json({
        success: true,
        message: 'GPS devices retrieved successfully',
        meta,
        gps
    });
});

exports.getGpsById = asyncHandler(async (req, res) => {
    const gps = await Gps.findById(req.params.id);
    if (!gps) throw new ApiError('GPS device not found', 404);
    return res.status(200).json({
        success: true,
        message: 'GPS device retrieved successfully',
        gps
    });
});

exports.updateGps = asyncHandler(async (req, res) => {
    const gps = await Gps.findById(req.params.id);
    if (!gps) throw new ApiError('GPS device not found', 404);

    // Update GPS device fields from req.body
    Object.keys(req.body).forEach(key => {
        gps[key] = req.body[key];
    });

    await gps.save();

    if (req.files && req.files.length > 0) {
        const oldImages = gps.images;

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
        const newImages = req.files.map(image => image.location);
        gps.images = newImages;
        await gps.save();
    }

    return res.status(200).json({
        success: true,
        message: 'GPS device updated successfully',
        gps
    });
});

exports.deleteGps = asyncHandler(async (req, res) => {
    const gps = await deleteDocumentWithFiles(Gps, req.params.id, "uploads");
    if (!gps) throw new ApiError("GPS device not found", 404);

    return res.status(200).json({
        success: true,
        message: "GPS device deleted successfully (with images)",
        gps,
    });
});
