const MaintenanceSchedule = require('./MaintenanceSchedule');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const getSelectedRvByUserId = require('../../../utils/currentRv');
const User = require('../../module/User/User');
const checkValidRv = require('../../../utils/checkValidRv');
const QueryBuilder = require('../../../builder/queryBuilder');
const RV = require('../RV/RV');
const { updateRVMaintenanceStatus } = require('../../../utils/maintenanceUtils'); // Add this import

// Utility function to calculate maintenance status (keep your existing function)
const calculateMaintenanceStatus = (schedule, currentMileage, currentDate = new Date()) => {
  // ... (keep your existing function exactly as it is)
  const {
    initialMilage,
    milageAtMaintenance,
    maintenanceToBePerformed,
    dateOfMaintenance
  } = schedule;

  const TIME_INTERVAL_MONTHS = 6;
  const MILEAGE_INTERVAL = 5000;
  const UPCOMING_THRESHOLD_DAYS = 30;

  let nextMaintenanceDate = null;
  let nextMaintenanceMileage = null;
  let status = 'scheduled';
  let isOverdue = false;

  if (dateOfMaintenance && milageAtMaintenance !== undefined && milageAtMaintenance !== null) {
    const nextDate = new Date(dateOfMaintenance);
    nextDate.setMonth(nextDate.getMonth() + TIME_INTERVAL_MONTHS);
    nextMaintenanceDate = nextDate;
    nextMaintenanceMileage = milageAtMaintenance + MILEAGE_INTERVAL;
  } else {
    nextMaintenanceDate = maintenanceToBePerformed;
    if (initialMilage !== undefined && initialMilage !== null) {
      nextMaintenanceMileage = initialMilage + MILEAGE_INTERVAL;
    }
  }

  if (nextMaintenanceDate) {
    const today = currentDate;
    const upcomingThreshold = new Date(today);
    upcomingThreshold.setDate(upcomingThreshold.getDate() + UPCOMING_THRESHOLD_DAYS);

    if (nextMaintenanceDate < today) {
      isOverdue = true;
      status = 'overdue';
    } else if (nextMaintenanceDate <= upcomingThreshold) {
      status = 'upcoming';
    }
  }

  if (nextMaintenanceMileage && currentMileage >= nextMaintenanceMileage) {
    isOverdue = true;
    status = 'overdue';
  }

  let daysUntilDue = null;
  if (nextMaintenanceDate) {
    daysUntilDue = Math.ceil((nextMaintenanceDate - currentDate) / (1000 * 60 * 60 * 24));
  }

  return {
    nextMaintenanceDate,
    nextMaintenanceMileage,
    status,
    isOverdue,
    daysUntilDue,
    mileageUntilDue: nextMaintenanceMileage ? nextMaintenanceMileage - currentMileage : null
  };
};


exports.createMaintenanceSchedule = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const selectedRvId = await getSelectedRvByUserId(userId);
    
    let rvId = req.body?.rvId;
    if (!rvId && !selectedRvId) {
        throw new ApiError('No RV selected. Please select an RV first.', 400);
    }
    if (!rvId) rvId = selectedRvId;

    const hasAccess = await checkValidRv(userId, rvId);
    if (!hasAccess) {
        throw new ApiError('You do not have permission to add maintenance for this RV', 403);
    }

    const maintenanceSchedule = await MaintenanceSchedule.create({
        ...req.body,
        user: userId,
        rvId
    });

    if (!maintenanceSchedule) {
        throw new ApiError('Failed to create maintenance schedule', 500);
    }

    // Update RV maintenance status after creating schedule
    await updateRVMaintenanceStatus(rvId);

    res.status(201).json({
        success: true,
        message: 'Maintenance schedule created successfully',
        data: maintenanceSchedule
    });
});


