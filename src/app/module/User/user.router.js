const express = require('express');

const router = express.Router();

const { getUserProfile, updateUserProfile, changePassword, deleteAccount } = require('./user.controller');
const upload = require('../../../utils/uploadConfig');
const { authenticateUser } = require('../../middleware/auth.middleware');


 


router.get('/profile', authenticateUser, getUserProfile);
router.patch('/edit-profile', authenticateUser, upload.single('profilePic'), updateUserProfile);
router.put('/change-password', authenticateUser, changePassword);
router.delete('/delete-account', authenticateUser, deleteAccount);

module.exports = router;
