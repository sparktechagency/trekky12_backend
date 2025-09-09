const Heater = require('./Heater');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');

exports.createHeater = asyncHandler(async (req, res) => {
    const heater = await Heater.create(req.body);
    if (!heater) throw new ApiError('Heater not created', 500);

    const images = req.files;
    if (images && images.length > 0) {
        const imagePaths = images.map(image => image.path);
        heater.images = imagePaths;
        await heater.save();
    }
    res.status(201).json({
        success: true,
        message: 'Heater created successfully',
        heater
    });
});


exports.getHeaters = asyncHandler(async (req, res) => {
    const heaters = await Heater.find();
    if (!heaters) throw new ApiError('Heaters not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Heaters retrieved successfully',
        heaters
    });
});


exports.getHeaterById = asyncHandler(async (req, res) => {
    const heater = await Heater.findById(req.params.id);
    if (!heater) throw new ApiError('Heater not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Heater retrieved successfully',
        heater
    });
});

exports.updateHeater = asyncHandler(async (req, res) => {
    const heater = await Heater.findById(req.params.id);
    if (!heater) throw new ApiError('Heater not found', 404);
    Object.keys(req.body).forEach(key => {
        heater[key] = req.body[key];
    });

    await heater.save();


    if (req.files && req.files.length > 0) {
        const oldImages = heater.images;

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
        heater.images = newImages;
    }
    // if (req.files && req.files.length > 0) {
    //     const oldImages = heater.images;
    //     const newImages = req.files.map(image => image.path.replace('upload/', ''));
    //     heater.images = [...oldImages, ...newImages];
    //     await heater.save();

    //     oldImages.forEach(image => {
    //         const path = image.split('/').pop();
    //         try {
    //             fs.unlinkSync(`${uploadPath}/${path}`);
    //         } catch (err) {
    //             if (err.code !== 'ENOENT') {
    //                 console.error(err);
    //             }
    //         }
    //     });
    // } else {
    //     await heater.updateOne(req.body);
    // }

    return res.status(200).json({
        success: true,
        message: 'Heater updated successfully',
        heater
    });
});


exports.deleteHeater = asyncHandler(async (req, res) => {
    const heater = await Heater.findByIdAndDelete(req.params.id);
    if (!heater) throw new ApiError('Heater not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Heater deleted successfully',
        heater
    });
});

