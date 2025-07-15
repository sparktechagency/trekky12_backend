const Washer = require('./Washer');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');

exports.createWasher = asyncHandler(async (req, res) => {
    const washer = await Washer.create(req.body);
    if (!washer) throw new ApiError('Washer not created', 500);
    const images = req.files;
    if (!images) throw new ApiError('No images uploaded', 400); 
    
    if (images && images.length > 0) {
        const imagePaths = images.map(image => image.path);
        washer.images = imagePaths;
        await washer.save();
    }

    return res.status(201).json({
        success: true,
        message: 'Washer created successfully',
        washer
    });
});


exports.getWashers = asyncHandler(async (req, res) => {
    const washers = await Washer.find();
    if (!washers) throw new ApiError('Washers not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Washers retrieved successfully',
        washers
    });
});


exports.getWasherById = asyncHandler(async (req, res) => {
    const washer = await Washer.findById(req.params.id);
    if (!washer) throw new ApiError('Washer not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Washer retrieved successfully',
        washer
    });
});



exports.updateWasher = asyncHandler(async (req, res) => {
    const washer = await Washer.findById(req.params.id);
    if (!washer) throw new ApiError('Washer not found', 404);

    if (req.files && req.files.length > 0) {
        const oldImages = washer.images;
        const newImages = req.files.map(image => image.path.replace('upload/', ''));
        washer.images = [...oldImages, ...newImages];
        await washer.save();

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
        await washer.updateOne(req.body);
    }

    return res.status(200).json({
        success: true,
        message: 'Washer updated successfully',
        washer
    });
});

exports.deleteWasher = asyncHandler(async (req, res) => {
    const washer = await Washer.findByIdAndDelete(req.params.id);
    if (!washer) throw new ApiError('Washer not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Washer deleted successfully',
        washer
    });
});
