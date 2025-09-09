const Tire = require('./Tire');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const fs = require('fs');
const path = require('path');

const deleteFile = require('../../../utils/unlinkFile');

const uploadPath = path.join(__dirname, '../uploads');

exports.createTire = asyncHandler(async (req, res) => {

    const tire = await Tire.create(req.body);
    const images = req.files;
    if (!tire) throw new ApiError('Tire not created', 500);

    if (images && images.length > 0) {
        const imagePaths = images.map(image => image.path);
        tire.images = imagePaths;
        await tire.save();
    }

    res.status(201).json({
        success: true,
        message: 'Tire created successfully',
        tire
    });
});



exports.getTire = asyncHandler(async (req, res) => {
    const tire = await Tire.find();
    if (!tire) throw new ApiError('Tire not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Tire retrieved successfully',
        tire
    });
});

exports.getTireById = asyncHandler(async (req, res) => {
    const tire = await Tire.findById(req.params.id);
    if (!tire) throw new ApiError('Tire not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Tire retrieved successfully',
        tire
    });
});

exports.updateTire = asyncHandler(async (req, res) => {
    const tire = await Tire.findById(req.params.id);
    if (!tire) throw new ApiError('Tire not found', 404);


    // Update tire fields from req.body
    Object.keys(req.body).forEach(key => {
        tire[key] = req.body[key];
    });

    await tire.save();

    // if (req.files && req.files.length > 0) {
    //     const oldImages = tire.images;
    //     const newImages = req.files.map(image => image.path.replace('upload/', ''));
    //     tire.images = [...oldImages, ...newImages];
    //     await tire.save();

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
    // }

    if (req.files && req.files.length > 0) {
        const oldImages = tire.images;

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
        tire.images = newImages;
    }

    return res.status(200).json({
        success: true,
        message: 'Tire updated successfully',
        tire
    });
});

exports.deleteTire = asyncHandler(async (req, res) => {
    const tire = await Tire.findByIdAndDelete(req.params.id);
    if (!tire) throw new ApiError('Tire not found', 404);

    const images = tire.images;
    images.forEach(image => {
        const path = image.split('/').pop();
        try {
            fs.unlinkSync(`${uploadPath}/${path}`);
        } catch (err) {
            if (err.code !== 'ENOENT') {
                console.error(err);
            }
        }
    });

    return res.status(200).json({
        success: true,
        message: 'Tire deleted successfully',
        tire
    });
});

