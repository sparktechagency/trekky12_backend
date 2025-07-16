const express = require('express');
const router = express.Router();

const { createNewRepair, getNewRepair, getNewRepairById, updateNewRepair, deleteNewRepair } = require('./newRepair.controller');
const upload = require('../../../utils/uploadConfig');
const { authenticateUser } = require('../../middleware/auth.middleware');

router.post('/create',authenticateUser, upload.array('images'), createNewRepair);
router.get('/get', authenticateUser, getNewRepair);
router.get('/get/:id', authenticateUser, getNewRepairById);
router.put('/update/:id', authenticateUser, upload.array('images'), updateNewRepair);
router.delete('/delete/:id', authenticateUser, deleteNewRepair);

module.exports = router;


