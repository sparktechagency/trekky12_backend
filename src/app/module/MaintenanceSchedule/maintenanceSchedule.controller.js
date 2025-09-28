// const MaintenanceSchedule = require('./MaintenanceSchedule');
// const asyncHandler = require('../../../utils/asyncHandler');
// const { ApiError } = require('../../../errors/errorHandler');
// const getSelectedRvByUserId = require('../../../utils/currentRv');
// const User = require('../../module/User/User');
// const checkValidRv = require('../../../utils/checkValidRv');
// const QueryBuilder = require('../../../builder/queryBuilder');
// // @desc    Create a new maintenance schedule
// // @route   POST /api/v1/maintenance-schedule
// // @access  Private
// exports.createMaintenanceSchedule = asyncHandler(async (req, res) => {
//     const userId = req.user.id || req.user._id;
//     const selectedRvId = await getSelectedRvByUserId(userId);
    
//     // Use provided rvId or fallback to selected RV
//     let rvId = req.body?.rvId;
//     if (!rvId && !selectedRvId) {
//         throw new ApiError('No RV selected. Please select an RV first.', 400);
//     }
//     if (!rvId) rvId = selectedRvId;

//     // Verify the user has access to the specified RV
//     // This assumes you have a function to check RV ownership
//     const hasAccess = await checkValidRv(userId, rvId);
//     if (!hasAccess) {
//         throw new ApiError('You do not have permission to add maintenance for this RV', 403);
//     }

//     const maintenanceSchedule = await MaintenanceSchedule.create({
//         ...req.body,
//         user: userId,
//         rvId
//     });

//     if (!maintenanceSchedule) {
//         throw new ApiError('Failed to create maintenance schedule', 500);
//     }

//     res.status(201).json({
//         success: true,
//         message: 'Maintenance schedule created successfully',
//         data: maintenanceSchedule
//     });
// });

// // @desc    Get all maintenance schedules with filtering
// // @route   GET /api/v1/maintenance-schedule
// // @access  Private
// // exports.getMaintenanceSchedule = asyncHandler(async (req, res) => {
// //     const userId = req.user.id || req.user._id;
// //     const selectedRvId = await getSelectedRvByUserId(userId);
    
// //     let rvId = req.query.rvId;
// //     if (!rvId && !selectedRvId) {
// //         throw new ApiError('No RV selected. Please select an RV first.', 400);
// //     }
// //     if (!rvId) rvId = selectedRvId;

// //     // Verify the user has access to the specified RV
// //     const hasAccess = await checkRvOwnership(userId, rvId);
// //     if (!hasAccess) {
// //         throw new ApiError('You do not have permission to view maintenance for this RV', 403);
// //     }
    
// //     const maintenanceSchedules = await MaintenanceSchedule.find({
// //         user: userId,
// //         rvId
// //     });

// //     if (!maintenanceSchedules || maintenanceSchedules.length === 0) {
// //         return res.status(200).json({
// //             success: true,
// //             message: 'No maintenance schedules found',
// //             data: maintenanceSchedules
// //         });
// //     }

// //     res.status(200).json({
// //         success: true,
// //         message: 'Maintenance schedules retrieved successfully',
// //         data: maintenanceSchedules
// //     });
// // });

// exports.getMaintenanceSchedule = asyncHandler(async (req, res) => {
//     const userId = req.user.id || req.user._id;
//     const selectedRvId = await getSelectedRvByUserId(userId);
    
//     let rvId = req.query.rvId;
//     if (!rvId && !selectedRvId) {
//         throw new ApiError('No RV selected. Please select an RV first.', 400);
//     }
//     if (!rvId) rvId = selectedRvId;

//     // Verify the user has access to the specified RV
//     const hasAccess = await checkRvOwnership(userId, rvId);
//     if (!hasAccess) {
//         throw new ApiError('You do not have permission to view maintenance for this RV', 403);
//     }
    
//     // Add rvId to query for filtering
//     req.query.rvId = rvId;
    
//     // Create base query with user filter
//     const baseQuery = { user: userId, rvId };
    
//     // Initialize QueryBuilder
//     const maintenanceQuery = new QueryBuilder(
//         MaintenanceSchedule.find(baseQuery),
//         req.query
//     );
    
