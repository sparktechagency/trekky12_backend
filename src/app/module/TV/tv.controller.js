const Tv = require('./Tv');

const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');

exports.createTv = asyncHandler(async (req, res) => {
    const tv = await Tv.create(req.body);
    if (!tv) throw new ApiError('Tv not created', 500);
    const images = req.files;
    if (!images) throw new ApiError('No images uploaded', 400); 
    
    if (images && images.length > 0) {
        const imagePaths = images.map(image => image.path);
        tv.images = imagePaths;
        await tv.save();
    }

    return res.status(201).json({
        success: true,
        message: 'Tv created successfully',
        tv
    });
});

exports.getTv = asyncHandler(async (req, res) => {
    const tv = await Tv.findById(req.params.id);
    if (!tv) throw new ApiError('Tv not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Tv retrieved successfully',
        tv
    });
});

exports.updateTv = asyncHandler(async (req, res) => {
    const tv = await Tv.findById(req.params.id);
    if (!tv) throw new ApiError('Tv not found', 404);

    if (req.files && req.files.length > 0) {
        const oldImages = tv.images;
        const newImages = req.files.map(image => image.path.replace('upload/', ''));
        tv.images = [...oldImages, ...newImages];
        await tv.save();

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
        await tv.updateOne(req.body);
    }

    return res.status(200).json({
        success: true,
        message: 'Tv updated successfully',
        tv
    });
});

exports.deleteTv = asyncHandler(async (req, res) => {
    const tv = await Tv.findByIdAndDelete(req.params.id);
    if (!tv) throw new ApiError('Tv not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Tv deleted successfully',
        tv
    });
});

exports.getTvs = asyncHandler(async (req, res) => {
    const tvs = await Tv.find();
    if (!tvs) throw new ApiError('Tvs not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Tvs retrieved successfully',
        tvs
    });
});

exports.deleteTv = asyncHandler(async (req, res) => {
    const tv = await Tv.findByIdAndDelete(req.params.id);
    if (!tv) throw new ApiError('Tv not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Tv deleted successfully',
        tv
    });
});

