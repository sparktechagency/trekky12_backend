const Gps = require('./Gps');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const deleteDocumentWithFiles = require('../../../utils/deleteDocumentWithImages');

exports.createGps = asyncHandler(async (req, res) => {
    const gps = await Gps.create(req.body);
    if (!gps) throw new ApiError('gps not created', 500);
    const images = req.files;
    if (!images) throw new ApiError('No images uploaded', 400);

    if (images && images.length > 0) {
        const imagePaths = images.map(image => image.path);
        gps.images = imagePaths;
        await gps.save();
    }

    return res.status(201).json({
        success: true,
        message: 'gps created successfully',
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


     Object.keys(req.body).forEach(key => {
        gps[key] = req.body[key];
    });

    if (req.files && req.files.length > 0) {
        const oldImages = gps.images;

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
        gps.images = newImages;
    }

    // if (req.files && req.files.length > 0) {
    //     const oldImages = gps.images;
    //     const newImages = req.files.map(image => image.path.replace('upload/', ''));
    //     gps.images = [...oldImages, ...newImages];
    //     await gps.save();

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
    //     await gps.updateOne(req.body);
    // }

    return res.status(200).json({
        success: true,
        message: 'Gps updated successfully',
        gps
    });
});

// exports.deleteGps = asyncHandler(async (req, res) => {  
//     const gps = await Gps.findByIdAndDelete(req.params.id);
//     if (!gps) throw new ApiError('Gps not found', 404);
//     return res.status(200).json({
//         success: true,
//         message: 'Gps deleted successfully',
//         gps
//     });
// }); 

exports.deleteGps = asyncHandler(async (req, res) => {
    const gps = await deleteDocumentWithFiles(Gps, req.params.id, "uploads");
    if (!gps) throw new ApiError("gps not found", 404);

    return res.status(200).json({
        success: true,
        message: "gps deleted successfully (with images)",
        gps,
    });
});