exports.getMaintenanceSchedule = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const selectedRvId = await getSelectedRvByUserId(userId);
    
    let rvId = req.query.rvId;
    if (!rvId && !selectedRvId) {
        throw new ApiError('No RV selected. Please select an RV first.', 400);
    }
    if (!rvId) rvId = selectedRvId;

    const hasAccess = await checkRvOwnership(userId, rvId);
    if (!hasAccess) {
        throw new ApiError('You do not have permission to view maintenance for this RV', 403);
    }
    
    // Update RV maintenance status when accessing maintenance schedules
    const rvStatus = await updateRVMaintenanceStatus(rvId);
    
    const rv = await RV.findById(rvId).select('currentMileage');
    const currentMileage = rv?.currentMileage || 0;
    
    req.query.rvId = rvId;
    
    const baseQuery = { user: userId, rvId };
    
    const maintenanceQuery = new QueryBuilder(
        MaintenanceSchedule.find(baseQuery),
        req.query
    );
    
    const maintenanceSchedules = await maintenanceQuery
        .search(['component', 'maintenanceToBePerformed', 'notes'])
        .filter()
        .sort()
        .paginate()
        .fields()
        .modelQuery;
    
    const total = await new QueryBuilder(
        MaintenanceSchedule.find(baseQuery),
        req.query
    ).countTotal();
    
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const totalPages = Math.ceil(total / limit);

    const meta = {
        page,
        limit,
        total,
        totalPages
    };

    if (!maintenanceSchedules || maintenanceSchedules.length === 0) {
        return res.status(200).json({
            success: true,
            message: 'No maintenance schedules found',
            data: [],
            meta,
            rvMaintenanceStatus: rvStatus // Include RV status
        });
    }

    const schedulesWithStatus = maintenanceSchedules.map(schedule => {
        const statusInfo = calculateMaintenanceStatus(schedule, currentMileage);
        return {
            ...schedule.toObject(),
            status: statusInfo.status,
            isOverdue: statusInfo.isOverdue,
            nextMaintenanceDate: statusInfo.nextMaintenanceDate,
            nextMaintenanceMileage: statusInfo.nextMaintenanceMileage,
            daysUntilDue: statusInfo.daysUntilDue,
            mileageUntilDue: statusInfo.mileageUntilDue
        };
    });

    res.status(200).json({
        success: true,
        message: 'Maintenance schedules retrieved successfully',
        data: schedulesWithStatus,
        meta,
        rvMaintenanceStatus: rvStatus // Include RV status
    });
});

// @desc    Get single maintenance schedule by ID
// @route   GET /api/v1/maintenance-schedule/:id
// @access  Private
exports.getMaintenanceScheduleById = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    
    const maintenanceSchedule = await MaintenanceSchedule.findOne({
        _id: req.params.id,
        user: userId
    });

    if (!maintenanceSchedule) {
        throw new ApiError('Maintenance schedule not found or access denied', 404);
    }

    // Update RV maintenance status for this schedule's RV
    await updateRVMaintenanceStatus(maintenanceSchedule.rvId);

    // Get current mileage from RV for status calculation
    const rv = await RV.findById(maintenanceSchedule.rvId).select('currentMileage');
    const currentMileage = rv?.currentMileage || 0;

    // Calculate status
    const statusInfo = calculateMaintenanceStatus(maintenanceSchedule, currentMileage);
    const scheduleWithStatus = {
        ...maintenanceSchedule.toObject(),
        status: statusInfo.status,
        isOverdue: statusInfo.isOverdue,
        nextMaintenanceDate: statusInfo.nextMaintenanceDate,
        nextMaintenanceMileage: statusInfo.nextMaintenanceMileage,
        daysUntilDue: statusInfo.daysUntilDue,
        mileageUntilDue: statusInfo.mileageUntilDue
    };

    res.status(200).json({
        success: true,
        message: 'Maintenance schedule retrieved successfully',
        data: scheduleWithStatus
    });
});

