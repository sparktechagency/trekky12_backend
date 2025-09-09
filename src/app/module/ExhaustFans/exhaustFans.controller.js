const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const ExhaustFans = require('./ExhaustFans');
const deleteDocumentWithFiles = require('../../../utils/deleteDocumentWithImages');

exports.createExhaustFans = asyncHandler(async (req, res) => {
    const exhaustFans = await ExhaustFans.create(req.body);
    if (!exhaustFans) throw new ApiError('ExhaustFans not created', 500);
    const images = req.files;
    if (!images) throw new ApiError('No images uploaded', 400); 
    
    if (images && images.length > 0) {
        const imagePaths = images.map(image => image.path);
        exhaustFans.images = imagePaths;
        await exhaustFans.save();
    }

    return res.status(201).json({
        success: true,
        message: 'ExhaustFans created successfully',
        exhaustFans
    });
}); 

exports.getExhaustFans = asyncHandler(async (req, res) => {
    const exhaustFans = await ExhaustFans.find();
    if (!exhaustFans) throw new ApiError('ExhaustFans not found', 404);
    return res.status(200).json({
        success: true,
        message: 'ExhaustFans retrieved successfully',
        exhaustFans
    });
});

exports.getExhaustFansById = asyncHandler(async (req, res) => {
    const exhaustFans = await ExhaustFans.findById(req.params.id);
    if (!exhaustFans) throw new ApiError('ExhaustFans not found', 404);
    return res.status(200).json({
        success: true,
        message: 'ExhaustFans retrieved successfully',
        exhaustFans
    });
});

exports.updateExhaustFans = asyncHandler(async (req, res) => {
    const exhaustFans = await ExhaustFans.findById(req.params.id);
    if (!exhaustFans) throw new ApiError('ExhaustFans not found', 404);

    Object.keys(req.body).forEach(key => {
        exhaustFans[key] = req.body[key];
    });

    await exhaustFans.save();


    if (req.files && req.files.length > 0) {
        const oldImages = exhaustFans.images;

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
        exhaustFans.images = newImages;
    }
    // if (req.files && req.files.length > 0) {
    //     const oldImages = exhaustFans.images;
    //     const newImages = req.files.map(image => image.path.replace('upload/', ''));
    //     exhaustFans.images = [...oldImages, ...newImages];
    //     await exhaustFans.save();

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
    //     await exhaustFans.updateOne(req.body);
    // }

    return res.status(200).json({
        success: true,
        message: 'ExhaustFans updated successfully',
        exhaustFans
    });
});


// exports.deleteExhaustFans = asyncHandler(async (req, res) => {
//     const exhaustFans = await ExhaustFans.findByIdAndDelete(req.params.id);
//     if (!exhaustFans) throw new ApiError('ExhaustFans not found', 404);
//     return res.status(200).json({
//         success: true,
//         message: 'ExhaustFans deleted successfully',
//         exhaustFans
//     });
// });

// exports.deleteAllExhaustFans = asyncHandler(async (req, res) => {
//     const exhaustFans = await ExhaustFans.deleteMany();
//     if (!exhaustFans) throw new ApiError('ExhaustFans not found', 404);
//     return res.status(200).json({
//         success: true,
//         message: 'ExhaustFans deleted successfully',
//         exhaustFans
//     });
// });


exports.deleteAllExhaustFan = asyncHandler(async (req, res) => {
    const exhaustFans = await deleteDocumentWithFiles(ExhaustFans, req.params.id, "uploads");
    if (!exhaustFans) throw new ApiError("exhaustFans not found", 404);

    return res.status(200).json({
        success: true,
        message: "exhaustFans deleted successfully (with images)",
        exhaustFans,
    });
});