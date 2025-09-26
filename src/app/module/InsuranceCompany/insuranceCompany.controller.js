const InsuranceCompany = require('./InsuranceCompany');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const QueryBuilder = require('../../../builder/queryBuilder');
const deleteDocumentWithFiles = require('../../../utils/deleteDocumentWithImages');
const getSelectedRvByUserId = require('../../../utils/currentRv');
const checkValidRv = require('../../../utils/checkValidRv');
const deleteS3Objects = require('../../../utils/deleteS3ObjectsImage');

exports.createInsuranceCompany = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const selectedRvId = await getSelectedRvByUserId(userId);
    let rvId = req.body.rvId;
    
    if(!rvId && !selectedRvId) throw new ApiError('No selected RV found', 404);
    if(!rvId) rvId = selectedRvId;

    const hasAccess = await checkValidRv(userId, rvId);
    if (!hasAccess) {
        throw new ApiError('You do not have permission to add maintenance for this RV', 403);
    }
    
    const insuranceCompany = await InsuranceCompany.create({
        rvId,
        ...req.body,
        user: userId,
    });

    if (!insuranceCompany) throw new ApiError('Insurance company not created', 500);

    if (req.files && req.files.length > 0) {
        const imagePaths = req.files.map(image => image.location);
        insuranceCompany.images = imagePaths;
        await insuranceCompany.save();
    }

    return res.status(201).json({
        success: true,
        message: 'Insurance company created successfully',
        insuranceCompany
    });
});



// exports.updateInsuranceCompany = asyncHandler(async (req, res) => {
//     const insuranceCompany = await InsuranceCompany.findById(req.params.id);
//     if (!insuranceCompany) throw new ApiError('Insurance company not found', 404);


//     // Update insurance company fields from req.body
//     Object.keys(req.body).forEach(key => {
//         insuranceCompany[key] = req.body[key];
//     });

//     await insuranceCompany.save();

//     if (req.files && req.files.length > 0) {
//         const oldImages = insuranceCompany.images;

//         // Delete old images from disk
//         oldImages.forEach(image => {
//             const path = image.split('/').pop();
//             try {
//                 fs.unlinkSync(`${uploadPath}/${path}`);
//             } catch (err) {
//                 if (err.code !== 'ENOENT') {
//                     console.error(err);
//                 }
//             }
//         });

//         // Set only new images
//         const newImages = req.files.map(image => image.location);
//         insuranceCompany.images = newImages;
//     }

    
    
//     return res.status(200).json({
//         success: true,
//         message: 'Insurance company updated successfully',
//         insuranceCompany
//     });
// });

// exports.updateInsuranceCompany = asyncHandler(async (req, res) => {
//     const insuranceCompany = await InsuranceCompany.findById(req.params.id);
//     if (!insuranceCompany) {
//         throw new ApiError('Insurance company not found', 404);
//     }

//     // Save old images if new ones are being uploaded
//     let oldImages = [];
//     if (req.files?.length > 0) {
//         oldImages = [...insuranceCompany.images];
//     }

//     // Prepare updates object
//     const updates = { ...req.body };
    
//     // Process file uploads if any
//     if (req.files?.length > 0) {
//         // Get the new image URLs/locations
//         const newImages = req.files.map(file => file.location || file.path);
//         updates.images = newImages;
//     }

//     try {
//         // Update the document
//         const updatedCompany = await InsuranceCompany.findByIdAndUpdate(
//             req.params.id,
//             { $set: updates },
//             { new: true, runValidators: true }
//         );

//         // If update was successful and there were old images, delete them
//         if (req.files?.length > 0 && oldImages.length > 0) {
//             oldImages.forEach(image => {
//                 if (!image) return;
//                 const path = image.split('/').pop();
//                 try {
//                     fs.unlinkSync(`${uploadPath}/${path}`);
//                 } catch (err) {
//                     if (err.code !== 'ENOENT') {
//                         console.error('Error deleting old image:', err);
//                     }
//                 }
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: 'Insurance company updated successfully',
//             insuranceCompany: updatedCompany
//         });

