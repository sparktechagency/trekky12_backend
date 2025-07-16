const InternetSatellite = require('./InternetSatellite');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');

exports.createInternetSatellite = asyncHandler(async (req, res) => {
    const internetSatellite = await InternetSatellite.create(req.body);
    if (!internetSatellite) throw new ApiError('InternetSatellite not created', 500);
    res.status(201).json({
        success: true,
        message: 'InternetSatellite created successfully',
        internetSatellite
    });
});

exports.getInternetSatellite = asyncHandler(async (req, res) => {
    const internetSatellite = await InternetSatellite.find();
    if (!internetSatellite) throw new ApiError('InternetSatellite not found', 404);
    return res.status(200).json({
        success: true,
        message: 'InternetSatellite retrieved successfully',
        internetSatellite
    });
});

exports.getInternetSatelliteById = asyncHandler(async (req, res) => {
    const internetSatellite = await InternetSatellite.findById(req.params.id);
    if (!internetSatellite) throw new ApiError('InternetSatellite not found', 404);
    return res.status(200).json({
        success: true,
        message: 'InternetSatellite retrieved successfully',
        internetSatellite
    });
});

exports.updateInternetSatellite = asyncHandler(async (req, res) => {
    const internetSatellite = await InternetSatellite.findById(req.params.id);
    if (!internetSatellite) throw new ApiError('InternetSatellite not found', 404);

    if (req.files && req.files.length > 0) {
        const oldImages = internetSatellite.images;
        const newImages = req.files.map(image => image.path.replace('upload/', ''));
        internetSatellite.images = [...oldImages, ...newImages];
        await internetSatellite.save();

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
        await internetSatellite.updateOne(req.body);
    }

    return res.status(200).json({
        success: true,
        message: 'InternetSatellite updated successfully',
        internetSatellite
    }); 
});

exports.deleteInternetSatellite = asyncHandler(async (req, res) => {
    const internetSatellite = await InternetSatellite.findByIdAndDelete(req.params.id);
    if (!internetSatellite) throw new ApiError('InternetSatellite not found', 404);
    return res.status(200).json({
        success: true,
        message: 'InternetSatellite deleted successfully',
        internetSatellite
    });
});
