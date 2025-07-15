const Dryer = require('./Dryer');

const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');

exports.createDryer = asyncHandler(async (req, res) => {
    const dryer = await Dryer.create(req.body);
    if (!dryer) throw new ApiError('Dryer not created', 500);
    const images = req.files;
    if (!images) throw new ApiError('No images uploaded', 400); 
    
    if (images && images.length > 0) {
        const imagePaths = images.map(image => image.path);
        dryer.images = imagePaths;
        await dryer.save();
    }

    return res.status(201).json({
        success: true,
        message: 'Dryer created successfully',
        dryer
    });
});

exports.getDryers = asyncHandler(async (req, res) => {
    const dryers = await Dryer.find();
    if (!dryers) throw new ApiError('Dryers not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Dryers retrieved successfully',
        dryers
    });
});

exports.getDryerById = asyncHandler(async (req, res) => {
    const dryer = await Dryer.findById(req.params.id);
    if (!dryer) throw new ApiError('Dryer not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Dryer retrieved successfully',
        dryer
    });
});

exports.updateDryer = asyncHandler(async (req, res) => {
    const dryer = await Dryer.findById(req.params.id);
    if (!dryer) throw new ApiError('Dryer not found', 404);

    if (req.files && req.files.length > 0) {
        const oldImages = dryer.images;
        const newImages = req.files.map(image => image.path.replace('upload/', ''));
        dryer.images = [...oldImages, ...newImages];
        await dryer.save();

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
        await dryer.updateOne(req.body);
    }

    return res.status(200).json({
        success: true,
        message: 'Dryer updated successfully',
        dryer
    });
});

exports.deleteDryer = asyncHandler(async (req, res) => {
    const dryer = await Dryer.findByIdAndDelete(req.params.id);
    if (!dryer) throw new ApiError('Dryer not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Dryer deleted successfully',
        dryer
    });
});
