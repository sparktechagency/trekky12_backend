const express = require('express');

const router = express.Router();

const { createChecklist, getAllChecklist, getChecklistById, updateChecklist, deleteChecklist } = require('./checklist.controller');
const { authenticateUser } = require('../../middleware/auth.middleware');
const upload = require('../../../utils/uploadConfig');

router.post('/create', authenticateUser, createChecklist);
router.get('/get', authenticateUser, getAllChecklist);
router.get('/get/:id', authenticateUser, getChecklistById);
router.put('/update/:id', authenticateUser,updateChecklist);
router.post('/delete/:id', authenticateUser, deleteChecklist);

module.exports = router;

