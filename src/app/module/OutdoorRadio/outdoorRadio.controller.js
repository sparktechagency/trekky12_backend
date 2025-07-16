const OutdoorRadio = require('./OutdoorRadio');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const deleteFile = require('../../../utils/unlinkFile');

exports.createOutdoorRadio = asyncHandler(async (req, res) => {
    const outdoorRadio = await OutdoorRadio.create(req.body);
    if (!outdoorRadio) throw new ApiError('OutdoorRadio not created', 500);
    res.status(201).json({
        success: true,
        message: 'OutdoorRadio created successfully',
        outdoorRadio
    });
}); 

exports.getOutdoorRadio = asyncHandler(async (req, res) => {
    const outdoorRadio = await OutdoorRadio.find();
    if (!outdoorRadio) throw new ApiError('OutdoorRadio not found', 404);
    return res.status(200).json({
        success: true,
        message: 'OutdoorRadio retrieved successfully',
        outdoorRadio
    });
});

exports.getOutdoorRadioById = asyncHandler(async (req, res) => {
    const outdoorRadio = await OutdoorRadio.findById(req.params.id);
    if (!outdoorRadio) throw new ApiError('OutdoorRadio not found', 404);
    return res.status(200).json({
        success: true,
        message: 'OutdoorRadio retrieved successfully',
        outdoorRadio
    });
});


exports.updateOutdoorRadio = asyncHandler(async (req, res) => {
    const outdoorRadio = await OutdoorRadio.findById(req.params.id);
    if (!outdoorRadio) throw new ApiError('OutdoorRadio not found', 404);

    if (req.files && req.files.length > 0) {
        const oldImages = outdoorRadio.images;
        const newImages = req.files.map(image => image.path.replace('upload/', ''));
        outdoorRadio.images = [...oldImages, ...newImages];
        await outdoorRadio.save();

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
        await outdoorRadio.updateOne(req.body);
    }

    return res.status(200).json({
        success: true,
        message: 'OutdoorRadio updated successfully',
        outdoorRadio
    });
});


exports.deleteOutdoorRadio = asyncHandler(async (req, res) => {  
    const outdoorRadio = await OutdoorRadio.findByIdAndDelete(req.params.id);
    if (!outdoorRadio) throw new ApiError('OutdoorRadio not found', 404);
    return res.status(200).json({
        success: true,
        message: 'OutdoorRadio deleted successfully',
        outdoorRadio
    });
});


