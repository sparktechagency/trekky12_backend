const Report = require('./Reports');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const deleteFile = require('../../../utils/unlinkFile');

exports.createReport = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const report = await Report.create({ ...req.body, user: userId });
    if (!report) throw new ApiError('Report not created', 500);
    await report.save();
    res.status(201).json({
        success: true,
        message: 'Report created successfully',
        report
    });
});


exports.getReport = asyncHandler(async (req, res) => {
    const report = await Report.find();
    if (!report) throw new ApiError('Report not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Report retrieved successfully',
        report
    });
});

exports.getReportById = asyncHandler(async (req, res) => {
    const report = await Report.findById(req.params.id);
    if (!report) throw new ApiError('Report not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Report retrieved successfully',
        report
    });
});


exports.updateReport = asyncHandler(async (req, res) => {
    const report = await Report.findByIdAndUpdate(req.params.id, { ...req.body, user: req.user._id }, { new: true });
    if (!report) throw new ApiError('Report not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Report updated successfully',
        report
    });
});


exports.deleteReport = asyncHandler(async (req, res) => {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) throw new ApiError('Report not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Report deleted successfully',
        report
    });
});

exports.addFavoriteReport = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user.favorites) user.favorites = [];
    if (!user.favorites.includes(req.params.id)) {
        user.favorites.push(req.params.id);
        await user.save();
    }

    return res.status(200).json({
        success: true,
        message: 'Report added to favorites',
    });
});

exports.removeFavoriteReport = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user.favorites) user.favorites = [];
    const index = user.favorites.indexOf(req.params.id);
    if (index > -1) {
        user.favorites.splice(index, 1);
        await user.save();
    }

    return res.status(200).json({
        success: true,
        message: 'Report removed from favorites',
    });
});


exports.getFavoriteReport = asyncHandler(async (req, res) => {
    const user = req.user;
    const reports = await Report.find({ _id: { $in: user.favorites } });
    return res.status(200).json({
        success: true,
        message: 'Favorite reports retrieved successfully',
        reports
    });
});
