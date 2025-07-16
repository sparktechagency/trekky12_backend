const express = require('express');
const router = express.Router();
const { createOutdoorRadio, getOutdoorRadio, getOutdoorRadioById, updateOutdoorRadio, deleteOutdoorRadio } = require('./outdoorRadio.controller');
const upload = require('../../../utils/uploadConfig');
const { authenticateUser } = require('../../middleware/auth.middleware');


router.post('/create-outdoor-radio', authenticateUser, upload.array('images'), createOutdoorRadio);
router.get('/get-outdoor-radio', authenticateUser, getOutdoorRadio);
router.get('/get-outdoor-radio/:id', authenticateUser, getOutdoorRadioById);
router.put('/update-outdoor-radio/:id', authenticateUser, upload.array('images'), updateOutdoorRadio);
router.delete   ('/delete-outdoor-radio/:id', authenticateUser, deleteOutdoorRadio);

module.exports = router;
