// utils/rvMaintenanceUpdater.js
const MaintenanceSchedule = require('../app/module/MaintenanceSchedule/MaintenanceSchedule');
const RV = require('../app/module/RV/RV');

// Use the same calculateMaintenanceStatus function from your controller
const calculateMaintenanceStatus = (schedule, currentMileage, currentDate = new Date()) => {
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

  return {
    nextMaintenanceDate,
    nextMaintenanceMileage,
    status,
    isOverdue
  };
};

// Function to update RV maintenance status
const updateRVMaintenanceStatus = async (rvId) => {
  try {
    // Get the RV with current mileage
    const rv = await RV.findById(rvId);
    if (!rv) {
      throw new Error('RV not found');
    }

    // Get all maintenance schedules for this RV
    const maintenanceSchedules = await MaintenanceSchedule.find({ rvId });
    
    if (!maintenanceSchedules || maintenanceSchedules.length === 0) {
      // No maintenance schedules - reset status
      await RV.findByIdAndUpdate(rvId, {
        isOverdueForMaintenance: false,
        overdueMaintenanceCount: 0,
        nextMaintenanceDate: null,
        nextMaintenanceMileage: null,
        lastMaintenanceCheck: new Date()
      });
      return { hasOverdue: false, count: 0 };
    }

    let hasOverdue = false;
    let overdueCount = 0;
    let closestNextDate = null;
    let closestNextMileage = null;

    // Check each maintenance schedule
    for (const schedule of maintenanceSchedules) {
      const statusInfo = calculateMaintenanceStatus(schedule, rv.currentMileage || 0);
      
      if (statusInfo.isOverdue) {
        hasOverdue = true;
        overdueCount++;
      }

      // Find the closest upcoming maintenance
      if (statusInfo.nextMaintenanceDate) {
        if (!closestNextDate || statusInfo.nextMaintenanceDate < closestNextDate) {
          closestNextDate = statusInfo.nextMaintenanceDate;
        }
      }

      if (statusInfo.nextMaintenanceMileage) {
        if (!closestNextMileage || statusInfo.nextMaintenanceMileage < closestNextMileage) {
          closestNextMileage = statusInfo.nextMaintenanceMileage;
        }
      }
    }

    // Update the RV with the calculated status
    await RV.findByIdAndUpdate(rvId, {
      isOverdueForMaintenance: hasOverdue,
      overdueMaintenanceCount: overdueCount,
      nextMaintenanceDate: closestNextDate,
      nextMaintenanceMileage: closestNextMileage,
      lastMaintenanceCheck: new Date()
    });

    return {
      hasOverdue,
      overdueCount,
      nextMaintenanceDate: closestNextDate,
      nextMaintenanceMileage: closestNextMileage
    };

  } catch (error) {
    console.error('Error updating RV maintenance status:', error);
    throw error;
  }
};

module.exports = {
  updateRVMaintenanceStatus
};