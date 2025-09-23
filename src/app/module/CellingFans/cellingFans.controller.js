const CellingFans = require('./CellingFans');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');



exports.createCellingFans = asyncHandler(async (req, res) => {
    const cellingFans = await CellingFans.create(req.body);
    if (!cellingFans) throw new ApiError('CellingFans not created', 500);
    const images = req.files;
    if (!images) throw new ApiError('No images uploaded', 400); 
    
    if (images && images.length > 0) {
        const imagePaths = images.map(image => image.path);
        cellingFans.images = imagePaths;
        await cellingFans.save();
    }

    return res.status(201).json({
        success: true,
        message: 'CellingFans created successfully',
        cellingFans
    });
});


exports.getCellingFans = asyncHandler(async (req, res) => {
    const cellingFans = await CellingFans.find();
    if (!cellingFans) throw new ApiError('CellingFans not found', 404);
    return res.status(200).json({
        success: true,
        message: 'CellingFans retrieved successfully',
        cellingFans
    });
});

exports.getCellingFansById = asyncHandler(async (req, res) => {
    const cellingFans = await CellingFans.findById(req.params.id);
    if (!cellingFans) throw new ApiError('CellingFans not found', 404);
    return res.status(200).json({
        success: true,
        message: 'CellingFans retrieved successfully',
        cellingFans
    });
});


exports.updateCellingFans = asyncHandler(async (req, res) => {
    const cellingFans = await CellingFans.findById(req.params.id);
    if (!cellingFans) throw new ApiError('CellingFans not found', 404);

    if (req.files && req.files.length > 0) {
        const oldImages = cellingFans.images;
        const newImages = req.files.map(image => image.path.replace('upload/', ''));
        cellingFans.images = [...oldImages, ...newImages];
        await cellingFans.save();

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
        await cellingFans.updateOne(req.body);
    }

    return res.status(200).json({
        success: true,
        message: 'CellingFans updated successfully',
        cellingFans
    });
});


exports.deleteCellingFans = asyncHandler(async (req, res) => {
    const cellingFans = await CellingFans.findByIdAndDelete(req.params.id);
    if (!cellingFans) throw new ApiError('CellingFans not found', 404);
    return res.status(200).json({
        success: true,
        message: 'CellingFans deleted successfully',
        cellingFans
    });
});


