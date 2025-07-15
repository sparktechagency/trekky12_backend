const WaterPump = require('./WaterPump');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const fs = require('fs');
const path = require('path');

const deleteFile = require('../../../utils/unlinkFile');

const uploadPath = path.join(__dirname, '../uploads');

exports.createWaterPump = asyncHandler(async (req, res) => {
    const waterPump = await WaterPump.create(req.body);
    const images = req.files;
    if (!waterPump) throw new ApiError('WaterPump not created', 500);
    
    if (images && images.length > 0) {
        const imagePaths = images.map(image => image.path);
        waterPump.images = imagePaths;
        await waterPump.save();
    }
    res.status(201).json({
        success: true,
        message: 'WaterPump created successfully',
        waterPump
    });
});


exports.getWaterPumps = asyncHandler(async (req, res) => {
    const waterPumps = await WaterPump.find();
    if (!waterPumps) throw new ApiError('WaterPumps not found', 404);
    return res.status(200).json({
        success: true,
        message: 'WaterPumps retrieved successfully',
        waterPumps
    });
});


exports.getWaterPumpById = asyncHandler(async (req, res) => {
    const waterPump = await WaterPump.findById(req.params.id);
    if (!waterPump) throw new ApiError('WaterPump not found', 404);
    return res.status(200).json({
        success: true,
        message: 'WaterPump retrieved successfully',
        waterPump
    });
});


exports.updateWaterPump = asyncHandler(async (req, res) => {
    const waterPump = await WaterPump.findById(req.params.id);
    if (!waterPump) throw new ApiError('WaterPump not found', 404);

    if (req.files && req.files.length > 0) {
        const oldImages = waterPump.images;
        const newImages = req.files.map(image => image.path.replace('upload/', ''));
        waterPump.images = [...oldImages, ...newImages];
        await waterPump.save();

        oldImages.forEach(image => {
            const path = image.split('/').pop();
            try {
                deleteFile(`${uploadPath}/${path}`);
            } catch (err) {
                if (err.code !== 'ENOENT') {
                    console.error(err);
                }
            }
        });
    } else {
        await waterPump.updateOne(req.body);
    }

    return res.status(200).json({
        success: true,
        message: 'WaterPump updated successfully',
        waterPump
    });
});

exports.deleteWaterPump = asyncHandler(async (req, res) => {
    const waterPump = await WaterPump.findByIdAndDelete(req.params.id);
    if (!waterPump) throw new ApiError('WaterPump not found', 404);
    return res.status(200).json({
        success: true,
        message: 'WaterPump deleted successfully',
        waterPump
    });
});
