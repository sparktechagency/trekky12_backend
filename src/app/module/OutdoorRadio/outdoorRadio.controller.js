const OutdoorRadio = require('./OutdoorRadio');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const fs = require('fs');
const path = require('path');
const QueryBuilder = require('../../../builder/queryBuilder');
const deleteDocumentWithFiles = require('../../../utils/deleteDocumentWithImages');
const getSelectedRvByUserId = require('../../../utils/currentRv');
const deleteFile = require('../../../utils/unlinkFile');
const uploadPath = path.join(__dirname, '../uploads');

exports.createOutdoorRadio = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const selectedRvId = await getSelectedRvByUserId(userId);
    let rvId = req.body.rvId;
    if(!rvId && !selectedRvId) throw new ApiError('No selected RV found', 404);
    if(!rvId) rvId = selectedRvId;
    
    const outdoorRadio = await OutdoorRadio.create({
        rvId,
        ...req.body,
        user: userId,
    });
    
    const images = req.files;
    if (!outdoorRadio) throw new ApiError('OutdoorRadio not created', 500);

    if (images && images.length > 0) {
        const imagePaths = images.map(image => image.location);
        outdoorRadio.images = imagePaths;
        await outdoorRadio.save();
    }

    res.status(201).json({
        success: true,
        message: 'OutdoorRadio created successfully',
        outdoorRadio
    });
});

exports.getOutdoorRadio = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const selectedRvId = await getSelectedRvByUserId(userId);
    let rvId = req.query.rvId;
    if(!rvId && !selectedRvId) throw new ApiError('No selected RV found', 404);
    if(!rvId) rvId = selectedRvId;
    
    const baseQuery = { user: userId, rvId };
    const s = { ...req.query, ...baseQuery };

    const outdoorRadioQuery = new QueryBuilder(
        OutdoorRadio.find(baseQuery),
        req.query
    )
    
    const outdoorRadios = await outdoorRadioQuery
        .search(['name', 'brand'])
        .filter()
        .sort()
        .paginate()
        .fields()
        .modelQuery;

    const meta = await new QueryBuilder(
        OutdoorRadio.find(baseQuery),
        req.query
    ).countTotal();

    if (!outdoorRadios || outdoorRadios.length === 0) {
        throw new ApiError('OutdoorRadios not found', 404);
    }

    return res.status(200).json({
        success: true,
        message: 'OutdoorRadios retrieved successfully',
        meta,
        outdoorRadios
    });
});

exports.getOutdoorRadioById = asyncHandler(async (req, res) => {
    const outdoorRadio = await OutdoorRadio.findById(req.params.id);
    if (!outdoorRadio) throw new ApiError('OutdoorRadio not found', 404);
    return res.status(200).json({
        success: true,
        message: 'OutdoorRadio retrieved successfully',
        outdoorRadio
    });
});

exports.updateOutdoorRadio = asyncHandler(async (req, res) => {
    const outdoorRadio = await OutdoorRadio.findById(req.params.id);
    if (!outdoorRadio) throw new ApiError('OutdoorRadio not found', 404);

    // Update outdoorRadio fields from req.body
    Object.keys(req.body).forEach(key => {
        outdoorRadio[key] = req.body[key];
    });

    await outdoorRadio.save();

    if (req.files && req.files.length > 0) {
        const oldImages = outdoorRadio.images;

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
        outdoorRadio.images = newImages;
        await outdoorRadio.save();
    }

    return res.status(200).json({
        success: true,
        message: 'OutdoorRadio updated successfully',
        outdoorRadio
    });
});

exports.deleteOutdoorRadio = asyncHandler(async (req, res) => {
    const outdoorRadio = await deleteDocumentWithFiles(OutdoorRadio, req.params.id, "uploads");
    if (!outdoorRadio) throw new ApiError("OutdoorRadio not found", 404);

    return res.status(200).json({
        success: true,
        message: "OutdoorRadio deleted successfully (with images)",
        outdoorRadio,
    });
});