//     } catch (error) {
//         // If there's an error, clean up any uploaded files
//         if (req.files?.length > 0) {
//             req.files.forEach(file => {
//                 try {
//                     if (file.path) fs.unlinkSync(file.path);
//                 } catch (err) {
//                     console.error('Error cleaning up uploaded files:', err);
//                 }
//             });
//         }
//         throw error;
//     }
// });


// exports.updateInsuranceCompany = asyncHandler(async (req, res) => {
//     // 1. Find the insurance company
//     const insuranceCompany = await InsuranceCompany.findById(req.params.id);
//     if (!insuranceCompany) {
//         throw new ApiError('Insurance company not found', 404)
//     }

//     try {
//         if (req.files?.length > 0) {
//             const oldImages = [...insuranceCompany.images];
//             insuranceCompany.images = req.files.map(file => file.location);
//             await insuranceCompany.save();
//             await deleteS3Objects(oldImages);
//         }

//         res.status(200).json({
//             success: true,
//             message: 'Insurance company updated successfully',
//             insuranceCompany
//         });

//     } catch (error) {
//         if (req.files?.length > 0) {
//             await deleteS3Objects(req.files.map(file => file.location));
//         }
//         throw error;
//     }
// });


exports.updateInsuranceCompany = asyncHandler(async (req, res) => {
    const insuranceCompany = await InsuranceCompany.findById(req.params.id);
    if (!insuranceCompany) throw new ApiError('Insurance company not found', 404);

    // 1. Update fields from req.body
    Object.keys(req.body).forEach(key => {
        insuranceCompany[key] = req.body[key];
    });

    // 2. Handle file uploads if any
    if (req.files?.length > 0) {
        const oldImages = [...insuranceCompany.images];
        
        // Update with new images
        insuranceCompany.images = req.files.map(file => file.location);
        
        // Save the document (only once)
        await insuranceCompany.save();

        // Delete old images from S3
        await deleteS3Objects(oldImages);
    } else {
        // If no files, just save the document
        await insuranceCompany.save();
    }

    return res.status(200).json({
        success: true,
        message: 'Insurance company updated successfully',
        insuranceCompany
    });
});

exports.getInsuranceCompanies = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const selectedRvId = await getSelectedRvByUserId(userId);
    let rvId = req.query.rvId;
    
    if(!rvId && !selectedRvId) throw new ApiError('No selected RV found', 404);
    if(!rvId) rvId = selectedRvId;
    
    const baseQuery = { user: userId, rvId };
    
    const insuranceQuery = new QueryBuilder(
        InsuranceCompany.find(baseQuery),
        req.query
    )
    .search(['name', 'policyNumber', 'companyName'])
    .filter()
    .sort()
    .paginate()
    .fields();

    const insuranceCompanies = await insuranceQuery.modelQuery;
    
    const meta = await new QueryBuilder(
        InsuranceCompany.find(baseQuery),
        req.query
    ).countTotal();

    if (!insuranceCompanies || insuranceCompanies.length === 0) {
        return res.status(200).json({
            success: true,
            message: 'No insurance companies found',
            meta,
            insuranceCompanies
        });
    }

    return res.status(200).json({
        success: true,
        message: 'Insurance companies retrieved successfully',
        meta,
        insuranceCompanies
    });
});

exports.getInsuranceCompanyById = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const insuranceCompany = await InsuranceCompany.findOne({ _id: req.params.id, user: userId });
    
    if (!insuranceCompany) return res.status(200).json({
        success: true,
        message: 'Insurance company not found',
        insuranceCompany
    });

    return res.status(200).json({
        success: true,
        message: 'Insurance company retrieved successfully',
        insuranceCompany
    });
});

exports.deleteInsuranceCompany = asyncHandler(async (req, res) => {
    const insuranceCompany = await deleteDocumentWithFiles(InsuranceCompany, req.params.id, "uploads");
    if (!insuranceCompany) throw new ApiError("Insurance company not found", 404);

    return res.status(200).json({
        success: true,
        message: "Insurance company deleted successfully",
        insuranceCompany,
    });
});