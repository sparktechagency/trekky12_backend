const SurroundSound = require('./SurroundSound');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const deleteDocumentWithFiles = require('../../../utils/deleteDocumentWithImages');

exports.createSurroundSound = asyncHandler(async (req, res) => {
    const surroundSound = await SurroundSound.create(req.body);
    if (!surroundSound) throw new ApiError('SurroundSound not created', 500);

    const images = req.files;
    if (!images) throw new ApiError('No images uploaded', 400);

    if (images && images.length > 0) {
        const imagePaths = images.map(image => image.path);
        surroundSound.images = imagePaths;
        await surroundSound.save();
    }
    res.status(201).json({
        success: true,
        message: 'SurroundSound created successfully',
        surroundSound
    });
});

exports.getSurroundSound = asyncHandler(async (req, res) => {
    const surroundSound = await SurroundSound.find();
    if (!surroundSound) throw new ApiError('SurroundSound not found', 404);
    return res.status(200).json({
        success: true,
        message: 'SurroundSound retrieved successfully',
        surroundSound
    });
});

exports.getSurroundSoundById = asyncHandler(async (req, res) => {
    const surroundSound = await SurroundSound.findById(req.params.id);
    if (!surroundSound) throw new ApiError('SurroundSound not found', 404);
    return res.status(200).json({
        success: true,
        message: 'SurroundSound retrieved successfully',
        surroundSound
    });
});


exports.updateSurroundSound = asyncHandler(async (req, res) => {
    const surroundSound = await SurroundSound.findById(req.params.id);
    if (!surroundSound) throw new ApiError('SurroundSound not found', 404);

    Object.keys(req.body).forEach(key => {
        surroundSound[key] = req.body[key];
    });

    await surroundSound.save();

    

    if (req.files && req.files.length > 0) {
        const oldImages = surroundSound.images;

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
        surroundSound.images = newImages;
    }

    // if (req.files && req.files.length > 0) {
    //     const oldImages = surroundSound.images;
    //     const newImages = req.files.map(image => image.path.replace('upload/', ''));
    //     surroundSound.images = [...oldImages, ...newImages];
    //     await surroundSound.save();

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
    //     await surroundSound.updateOne(req.body);
    // }

    return res.status(200).json({
        success: true,
        message: 'SurroundSound updated successfully',
        surroundSound
    });
});

// exports.deleteSurroundSound = asyncHandler(async (req, res) => {
//     const surroundSound = await SurroundSound.findByIdAndDelete(req.params.id);
//     if (!surroundSound) throw new ApiError('SurroundSound not found', 404);
//     return res.status(200).json({
//         success: true,
//         message: 'SurroundSound deleted successfully',
//         surroundSound
//     });
// }); 



exports.deleteSurroundSound = asyncHandler(async (req, res) => {
    const surroundSound = await deleteDocumentWithFiles(SurroundSound, req.params.id, "uploads");
    if (!surroundSound) throw new ApiError("surroundSound not found", 404);

    return res.status(200).json({
        success: true,
        message: "surroundSound deleted successfully (with images)",
        surroundSound,
    });
});