const Toilet = require('./Toilet');

const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const deleteDocumentWithFiles = require('../../../utils/deleteDocumentWithImages');

exports.createToilet = asyncHandler(async (req, res) => {
    const toilet = await Toilet.create(req.body);
    if (!toilet) throw new ApiError('Toilet not created', 500);
    const images = req.files;
    if (!images) throw new ApiError('No images uploaded', 400);

    if (images && images.length > 0) {
        const imagePaths = images.map(image => image.path);
        toilet.images = imagePaths;
        await toilet.save();
    }

    return res.status(201).json({
        success: true,
        message: 'Toilet created successfully',
        toilet
    });
});


exports.getToilets = asyncHandler(async (req, res) => {
    const toilets = await Toilet.find();
    if (!toilets) throw new ApiError('Toilets not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Toilets retrieved successfully',
        toilets
    });
});

exports.getToiletById = asyncHandler(async (req, res) => {
    const toilet = await Toilet.findById(req.params.id);
    if (!toilet) throw new ApiError('Toilet not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Toilet retrieved successfully',
        toilet
    });
});

exports.updateToilet = asyncHandler(async (req, res) => {
    const toilet = await Toilet.findById(req.params.id);
    if (!toilet) throw new ApiError('Toilet not found', 404);

    Object.keys(req.body).forEach(key => {
        toilet[key] = req.body[key];
    });

    if (req.files && req.files.length > 0) {
        const oldImages = toilet.images;

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
        toilet.images = newImages;
    }


    // if (req.files && req.files.length > 0) {
    //     const oldImages = toilet.images;
    //     const newImages = req.files.map(image => image.path.replace('upload/', ''));
    //     toilet.images = [...oldImages, ...newImages];
    //     await toilet.save();

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
    // } 

    return res.status(200).json({
        success: true,
        message: 'Toilet updated successfully',
        toilet
    });
});

// exports.deleteToilet = asyncHandler(async (req, res) => {
//     const toilet = await Toilet.findByIdAndDelete(req.params.id);
//     if (!toilet) throw new ApiError('Toilet not found', 404);
//     return res.status(200).json({
//         success: true,
//         message: 'Toilet deleted successfully',
//         toilet
//     });
// });


exports.deleteToilet = asyncHandler(async (req, res) => {
    const toilet = await deleteDocumentWithFiles(Toilet, req.params.id, "uploads");
    if (!toilet) throw new ApiError("toilet not found", 404);

    return res.status(200).json({
        success: true,
        message: "toilet deleted successfully (with images)",
        toilet,
    });
});

