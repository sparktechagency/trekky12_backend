const express = require('express');
const router = express.Router();
const { createMaintenanceSchedule, getMaintenanceSchedule, getMaintenanceScheduleById, updateMaintenanceSchedule, deleteMaintenanceSchedule } = require('./maintenanceSchedule.controller');
const upload = require('../../../utils/uploadConfig');
const { authenticateUser } = require('../../middleware/auth.middleware');


router.post('/create', authenticateUser, createMaintenanceSchedule);
router.get('/get', authenticateUser, getMaintenanceSchedule);
router.get('/get/:id', authenticateUser, getMaintenanceScheduleById);
router.put('/update/:id', authenticateUser, updateMaintenanceSchedule);
router.delete('/delete/:id', authenticateUser, deleteMaintenanceSchedule);    

module.exports = router;