exports.getMaintenanceByStatus = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { status } = req.params;
    const selectedRvId = await getSelectedRvByUserId(userId);
    
    let rvId = req.query.rvId;
    if (!rvId && !selectedRvId) {
        throw new ApiError('No RV selected. Please select an RV first.', 400);
    }
    if (!rvId) rvId = selectedRvId;

    const hasAccess = await checkRvOwnership(userId, rvId);
    if (!hasAccess) {
        throw new ApiError('You do not have permission to view maintenance for this RV', 403);
    }

    // Update RV maintenance status
    const rvStatus = await updateRVMaintenanceStatus(rvId);

    const rv = await RV.findById(rvId).select('currentMileage');
    const currentMileage = rv?.currentMileage || 0;

    const maintenanceSchedules = await MaintenanceSchedule.find({
        user: userId,
        rvId
    });

    if (!maintenanceSchedules || maintenanceSchedules.length === 0) {
        return res.status(200).json({
            success: true,
            message: 'No maintenance schedules found',
            data: [],
            rvMaintenanceStatus: rvStatus
        });
    }

    const schedulesWithStatus = maintenanceSchedules.map(schedule => {
        const statusInfo = calculateMaintenanceStatus(schedule, currentMileage);
        return {
            ...schedule.toObject(),
            status: statusInfo.status,
            isOverdue: statusInfo.isOverdue,
            nextMaintenanceDate: statusInfo.nextMaintenanceDate,
            nextMaintenanceMileage: statusInfo.nextMaintenanceMileage,
            daysUntilDue: statusInfo.daysUntilDue,
            mileageUntilDue: statusInfo.mileageUntilDue
        };
    });

    let filteredSchedules = schedulesWithStatus;
    if (status !== 'all') {
        filteredSchedules = schedulesWithStatus.filter(item => item.status === status);
    }

    filteredSchedules.sort((a, b) => {
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;
        return (a.daysUntilDue || 9999) - (b.daysUntilDue || 9999);
    });

    const summary = {
        total: schedulesWithStatus.length,
        overdue: schedulesWithStatus.filter(item => item.status === 'overdue').length,
        upcoming: schedulesWithStatus.filter(item => item.status === 'upcoming').length,
        scheduled: schedulesWithStatus.filter(item => item.status === 'scheduled').length
    };

    res.status(200).json({
        success: true,
        message: `Maintenance schedules ${status !== 'all' ? `with status '${status}'` : ''} retrieved successfully`,
        data: filteredSchedules,
        summary,
        rvMaintenanceStatus: rvStatus // Include RV status
    });
});


exports.getMaintenanceDashboard = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const selectedRvId = await getSelectedRvByUserId(userId);
    
    let rvId = req.query.rvId;
    if (!rvId && !selectedRvId) {
        throw new ApiError('No RV selected. Please select an RV first.', 400);
    }
    if (!rvId) rvId = selectedRvId;

    const hasAccess = await checkRvOwnership(userId, rvId);
    if (!hasAccess) {
        throw new ApiError('You do not have permission to view maintenance for this RV', 403);
    }

    // Update RV maintenance status when dashboard is accessed
    const rvStatus = await updateRVMaintenanceStatus(rvId);

    const rv = await RV.findById(rvId).select('currentMileage');
    const currentMileage = rv?.currentMileage || 0;

    const maintenanceSchedules = await MaintenanceSchedule.find({
        user: userId,
        rvId
    });

    if (!maintenanceSchedules || maintenanceSchedules.length === 0) {
        return res.status(200).json({
            success: true,
            message: 'No maintenance schedules found',
            data: {
                overdue: [],
                upcoming: [],
                scheduled: [],
                summary: {
                    total: 0,
                    overdue: 0,
                    upcoming: 0,
                    scheduled: 0
                }
            },
            rvMaintenanceStatus: rvStatus // Include RV status
        });
    }

    const overdue = [];
    const upcoming = [];
    const scheduled = [];

    maintenanceSchedules.forEach(schedule => {
        const statusInfo = calculateMaintenanceStatus(schedule, currentMileage);
        const scheduleWithStatus = {
            ...schedule.toObject(),
            status: statusInfo.status,
            isOverdue: statusInfo.isOverdue,
            nextMaintenanceDate: statusInfo.nextMaintenanceDate,
            nextMaintenanceMileage: statusInfo.nextMaintenanceMileage,
            daysUntilDue: statusInfo.daysUntilDue,
            mileageUntilDue: statusInfo.mileageUntilDue
        };

        switch (statusInfo.status) {
            case 'overdue':
                overdue.push(scheduleWithStatus);
                break;
            case 'upcoming':
                upcoming.push(scheduleWithStatus);
                break;
            case 'scheduled':
                scheduled.push(scheduleWithStatus);
                break;
        }
    });

    overdue.sort((a, b) => (a.daysUntilDue || -9999) - (b.daysUntilDue || -9999));
    upcoming.sort((a, b) => (a.daysUntilDue || 9999) - (b.daysUntilDue || 9999));
    scheduled.sort((a, b) => (a.daysUntilDue || 9999) - (b.daysUntilDue || 9999));

    const summary = {
        total: maintenanceSchedules.length,
        overdue: overdue.length,
        upcoming: upcoming.length,
        scheduled: scheduled.length
    };

    res.status(200).json({
        success: true,
        message: 'Maintenance dashboard retrieved successfully',
        data: {
            overdue,
            upcoming,
            scheduled,
            summary
        },
        rvMaintenanceStatus: rvStatus // Include RV status
    });
});

