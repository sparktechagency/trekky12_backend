const WifiRouter = require('./WifiRouter');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const deleteFile = require('../../../utils/unlinkFile');
const deleteDocumentWithFiles = require('../../../utils/deleteDocumentWithImages');

exports.createWifiRouter = asyncHandler(async (req, res) => {
    const wifiRouter = await WifiRouter.create(req.body);
    if (!wifiRouter) throw new ApiError('WifiRouter not created', 500);

    const images = req.files;
    if (!images) throw new ApiError('No images uploaded', 400);

    if (images && images.length > 0) {
        const imagePaths = images.map(image => image.path);
        wifiRouter.images = imagePaths;
        await wifiRouter.save();
    }
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

    Object.keys(req.body).forEach(key => {
        wifiRouter[key] = req.body[key];
    });

    await wifiRouter.save();


    if (req.files && req.files.length > 0) {
        const oldImages = wifiRouter.images;

        // Delete old images from disk
        oldImages.forEach(image => {
            const path = image.split('/').pop();
            try {
                fs.unlinkSync(`${uploadPath}/${path}`);
            } catch (err) {
                if (err.code !== 'ENOENT') {
                    console.error(err);
                }
            }
        });

        // Set only new images
        const newImages = req.files.map(image => image.path.replace('upload/', ''));
        wifiRouter.images = newImages;
    }

    // if (req.files && req.files.length > 0) {
    //     const oldImages = wifiRouter.images;
    //     const newImages = req.files.map(image => image.path.replace('upload/', ''));
    //     wifiRouter.images = [...oldImages, ...newImages];
    //     await wifiRouter.save();

    //     oldImages.forEach(image => {
    //         const path = image.split('/').pop();
    //         try {
    //             deleteFile(`${uploadPath}/${path}`);
    //         } catch (err) {
    //             if (err.code !== 'ENOENT') {
    //                 console.error(err);
    //             }
    //         }
    //     });
    // } else {
    //     await wifiRouter.updateOne(req.body);
    // }

    return res.status(200).json({
        success: true,
        message: 'WifiRouter updated successfully',
        wifiRouter
    });
});

// exports.deleteWifiRouter = asyncHandler(async (req, res) => {
//     const wifiRouter = await WifiRouter.findByIdAndDelete(req.params.id);
//     if (!wifiRouter) throw new ApiError('WifiRouter not found', 404);
//     return res.status(200).json({
//         success: true,
//         message: 'WifiRouter deleted successfully',
//         wifiRouter
//     });
// });


exports.deleteWifiRouter = asyncHandler(async (req, res) => {
    const wifiRouter = await deleteDocumentWithFiles(WifiRouter, req.params.id, "uploads");
    if (!wifiRouter) throw new ApiError("wifiRouter not found", 404);

    return res.status(200).json({
        success: true,
        message: "wifiRouter deleted successfully (with images)",
        wifiRouter,
    });
});