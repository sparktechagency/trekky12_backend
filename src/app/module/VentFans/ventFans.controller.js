const VentFans = require('./VentFans');

const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');

exports.createVentFans = asyncHandler(async (req, res) => {
    const ventFans = await VentFans.create(req.body);
    if (!ventFans) throw new ApiError('VentFans not created', 500);
    const images = req.files;
    if (!images) throw new ApiError('No images uploaded', 400); 
    
    if (images && images.length > 0) {
        const imagePaths = images.map(image => image.path);
        ventFans.images = imagePaths;
        await ventFans.save();
    }

    return res.status(201).json({
        success: true,
        message: 'VentFans created successfully',
        ventFans
    });
});



exports.getVentFans = asyncHandler(async (req, res) => {
    const ventFans = await VentFans.find();
    if (!ventFans) throw new ApiError('VentFans not found', 404);
    return res.status(200).json({
        success: true,
        message: 'VentFans retrieved successfully',
        ventFans
    });
});

exports.getVentFansById = asyncHandler(async (req, res) => {
    const ventFans = await VentFans.findById(req.params.id);
    if (!ventFans) throw new ApiError('VentFans not found', 404);
    return res.status(200).json({
        success: true,
        message: 'VentFans retrieved successfully',
        ventFans
    });
});


exports.deleteVentFans = asyncHandler(async (req, res) => {
    const ventFans = await VentFans.findByIdAndDelete(req.params.id);
    if (!ventFans) throw new ApiError('VentFans not found', 404);
    return res.status(200).json({
        success: true,
        message: 'VentFans deleted successfully',
        ventFans
    });
});

exports.updateVentFans = asyncHandler(async (req, res) => {
    const ventFans = await VentFans.findById(req.params.id);
    if (!ventFans) throw new ApiError('VentFans not found', 404);

    if (req.files && req.files.length > 0) {
        const oldImages = ventFans.images;
        const newImages = req.files.map(image => image.path.replace('upload/', ''));
        ventFans.images = [...oldImages, ...newImages];
        await ventFans.save();

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
        await ventFans.updateOne(req.body);
    }

    return res.status(200).json({
        success: true,
        message: 'VentFans updated successfully',
        ventFans
    });
});