exports.updateMaintenanceSchedule = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    
    const existingSchedule = await MaintenanceSchedule.findOne({
        _id: req.params.id,
        user: userId
    });

    if (!existingSchedule) {
        throw new ApiError('Maintenance schedule not found or access denied', 404);
    }

    if (req.body.rvId && req.body.rvId !== existingSchedule.rvId.toString()) {
        const hasAccess = await checkRvOwnership(userId, req.body.rvId);
        if (!hasAccess) {
            throw new ApiError('You do not have permission to assign maintenance to this RV', 403);
        }
    }

    const maintenanceSchedule = await MaintenanceSchedule.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    // Update RV maintenance status after updating schedule
    // Update both old and new RV if rvId changed
    if (req.body.rvId && req.body.rvId !== existingSchedule.rvId.toString()) {
        await updateRVMaintenanceStatus(existingSchedule.rvId); // Update old RV
        await updateRVMaintenanceStatus(req.body.rvId); // Update new RV
    } else {
        await updateRVMaintenanceStatus(maintenanceSchedule.rvId);
    }

    res.status(200).json({
        success: true,
        message: 'Maintenance schedule updated successfully',
        data: maintenanceSchedule
    });
});


exports.deleteMaintenanceSchedule = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    
    const maintenanceSchedule = await MaintenanceSchedule.findOneAndDelete({
        _id: req.params.id,
        user: userId
    });

    if (!maintenanceSchedule) {
        throw new ApiError('Maintenance schedule not found or access denied', 404);
    }

    // Update RV maintenance status after deleting schedule
    await updateRVMaintenanceStatus(maintenanceSchedule.rvId);

    res.status(200).json({
        success: true,
        message: 'Maintenance schedule deleted successfully',
        data: {}
    });
});

exports.updateRVMaintenanceStatus = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { rvId } = req.params;

    const hasAccess = await checkRvOwnership(userId, rvId);
    if (!hasAccess) {
        throw new ApiError('You do not have permission to update status for this RV', 403);
    }

    const rvStatus = await updateRVMaintenanceStatus(rvId);

    res.status(200).json({
        success: true,
        message: 'RV maintenance status updated successfully',
        data: rvStatus
    });
});

// Helper function to check if user has access to the RV
async function checkRvOwnership(userId, rvId) {
    const user = await User.findById(userId).select('rvIds');
    if (!user || !user.rvIds.includes(rvId)) {
        return false;
    }
    return true;
}