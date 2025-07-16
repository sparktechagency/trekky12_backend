const Gps = require('./Gps');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');

exports.createGps = asyncHandler(async (req, res) => {
    const gps = await Gps.create(req.body);
    if (!gps) throw new ApiError('Gps not created', 500);
    res.status(201).json({
        success: true,
        message: 'Gps created successfully',
        gps
    });
});

exports.getGps = asyncHandler(async (req, res) => {
    const gps = await Gps.find();
    if (!gps) throw new ApiError('Gps not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Gps retrieved successfully',
        gps
    });
});

exports.getGpsById = asyncHandler(async (req, res) => {
    const gps = await Gps.findById(req.params.id);
    if (!gps) throw new ApiError('Gps not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Gps retrieved successfully',
        gps
    });
});


exports.updateGps = asyncHandler(async (req, res) => {
    const gps = await Gps.findById(req.params.id);
    if (!gps) throw new ApiError('Gps not found', 404);

    if (req.files && req.files.length > 0) {
        const oldImages = gps.images;
        const newImages = req.files.map(image => image.path.replace('upload/', ''));
        gps.images = [...oldImages, ...newImages];
        await gps.save();

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
        await gps.updateOne(req.body);
    }

    return res.status(200).json({
        success: true,
        message: 'Gps updated successfully',
        gps
    });
});

exports.deleteGps = asyncHandler(async (req, res) => {  
    const gps = await Gps.findByIdAndDelete(req.params.id);
    if (!gps) throw new ApiError('Gps not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Gps deleted successfully',
        gps
    });
}); 