//     // Apply search, filter, sort, pagination
//     const maintenanceSchedules = await maintenanceQuery
//         .search(['title', 'description', 'status', 'maintenanceType'])
//         .filter()
//         .sort()
//         .paginate()
//         .fields()
//         .modelQuery;
    
//     // Get total count for pagination
//     const total = await new QueryBuilder(
//         MaintenanceSchedule.find(baseQuery),
//         req.query
//     ).countTotal();
    
//     // Calculate pagination metadata
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;
//     const totalPages = Math.ceil(total / limit);

//     const meta = {
//         page,
//         limit,
//         total,
//         totalPages
//     };

//     if (!maintenanceSchedules || maintenanceSchedules.length === 0) {
//         return res.status(200).json({
//             success: true,
//             message: 'No maintenance schedules found',
//             data: [],
//             meta
//         });
//     }

//     res.status(200).json({
//         success: true,
//         message: 'Maintenance schedules retrieved successfully',
//         data: maintenanceSchedules,
//         meta
//     });
// });

// // @desc    Get single maintenance schedule by ID
// // @route   GET /api/v1/maintenance-schedule/:id
// // @access  Private
// exports.getMaintenanceScheduleById = asyncHandler(async (req, res) => {
//     const userId = req.user.id || req.user._id;
    
//     const maintenanceSchedule = await MaintenanceSchedule.findOne({
//         _id: req.params.id,
//         user: userId
//     });

//     if (!maintenanceSchedule) {
//         throw new ApiError('Maintenance schedule not found or access denied', 404);
//     }

//     res.status(200).json({
//         success: true,
//         message: 'Maintenance schedule retrieved successfully',
//         data: maintenanceSchedule
//     });
// });

// // @desc    Update a maintenance schedule
// // @route   PUT /api/v1/maintenance-schedule/:id
// // @access  Private
// exports.updateMaintenanceSchedule = asyncHandler(async (req, res) => {
//     const userId = req.user.id || req.user._id;
    
//     // First find the existing maintenance schedule
//     const existingSchedule = await MaintenanceSchedule.findOne({
//         _id: req.params.id,
//         user: userId
//     });

//     if (!existingSchedule) {
//         throw new ApiError('Maintenance schedule not found or access denied', 404);
//     }

//     // If rvId is being updated, verify the user has access to the new RV
//     if (req.body.rvId && req.body.rvId !== existingSchedule.rvId.toString()) {
//         const hasAccess = await checkRvOwnership(userId, req.body.rvId);
//         if (!hasAccess) {
//             throw new ApiError('You do not have permission to assign maintenance to this RV', 403);
//         }
//     }

//     const maintenanceSchedule = await MaintenanceSchedule.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         { new: true, runValidators: true }
//     );

//     res.status(200).json({
//         success: true,
//         message: 'Maintenance schedule updated successfully',
//         data: maintenanceSchedule
//     });
// });

// // @desc    Delete a maintenance schedule
// // @route   DELETE /api/v1/maintenance-schedule/:id
// // @access  Private
// exports.deleteMaintenanceSchedule = asyncHandler(async (req, res) => {
//     const userId = req.user.id || req.user._id;
    
//     const maintenanceSchedule = await MaintenanceSchedule.findOneAndDelete({
//         _id: req.params.id,
//         user: userId
//     });

//     if (!maintenanceSchedule) {
//         throw new ApiError('Maintenance schedule not found or access denied', 404);
//     }

//     res.status(200).json({
//         success: true,
//         message: 'Maintenance schedule deleted successfully',
//         data: {}
//     });
// });

// // Helper function to check if user has access to the RV
// async function checkRvOwnership(userId, rvId) {
//     // Check if the user has the specified RV in their user schema
//     const user = await User.findById(userId).select('rvIds');
//     if (!user || !user.rvIds.includes(rvId)) {
//         return false;
//     }
//     return true;
// }


const MaintenanceSchedule = require('./MaintenanceSchedule');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const getSelectedRvByUserId = require('../../../utils/currentRv');
const User = require('../../module/User/User');
const checkValidRv = require('../../../utils/checkValidRv');
const QueryBuilder = require('../../../builder/queryBuilder');
const RV = require('../RV/RV'); // Make sure to import RV model

