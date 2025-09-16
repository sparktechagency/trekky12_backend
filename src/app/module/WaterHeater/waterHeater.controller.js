const WaterHeater = require('./WaterHeater');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');

exports.createWaterHeater = asyncHandler(async (req, res) => {
    const waterHeater = await WaterHeater.create(req.body);
    if (!waterHeater) throw new ApiError('waterHeater not created', 500);
    const images = req.files;
    if (!images) throw new ApiError('No images uploaded', 400); 
    
    if (images && images.length > 0) {
        const imagePaths = images.map(image => image.path);
        waterHeater.images = imagePaths;
        await waterHeater.save();
    }

    return res.status(201).json({
        success: true,
        message: 'waterHeater created successfully',
        waterHeater
    });
});


exports.getWaterHeaters = asyncHandler(async (req, res) => {
    const waterHeaters = await WaterHeater.find();
    if (!waterHeaters) throw new ApiError('waterHeaters not found', 404);
    return res.status(200).json({
        success: true,
        message: 'waterHeaters retrieved successfully',
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
    if (!waterHeater) throw new ApiError('waterHeater not found', 404);

    if (req.files && req.files.length > 0) {
        const oldImages = waterHeater.images;
        const newImages = req.files.map(image => image.path.replace('upload/', ''));
        waterHeater.images = [...oldImages, ...newImages];
        await waterHeater.save();

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
        await waterHeater.updateOne(req.body);
    }

    return res.status(200).json({
        success: true,
        message: 'waterHeater updated successfully',
        waterHeater
    });
});

exports.deleteWaterHeater = asyncHandler(async (req, res) => {
    const waterHeater = await WaterHeater.findByIdAndDelete(req.params.id);
    if (!waterHeater) throw new ApiError('waterHeater not found', 404);
    return res.status(200).json({
        success: true,
        message: 'waterHeater deleted successfully',
        waterHeater
    });
});
