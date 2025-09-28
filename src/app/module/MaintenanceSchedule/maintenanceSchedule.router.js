const express = require('express');
const router = express.Router();
const { 
    createMaintenanceSchedule, 
    getMaintenanceSchedule, 
    getMaintenanceScheduleById, 
    updateMaintenanceSchedule, 
    deleteMaintenanceSchedule,
    getMaintenanceByStatus,
    getMaintenanceDashboard
} = require('./maintenanceSchedule.controller');
const upload = require('../../../utils/uploadConfig');
const { authenticateUser } = require('../../middleware/auth.middleware');

router.post('/create', authenticateUser, createMaintenanceSchedule);
router.get('/get', authenticateUser, getMaintenanceSchedule);
router.get('/get/:id', authenticateUser, getMaintenanceScheduleById);
router.put('/update/:id', authenticateUser, updateMaintenanceSchedule);
router.post('/delete/:id', authenticateUser, deleteMaintenanceSchedule);

// New endpoints for maintenance status
router.get('/status/:status', authenticateUser, getMaintenanceByStatus); // status: overdue, upcoming, scheduled, all
router.get('/dashboard', authenticateUser, getMaintenanceDashboard);

module.exports = router;