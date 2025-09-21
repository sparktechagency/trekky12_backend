const InsuranceCompany = require('./InsuranceCompany');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const deleteFile = require('../../../utils/unlinkFile');

exports.createInsuranceCompany = asyncHandler(async (req, res) => {
    const user = req.user.id || req.user._id;
    const insuranceCompany = await InsuranceCompany.create({
        ...req.body,
        user,
    });
    if (!insuranceCompany) throw new ApiError('InsuranceCompany not created', 500);
    const images = req.file.path;
    insuranceCompany.images = images;
    await insuranceCompany.save();
    res.status(201).json({
        success: true,
        message: 'InsuranceCompany created successfully',
        insuranceCompany
    });
});

exports.getInsuranceCompany = asyncHandler(async (req, res) => {
    const user = req.user.id || req.user._id;
    const insuranceCompany = await InsuranceCompany.find({ user });
    if (!insuranceCompany) throw new ApiError('InsuranceCompany not found', 404);
    return res.status(200).json({
        success: true,
        message: 'InsuranceCompany retrieved successfully',
        insuranceCompany
    });
});

exports.getInsuranceCompanyById = asyncHandler(async (req, res) => {
    const user = req.user.id || req.user._id;
    const insuranceCompany = await InsuranceCompany.findById(req.params.id);
    if (!insuranceCompany) throw new ApiError('InsuranceCompany not found', 404);
    return res.status(200).json({
        success: true,
        message: 'InsuranceCompany retrieved successfully',
        insuranceCompany
    });
});


exports.updateInsurance = asyncHandler(async (req, res) => {
    // const user = req.user.id || req.user._id;
    const insuranceCompany = await InsuranceCompany.findById(req.params.id);
    if (!insuranceCompany) throw new ApiError('InsuranceCompany not found', 404);

    Object.keys(req.body).forEach(key => {
        insuranceCompany[key] = req.body[key];
    });

    if (req.file) {
        const oldImage = insuranceCompany.images;

        // Delete old image from disk
        try {
            fs.unlinkSync(`${uploadPath}/${oldImage}`);
        } catch (err) {
            if (err.code !== 'ENOENT') {
                console.error(err);
            }
        }

        // Set only new image
        const newImage = req.file.path.replace('upload/', '');
        insuranceCompany.images = newImage;
    }

    return res.status(200).json({
        success: true,
        message: 'InsuranceCompany updated successfully',
        insuranceCompany
    }); 
});


exports.deleteInsurance = asyncHandler(async (req, res) => {
    const insuranceCompany = await InsuranceCompany.findByIdAndDelete(req.params.id);
    if (!insuranceCompany) throw new ApiError('InsuranceCompany not found', 404);
    return res.status(200).json({
        success: true,
        message: 'InsuranceCompany deleted successfully',
        // insuranceCompany
    }); 
});


