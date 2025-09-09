const Membership = require('./Membership');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const upload = require('../../../utils/uploadConfig');
const deleteFile = require('../../../utils/unlinkFile');
const deleteDocumentWithFiles = require('../../../utils/deleteDocumentWithImages');


exports.createMembership = asyncHandler(async (req, res) => {
  const membership = await Membership.create(req.body);
  if (!membership) throw new ApiError('Membership not created', 500);
  if (!images) throw new ApiError('No images uploaded', 400);

  if (images && images.length > 0) {
    const imagePaths = images.map(image => image.path);
    membership.images = imagePaths;
    await membership.save();
  }

  res.status(201).json({
    success: true,
    message: 'Membership created successfully',
    membership
  });
});

exports.getMembership = asyncHandler(async (req, res) => {
  const membership = await Membership.find();
  if (!membership) throw new ApiError('Membership not found', 404);
  return res.status(200).json({
    success: true,
    message: 'Membership retrieved successfully',
    membership
  });
});

exports.getMembershipById = asyncHandler(async (req, res) => {
  const membership = await Membership.findById(req.params.id);
  if (!membership) throw new ApiError('Membership not found', 404);
  return res.status(200).json({
    success: true,
    message: 'Membership retrieved successfully',
    membership
  });
});


exports.updateMembership = asyncHandler(async (req, res) => {
  
});

exports.updateMembership = asyncHandler(async (req, res) => {
    const membership = await Membership.findById(req.params.id);
    if (!membership) throw new ApiError('Membership not found', 404);

    Object.keys(req.body).forEach(key => {
        membership[key] = req.body[key];
    });

    await membership.save();


    if (req.files && req.files.length > 0) {
        const oldImages = membership.images;

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
        membership.images = newImages;
    }

    // if (req.files && req.files.length > 0) {
    //     const oldImages = membership.images;
    //     const newImages = req.files.map(image => image.path.replace('upload/', ''));
    //     membership.images = [...oldImages, ...newImages];
    //     await membership.save();

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
    //     await membership.updateOne(req.body);
    // }

    return res.status(200).json({
        success: true,
        message: 'membership updated successfully',
        membership
    });
});

// exports.deleteMembership = asyncHandler(async (req, res) => {
//   const membership = await Membership.findByIdAndDelete(req.params.id);
//   if (!membership) throw new ApiError('Membership not found', 404);
//   return res.status(200).json({
//     success: true,
//     message: 'Membership deleted successfully',
//     membership
//   });
// });

exports.deleteMembership = asyncHandler(async (req, res) => {
    const membership = await deleteDocumentWithFiles(Membership, req.params.id, "uploads");
    if (!membership) throw new ApiError("membership not found", 404);

    return res.status(200).json({
        success: true,
        message: "membership deleted successfully (with images)",
        membership,
    });
});