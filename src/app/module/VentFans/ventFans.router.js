const express = require('express');
const router = express.Router();
const { createVentFans, getVentFans, getVentFansById, deleteVentFans, updateVentFans } = require('./ventFans.controller');
const upload = require('../../../utils/uploadConfig');
const { authenticateUser } = require('../../middleware/auth.middleware');

router.post('/create',authenticateUser, upload.array('images'), createVentFans);
router.get('/get', authenticateUser, getVentFans);
router.get('/get/:id', authenticateUser, getVentFansById);
router.delete('/delete/:id', authenticateUser, deleteVentFans);
router.put('/update/:id', authenticateUser, upload.array('images'), updateVentFans);

module.exports = router;
