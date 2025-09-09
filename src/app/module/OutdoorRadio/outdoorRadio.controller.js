const OutdoorRadio = require('./OutdoorRadio');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const deleteFile = require('../../../utils/unlinkFile');

exports.createOutdoorRadio = asyncHandler(async (req, res) => {
    const outdoorRadio = await OutdoorRadio.create(req.body);
    if (!outdoorRadio) throw new ApiError('OutdoorRadio not created', 500);

    const images = req.files;
        if (!images) throw new ApiError('No images uploaded', 400);
    
        if (images && images.length > 0) {
            const imagePaths = images.map(image => image.path);
            outdoorRadio.images = imagePaths;
            await outdoorRadio.save();
        }
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

    Object.keys(req.body).forEach(key => {
        outdoorRadio[key] = req.body[key];
    });

    await outdoorRadio.save();



    if (req.files && req.files.length > 0) {
        const oldImages = outdoorRadio.images;

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
        outdoorRadio.images = newImages;
    }

    // if (req.files && req.files.length > 0) {
    //     const oldImages = outdoorRadio.images;
    //     const newImages = req.files.map(image => image.path.replace('upload/', ''));
    //     outdoorRadio.images = [...oldImages, ...newImages];
    //     await outdoorRadio.save();

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
    //     await outdoorRadio.updateOne(req.body);
    // }

    return res.status(200).json({
        success: true,
        message: 'OutdoorRadio updated successfully',
        outdoorRadio
    });
});


// exports.deleteOutdoorRadio = asyncHandler(async (req, res) => {  
//     const outdoorRadio = await OutdoorRadio.findByIdAndDelete(req.params.id);
//     if (!outdoorRadio) throw new ApiError('OutdoorRadio not found', 404);
//     return res.status(200).json({
//         success: true,
//         message: 'OutdoorRadio deleted successfully',
//         outdoorRadio
//     });
// });



exports.deleteOutdoorRadio = asyncHandler(async (req, res) => {
    const outdoorRadio = await deleteDocumentWithFiles(OutdoorRadio, req.params.id, "uploads");
    if (!outdoorRadio) throw new ApiError("outdoorRadio not found", 404);

    return res.status(200).json({
        success: true,
        message: "outdoorRadio deleted successfully (with images)",
        outdoorRadio,
    });
});