// Utility function to calculate maintenance status
const calculateMaintenanceStatus = (schedule, currentMileage, currentDate = new Date()) => {
  const {
    initialMilage,
    milageAtMaintenance,
    maintenanceToBePerformed,
    dateOfMaintenance
  } = schedule;

  // Default intervals (you can make these configurable)
  const TIME_INTERVAL_MONTHS = 6;
  const MILEAGE_INTERVAL = 5000;
  const UPCOMING_THRESHOLD_DAYS = 30;

  let nextMaintenanceDate = null;
  let nextMaintenanceMileage = null;
  let status = 'scheduled';
  let isOverdue = false;

  // If maintenance was already performed, calculate next based on last maintenance
  if (dateOfMaintenance && milageAtMaintenance !== undefined && milageAtMaintenance !== null) {
    // Calculate based on time interval
    const nextDate = new Date(dateOfMaintenance);
    nextDate.setMonth(nextDate.getMonth() + TIME_INTERVAL_MONTHS);
    nextMaintenanceDate = nextDate;

    // Calculate based on mileage
    nextMaintenanceMileage = milageAtMaintenance + MILEAGE_INTERVAL;
  } else {
    // First maintenance based on initial values
    nextMaintenanceDate = maintenanceToBePerformed;
    if (initialMilage !== undefined && initialMilage !== null) {
      nextMaintenanceMileage = initialMilage + MILEAGE_INTERVAL;
    }
  }

  // Check date-based status
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

  // Check mileage-based status (overrides date status if more urgent)
  if (nextMaintenanceMileage && currentMileage >= nextMaintenanceMileage) {
    isOverdue = true;
    status = 'overdue';
  }

  // Calculate days until due
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

// @desc    Create a new maintenance schedule
// @route   POST /api/v1/maintenance-schedule
// @access  Private
exports.createMaintenanceSchedule = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const selectedRvId = await getSelectedRvByUserId(userId);
    
    // Use provided rvId or fallback to selected RV
    let rvId = req.body?.rvId;
    if (!rvId && !selectedRvId) {
        throw new ApiError('No RV selected. Please select an RV first.', 400);
    }
    if (!rvId) rvId = selectedRvId;

    // Verify the user has access to the specified RV
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

    res.status(201).json({
        success: true,
        message: 'Maintenance schedule created successfully',
        data: maintenanceSchedule
    });
});

// @desc    Get all maintenance schedules with filtering and status calculation
// @route   GET /api/v1/maintenance-schedule
// @access  Private
exports.getMaintenanceSchedule = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const selectedRvId = await getSelectedRvByUserId(userId);
    
    let rvId = req.query.rvId;
    if (!rvId && !selectedRvId) {
        throw new ApiError('No RV selected. Please select an RV first.', 400);
    }
    if (!rvId) rvId = selectedRvId;

    // Verify the user has access to the specified RV
    const hasAccess = await checkRvOwnership(userId, rvId);
    if (!hasAccess) {
        throw new ApiError('You do not have permission to view maintenance for this RV', 403);
    }
    
    // Get current mileage from RV
    const rv = await RV.findById(rvId).select('currentMileage');
    const currentMileage = rv?.currentMileage || 0;
    
    // Add rvId to query for filtering
    req.query.rvId = rvId;
    
    // Create base query with user filter
    const baseQuery = { user: userId, rvId };
    
    // Initialize QueryBuilder
    const maintenanceQuery = new QueryBuilder(
        MaintenanceSchedule.find(baseQuery),
        req.query
    );
    
    // Apply search, filter, sort, pagination
    const maintenanceSchedules = await maintenanceQuery
        .search(['component', 'maintenanceToBePerformed', 'notes'])
        .filter()
        .sort()
        .paginate()
        .fields()
        .modelQuery;
    
    // Get total count for pagination
    const total = await new QueryBuilder(
        MaintenanceSchedule.find(baseQuery),
        req.query
    ).countTotal();
    
    // Calculate pagination metadata
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
            meta
        });
    }

    // Calculate status for each schedule
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
        meta
    });
});

