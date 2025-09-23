const InsuranceCompany = require('./InsuranceCompany');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const QueryBuilder = require('../../../builder/queryBuilder');
const deleteDocumentWithFiles = require('../../../utils/deleteDocumentWithImages');
const getSelectedRvByUserId = require('../../../utils/currentRv');

exports.createInsuranceCompany = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const selectedRvId = await getSelectedRvByUserId(userId);
    let rvId = req.body.rvId;
    
    if(!rvId && !selectedRvId) throw new ApiError('No selected RV found', 404);
    if(!rvId) rvId = selectedRvId;
    
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
        throw new ApiError('No insurance companies found', 404);
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
    
    if (!insuranceCompany) throw new ApiError('Insurance company not found', 404);


    
    return res.status(200).json({
        success: true,
        message: 'Insurance company retrieved successfully',
        insuranceCompany
    });
});

exports.updateInsuranceCompany = asyncHandler(async (req, res) => {
    const insuranceCompany = await InsuranceCompany.findById(req.params.id);
    if (!insuranceCompany) throw new ApiError('Insurance company not found', 404);


    // Update insurance company fields from req.body
    Object.keys(req.body).forEach(key => {
        insuranceCompany[key] = req.body[key];
    });

    await insuranceCompany.save();

    if (req.files && req.files.length > 0) {
        const oldImages = insuranceCompany.images;

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
        const newImages = req.files.map(image => image.location);
        insuranceCompany.images = newImages;
    }

    return res.status(200).json({
        success: true,
        message: 'Insurance company updated successfully',
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
