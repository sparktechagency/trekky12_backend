const SurroundSound = require('./SurroundSound');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');

exports.createSurroundSound = asyncHandler(async (req, res) => {
    const surroundSound = await SurroundSound.create(req.body);
    if (!surroundSound) throw new ApiError('SurroundSound not created', 500);
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

    if (req.files && req.files.length > 0) {
        const oldImages = surroundSound.images;
        const newImages = req.files.map(image => image.path.replace('upload/', ''));
        surroundSound.images = [...oldImages, ...newImages];
        await surroundSound.save();

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
        await surroundSound.updateOne(req.body);
    }

    return res.status(200).json({
        success: true,
        message: 'SurroundSound updated successfully',
        surroundSound
    });
});

exports.deleteSurroundSound = asyncHandler(async (req, res) => {  
    const surroundSound = await SurroundSound.findByIdAndDelete(req.params.id);
    if (!surroundSound) throw new ApiError('SurroundSound not found', 404);
    return res.status(200).json({
        success: true,
        message: 'SurroundSound deleted successfully',
        surroundSound
    });
}); 