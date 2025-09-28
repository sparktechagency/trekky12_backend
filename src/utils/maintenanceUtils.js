// utils/maintenanceUtils.js
const calculateNextMaintenance = (schedule, currentMileage, currentDate = new Date()) => {
    const {
      initialMilage,
      milageAtMaintenance,
      maintenanceToBePerformed,
      dateOfMaintenance
    } = schedule;
  
    let nextMaintenanceDate = null;
    let nextMaintenanceMileage = null;
    let status = 'pending';
    let isOverdue = false;
  
    // If maintenance was already performed, calculate next based on last maintenance
    if (dateOfMaintenance && milageAtMaintenance !== undefined) {
      // Calculate based on time interval (assuming 6 months interval for example)
      const nextDate = new Date(dateOfMaintenance);
      nextDate.setMonth(nextDate.getMonth() + 6); // Adjust interval as needed
      nextMaintenanceDate = nextDate;
  
      // Calculate based on mileage (assuming 5000 miles interval)
      nextMaintenanceMileage = milageAtMaintenance + 5000; // Adjust interval as needed
    } else {
      // First maintenance based on initial values
      nextMaintenanceDate = maintenanceToBePerformed;
      nextMaintenanceMileage = initialMilage + 5000; // Adjust interval as needed
    }
  
    // Check if overdue
    const today = currentDate;
    if (nextMaintenanceDate && nextMaintenanceDate < today) {
      isOverdue = true;
      status = 'overdue';
    } else if (nextMaintenanceDate && nextMaintenanceDate <= new Date(today.setDate(today.getDate() + 30))) {
      status = 'upcoming';
    } else {
      status = 'scheduled';
    }
  
    // Also check mileage-based overdue
    if (nextMaintenanceMileage && currentMileage >= nextMaintenanceMileage) {
      isOverdue = true;
      status = 'overdue';
    }
  
    return {
      nextMaintenanceDate,
      nextMaintenanceMileage,
      status,
      isOverdue,
      daysUntilDue: nextMaintenanceDate ? 
        Math.ceil((nextMaintenanceDate - currentDate) / (1000 * 60 * 60 * 24)) : null
    };
  };