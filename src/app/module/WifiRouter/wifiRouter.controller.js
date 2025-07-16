const WifiRouter = require('./WifiRouter');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const deleteFile = require('../../../utils/unlinkFile');

exports.createWifiRouter = asyncHandler(async (req, res) => {
    const wifiRouter = await WifiRouter.create(req.body);
    if (!wifiRouter) throw new ApiError('WifiRouter not created', 500);
    res.status(201).json({
        success: true,
        message: 'WifiRouter created successfully',
        wifiRouter
    });
});

exports.getWifiRouter = asyncHandler(async (req, res) => {
    const wifiRouter = await WifiRouter.find();
    if (!wifiRouter) throw new ApiError('WifiRouter not found', 404);
    return res.status(200).json({
        success: true,
        message: 'WifiRouter retrieved successfully',
        wifiRouter
    });
});

exports.getWifiRouterById = asyncHandler(async (req, res) => {
    const wifiRouter = await WifiRouter.findById(req.params.id);
    if (!wifiRouter) throw new ApiError('WifiRouter not found', 404);
    return res.status(200).json({
        success: true,
        message: 'WifiRouter retrieved successfully',
        wifiRouter
    });
});

exports.updateWifiRouter = asyncHandler(async (req, res) => {
    const wifiRouter = await WifiRouter.findById(req.params.id);
    if (!wifiRouter) throw new ApiError('WifiRouter not found', 404);

    if (req.files && req.files.length > 0) {
        const oldImages = wifiRouter.images;
        const newImages = req.files.map(image => image.path.replace('upload/', ''));
        wifiRouter.images = [...oldImages, ...newImages];
        await wifiRouter.save();

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
        await wifiRouter.updateOne(req.body);
    }

    return res.status(200).json({
        success: true,
        message: 'WifiRouter updated successfully',
        wifiRouter
    });
});

exports.deleteWifiRouter = asyncHandler(async (req, res) => {
    const wifiRouter = await WifiRouter.findByIdAndDelete(req.params.id);
    if (!wifiRouter) throw new ApiError('WifiRouter not found', 404);
    return res.status(200).json({
        success: true,
        message: 'WifiRouter deleted successfully',
        wifiRouter
    });
});