// @desc    Get maintenance schedules by status (overdue, upcoming, scheduled)
// @route   GET /api/v1/maintenance-schedule/status/:status
// @access  Private
exports.getMaintenanceByStatus = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { status } = req.params;
    const selectedRvId = await getSelectedRvByUserId(userId);
    
    let rvId = req.query.rvId;
    if (!rvId && !selectedRvId) {
        throw new ApiError('No RV selected. Please select an RV first.', 400);
    }
    if (!rvId) rvId = selectedRvId;

    // Verify the user has access to the specified RV
    const hasAccess = await checkRvOwnership(userId, rvId);
    if (!hasAccess) {
        throw new ApiError('You do not have permission to view maintenance for this RV', 403);
    }

    // Get current mileage from RV
    const rv = await RV.findById(rvId).select('currentMileage');
    const currentMileage = rv?.currentMileage || 0;

    // Get all maintenance schedules for the user and RV
    const maintenanceSchedules = await MaintenanceSchedule.find({
        user: userId,
        rvId
    });

    if (!maintenanceSchedules || maintenanceSchedules.length === 0) {
        return res.status(200).json({
            success: true,
            message: 'No maintenance schedules found',
            data: []
        });
    }

    // Calculate status for each schedule
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

    // Filter by status if not 'all'
    let filteredSchedules = schedulesWithStatus;
    if (status !== 'all') {
        filteredSchedules = schedulesWithStatus.filter(item => item.status === status);
    }

    // Sort by urgency (overdue first, then upcoming, then by days until due)
    filteredSchedules.sort((a, b) => {
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;
        return (a.daysUntilDue || 9999) - (b.daysUntilDue || 9999);
    });

    // Get summary counts
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
        summary
    });
});

// @desc    Get maintenance dashboard with categorized schedules
// @route   GET /api/v1/maintenance-schedule/dashboard
// @access  Private
exports.getMaintenanceDashboard = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const selectedRvId = await getSelectedRvByUserId(userId);
    
    let rvId = req.query.rvId;
    if (!rvId && !selectedRvId) {
        throw new ApiError('No RV selected. Please select an RV first.', 400);
    }
    if (!rvId) rvId = selectedRvId;

    // Verify the user has access to the specified RV
    const hasAccess = await checkRvOwnership(userId, rvId);
    if (!hasAccess) {
        throw new ApiError('You do not have permission to view maintenance for this RV', 403);
    }

    // Get current mileage from RV
    const rv = await RV.findById(rvId).select('currentMileage');
    const currentMileage = rv?.currentMileage || 0;

    // Get all maintenance schedules for the user and RV
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
            }
        });
    }

    // Calculate status for each schedule and categorize
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

    // Sort each category by urgency
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
        }
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

// @desc    Update a maintenance schedule
// @route   PUT /api/v1/maintenance-schedule/:id
// @access  Private
exports.updateMaintenanceSchedule = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    
    // First find the existing maintenance schedule
    const existingSchedule = await MaintenanceSchedule.findOne({
        _id: req.params.id,
        user: userId
    });

    if (!existingSchedule) {
        throw new ApiError('Maintenance schedule not found or access denied', 404);
    }

    // If rvId is being updated, verify the user has access to the new RV
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

    res.status(200).json({
        success: true,
        message: 'Maintenance schedule updated successfully',
        data: maintenanceSchedule
    });
});

// @desc    Delete a maintenance schedule
// @route   DELETE /api/v1/maintenance-schedule/:id
// @access  Private
exports.deleteMaintenanceSchedule = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    
    const maintenanceSchedule = await MaintenanceSchedule.findOneAndDelete({
        _id: req.params.id,
        user: userId
    });

    if (!maintenanceSchedule) {
        throw new ApiError('Maintenance schedule not found or access denied', 404);
    }

    res.status(200).json({
        success: true,
        message: 'Maintenance schedule deleted successfully',
        data: {}
    });
});

// Helper function to check if user has access to the RV
async function checkRvOwnership(userId, rvId) {
    // Check if the user has the specified RV in their user schema
    const user = await User.findById(userId).select('rvIds');
    if (!user || !user.rvIds.includes(rvId)) {
        return false;
    }
    return true;
}