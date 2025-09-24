const Report = require('./Reports');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const QueryBuilder = require('../../../builder/queryBuilder');
const deleteDocumentWithFiles = require('../../../utils/deleteDocumentWithImages');
const getSelectedRvByUserId = require('../../../utils/currentRv');
const checkValidRv = require('../../../utils/checkValidRv');

exports.createReport = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const selectedRvId = await getSelectedRvByUserId(userId);
    let rvId = req.body.rvId;
    
    if(!rvId && !selectedRvId) throw new ApiError('No selected RV found', 404);
    if(!rvId) rvId = selectedRvId;

    const hasAccess = await checkValidRv(userId, rvId);
    if (!hasAccess) {
        throw new ApiError('You do not have permission to add reports for this RV', 403);
    }
    
    const report = await Report.create({
        rvId,
        ...req.body,
        user: userId,
        status: 'pending' // Default status
    });

    res.status(201).json({
        success: true,
        message: 'Report created successfully',
        data: report
    });
});

exports.getReports = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const selectedRvId = await getSelectedRvByUserId(userId);
    let rvId = req.query.rvId;
    
    if(!rvId && !selectedRvId) throw new ApiError('No selected RV found', 404);
    if(!rvId) rvId = selectedRvId;
    
    const baseQuery = { user: userId, rvId };
    const fromDate = req.query.from;
    const toDate = req.query.to;

    let reportQuery = Report.find(baseQuery);
    
    if(fromDate && toDate) {
        reportQuery = reportQuery.where('createdAt').gte(fromDate).lte(toDate);
    }

    reportQuery = new QueryBuilder(
        reportQuery,
        req.query
    );
    
    const reports = await reportQuery
        .search(['title', 'description', 'status', 'reportType'])
        .filter()
        .sort()
        .paginate()
        .fields()
        .modelQuery;

    const meta = await new QueryBuilder(
        Report.find(baseQuery),
        req.query
    ).countTotal();

    if (!reports || reports.length === 0) {
        throw new ApiError('No reports found', 404);
    }

    res.status(200).json({
        success: true,
        message: 'Reports retrieved successfully',
        meta,
        data: reports
    });
});

exports.getReportById = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    
    const report = await Report.findOne({
        _id: req.params.id,
        user: userId
    });

    if (!report) {
        throw new ApiError('Report not found or access denied', 404);
    }

    res.status(200).json({
        success: true,
        message: 'Report retrieved successfully',
        data: report
    });
});

exports.updateReport = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    
    const report = await Report.findOne({
        _id: req.params.id,
        user: userId
    });
    
    if (!report) {
        throw new ApiError('Report not found or access denied', 404);
    }

    // Update report fields from req.body
    Object.keys(req.body).forEach(key => {
        if (key !== 'images') { // Don't override images from req.body
            report[key] = req.body[key];
        }
    });

    // Handle image updates if new files are uploaded
    if (req.files && req.files.length > 0) {
        // Keep existing images and add new ones
        const newImages = req.files.map(file => file.location);
        report.images = [...(report.images || []), ...newImages];
    }

    await report.save();

    res.status(200).json({
        success: true,
        message: 'Report updated successfully',
        data: report
    });
});

exports.deleteReport = asyncHandler(async (req, res) => {
    const report = await deleteDocumentWithFiles(Report, req.params.id, "uploads");
    if (!report) throw new ApiError("Report not found", 404);

    return res.status(200).json({
        success: true,
        message: "Report deleted successfully",
        data: report
    });
});

// Favorite functionality
exports.toggleFavoriteReport = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    
    // First, find the current report to get its current isFavorite status
    const currentReport = await Report.findOne({ _id: req.params.id, user: userId });
    if (!currentReport) throw new ApiError('Report not found', 404);
    
    // Then update with the toggled value
    const report = await Report.findOneAndUpdate(
        { _id: req.params.id, user: userId },
        { $set: { isFavorite: !currentReport.isFavorite } },
        { new: true }
    );
    
    res.status(200).json({
        success: true,
        message: report.isFavorite ? 'Report added to favorites' : 'Report removed from favorites',
        data: report
    });
});

exports.getFavoriteReports = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    
    const reportsQuery = Report.find({ 
        isFavorite: true,
        user: userId 
    });

    const reports = await new QueryBuilder(
        reportsQuery,
        req.query
    )
    .paginate()
    .modelQuery;
    
    const meta = await new QueryBuilder(
        reportsQuery,
        req.query
    ).countTotal();
    
    res.status(200).json({
        success: true,
        message: 'Favorite reports retrieved successfully',
        meta,
        data: reports
    });
});
