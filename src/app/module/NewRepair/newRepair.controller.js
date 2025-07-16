const NewRepair = require('./NewRepair');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const deleteFile = require('../../../utils/unlinkFile');

exports.createNewRepair = asyncHandler(async (req, res) => {
    const newRepair = await NewRepair.create(req.body);
    if (!newRepair) throw new ApiError('NewRepair not created', 500);
    const images = req.files.map(file => file.path);
    newRepair.images = images;
    await newRepair.save();
    res.status(201).json({
        success: true,
        message: 'NewRepair created successfully',
        newRepair
    });
});


exports.getNewRepair = asyncHandler(async (req, res) => {
    const newRepair = await NewRepair.find();
    if (!newRepair) throw new ApiError('NewRepair not found', 404);
    return res.status(200).json({
        success: true,
        message: 'NewRepair retrieved successfully',
        newRepair
    });
});

exports.getNewRepairById = asyncHandler(async (req, res) => {
    const newRepair = await NewRepair.findById(req.params.id);
    if (!newRepair) throw new ApiError('NewRepair not found', 404);
    return res.status(200).json({
        success: true,
        message: 'NewRepair retrieved successfully',
        newRepair
    });
});

exports.updateNewRepair = asyncHandler(async (req, res) => {
    const newRepair = await NewRepair.findById(req.params.id);
    if (!newRepair) throw new ApiError('NewRepair not found', 404);

    if (req.files && req.files.length > 0) {
        const oldImages = newRepair.images;
        const newImages = req.files.map(image => image.path.replace('upload/', ''));
        newRepair.images = [...oldImages, ...newImages];
        await newRepair.save();

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
        await newRepair.updateOne(req.body);
    }

    return res.status(200).json({
        success: true,
        message: 'NewRepair updated successfully',
        newRepair
    });
});

exports.deleteNewRepair = asyncHandler(async (req, res) => {  
    const newRepair = await NewRepair.findByIdAndDelete(req.params.id);
    if (!newRepair) throw new ApiError('NewRepair not found', 404);
    return res.status(200).json({
        success: true,
        message: 'NewRepair deleted successfully',
        newRepair
    });
});
