const express = require('express');
const router = express.Router();
const { createMembership, getMembership, getMembershipById, updateMembership, deleteMembership } = require('./membership.controller');
const upload = require('../../../utils/uploadConfig');
const { authenticateUser } = require('../../middleware/auth.middleware');

router.post('/create', authenticateUser, upload.array('images'), createMembership);
router.get('/get', authenticateUser, getMembership);
router.get('/get/:id', authenticateUser, getMembershipById);
router.put('/update/:id', authenticateUser, upload.array('images'), updateMembership);
router.delete('/delete/:id', authenticateUser, deleteMembership);

module.exports = router;

