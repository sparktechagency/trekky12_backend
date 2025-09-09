const Dishwasher = require('./Dishwasher');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const upload = require('../../../utils/uploadConfig');
const deleteDocumentWithFiles = require('../../../utils/deleteDocumentWithImages');

exports.createDishwasher = asyncHandler(async (req, res) => {
    const dishwasher = await Dishwasher.create(req.body);
    if (!dishwasher) throw new ApiError('Dishwasher not created', 500);
    const images = req.files;
    if (!images) throw new ApiError('No images uploaded', 400); 
    
    if (images && images.length > 0) {
        const imagePaths = images.map(image => image.path);
        dishwasher.images = imagePaths;
        await dishwasher.save();
    }

    return res.status(201).json({
        success: true,
        message: 'Dishwasher created successfully',
        dishwasher
    });
});


exports.getDishwashers = asyncHandler(async (req, res) => {
    const dishwashers = await Dishwasher.find();
    if (!dishwashers) throw new ApiError('Dishwashers not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Dishwashers retrieved successfully',
        dishwashers
    });
});

exports.getDishwasherById = asyncHandler(async (req, res) => {
    const dishwasher = await Dishwasher.findById(req.params.id);
    if (!dishwasher) throw new ApiError('Dishwasher not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Dishwasher retrieved successfully',
        dishwasher
    });
});



// exports.deleteDishwasher = asyncHandler(async (req, res) => {
//     const dishwasher = await Dishwasher.findByIdAndDelete(req.params.id);
//     if (!dishwasher) throw new ApiError('Dishwasher not found', 404);
//     return res.status(200).json({
//         success: true,
//         message: 'Dishwasher deleted successfully',
//         dishwasher
//     });
// });

exports.deleteDishwasher = asyncHandler(async (req, res) => {
    const dishwasher = await deleteDocumentWithFiles(Dishwasher, req.params.id, "uploads");
    if (!dishwasher) throw new ApiError("dishwasher not found", 404);

    return res.status(200).json({
        success: true,
        message: "dishwasher deleted successfully (with images)",
        dishwasher,
    });
});

exports.updateDishwasher = asyncHandler(async (req, res) => {
    const dishwasher = await Dishwasher.findById(req.params.id);
    if (!dishwasher) throw new ApiError('Dishwasher not found', 404);

    Object.keys(req.body).forEach(key => {
        dishwasher[key] = req.body[key];
    });

    await dishwasher.save();


    if (req.files && req.files.length > 0) {
        const oldImages = dishwasher.images;

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
        dishwasher.images = newImages;
    }

    // if (req.files && req.files.length > 0) {
    //     const oldImages = dishwasher.images;
    //     const newImages = req.files.map(image => image.path.replace('upload/', ''));
    //     dishwasher.images = [...oldImages, ...newImages];
    //     await dishwasher.save();

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
    //     await dishwasher.updateOne(req.body);
    // }

    return res.status(200).json({
        success: true,
        message: 'Dishwasher updated successfully',
        dishwasher
    });
});
