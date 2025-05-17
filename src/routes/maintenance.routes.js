const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const upload = require('../utils/uploadConfig');
const {
    addMaintenance,
    updateMaintenance,
    getMaintenance,
    deleteMaintenance
} = require('../controllers/maintenance.controller');

// Routes
router.post('/add', authenticate,upload.none(), addMaintenance);
router.put('/update/:id', authenticate, upload.array('pictures', 5), updateMaintenance);
router.get('/', authenticate, getMaintenance);
router.delete('/:id', authenticate, deleteMaintenance);

module.exports = router;