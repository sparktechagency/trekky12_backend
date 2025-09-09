const Dvd = require('./Dvd');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const deleteDocumentWithFiles = require('../../../utils/deleteDocumentWithImages');

// exports.createDvd = asyncHandler(async (req, res) => {
//     const dvd = await Dvd.create(req.body);
//     if (!dvd) throw new ApiError('Dvd not created', 500);
//     res.status(201).json({
//         success: true,
//         message: 'Dvd created successfully',
//         dvd
//     });
// });


exports.createDvd = asyncHandler(async (req, res) => {
    const dvd = await Dvd.create(req.body);
    if (!dvd) throw new ApiError('dvd not created', 500);
    const images = req.files;
    if (!images) throw new ApiError('No images uploaded', 400);

    if (images && images.length > 0) {
        const imagePaths = images.map(image => image.path);
        dvd.images = imagePaths;
        await dvd.save();
    }

    return res.status(201).json({
        success: true,
        message: 'dvd created successfully',
        dvd
    });
});

exports.getDvd = asyncHandler(async (req, res) => {
    const dvd = await Dvd.find();
    if (!dvd) throw new ApiError('Dvd not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Dvd retrieved successfully',
        dvd
    });
});


exports.getDvdById = asyncHandler(async (req, res) => {
    const dvd = await Dvd.findById(req.params.id);
    if (!dvd) throw new ApiError('Dvd not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Dvd retrieved successfully',
        dvd
    });
});


exports.updateDvd = asyncHandler(async (req, res) => {
    const dvd = await Dvd.findById(req.params.id);
    if (!dvd) throw new ApiError('Dvd not found', 404);

    Object.keys(req.body).forEach(key => {
        dvd[key] = req.body[key];
    });

    if (req.files && req.files.length > 0) {
        const oldImages = dvd.images;

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
        dvd.images = newImages;
    }

    // if (req.files && req.files.length > 0) {
    //     const oldImages = dvd.images;
    //     const newImages = req.files.map(image => image.path.replace('upload/', ''));
    //     dvd.images = [...oldImages, ...newImages];
    //     await dvd.save();

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
    //     await dvd.updateOne(req.body);
    // }

    return res.status(200).json({
        success: true,
        message: 'Dvd updated successfully',
        dvd
    });
});


// exports.deleteDvd = asyncHandler(async (req, res) => {
//     const dvd = await Dvd.findByIdAndDelete(req.params.id);
//     if (!dvd) throw new ApiError('Dvd not found', 404);
//     return res.status(200).json({
//         success: true,
//         message: 'Dvd deleted successfully',
//         dvd
//     });
// });


exports.deleteDvd = asyncHandler(async (req, res) => {
    const dvd = await deleteDocumentWithFiles(Dvd, req.params.id, "uploads");
    if (!dvd) throw new ApiError("dvd not found", 404);

    return res.status(200).json({
        success: true,
        message: "dvd deleted successfully (with images)",
        dvd,
    });
});

