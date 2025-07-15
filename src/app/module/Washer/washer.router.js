const express = require('express');
const router = express.Router();

const { createWasher, getWashers, getWasherById, updateWasher, deleteWasher } = require('./washer.controller');
const { authenticateUser } = require('../../middleware/auth.middleware');
const upload = require('../../../utils/uploadConfig');

router.post('/create', authenticateUser, upload.array('images'), createWasher);
router.get('/get', authenticateUser, getWashers);
router.get('/get/:id', authenticateUser, getWasherById);
router.put('/update/:id', authenticateUser, upload.array('images'), updateWasher);
router.delete('/delete/:id', authenticateUser, deleteWasher);

module.exports = router;
