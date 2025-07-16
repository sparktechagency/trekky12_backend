const InsuranceCompany = require('./InsuranceCompany');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const deleteFile = require('../../../utils/unlinkFile');

exports.createInsuranceCompany = asyncHandler(async (req, res) => {
    const insuranceCompany = await InsuranceCompany.create(req.body);
    if (!insuranceCompany) throw new ApiError('InsuranceCompany not created', 500);
    const images = req.files.map(file => file.path);
    insuranceCompany.images = images;
    await insuranceCompany.save();
    res.status(201).json({
        success: true,
        message: 'InsuranceCompany created successfully',
        insuranceCompany
    });
});

exports.getInsuranceCompany = asyncHandler(async (req, res) => {
    const insuranceCompany = await InsuranceCompany.find();
    if (!insuranceCompany) throw new ApiError('InsuranceCompany not found', 404);
    return res.status(200).json({
        success: true,
        message: 'InsuranceCompany retrieved successfully',
        insuranceCompany
    });
});

exports.getInsuranceCompanyById = asyncHandler(async (req, res) => {
    const insuranceCompany = await InsuranceCompany.findById(req.params.id);
    if (!insuranceCompany) throw new ApiError('InsuranceCompany not found', 404);
    return res.status(200).json({
        success: true,
        message: 'InsuranceCompany retrieved successfully',
        insuranceCompany
    });
});


exports.updateInsurance = asyncHandler(async (req, res) => {
    const insuranceCompany = await InsuranceCompany.findById(req.params.id);
    if (!insuranceCompany) throw new ApiError('InsuranceCompany not found', 404);

    if (req.files && req.files.length > 0) {
        const oldImages = insuranceCompany.images;
        const newImages = req.files.map(image => image.path);
        insuranceCompany.images = [...oldImages, ...newImages];
        await insuranceCompany.save();
    } else {
        await insuranceCompany.updateOne(req.body);
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


