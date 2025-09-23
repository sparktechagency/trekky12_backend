const express = require('express');

const router = express.Router();

const { getUserProfile, updateUserProfile, changePassword, deleteAccount, selectRV } = require('./user.controller');
const upload = require('../../../utils/uploadConfig');
const { authenticateUser } = require('../../middleware/auth.middleware');


 


router.get('/profile', authenticateUser, getUserProfile);
router.put('/update-profile', authenticateUser, upload.single('profilePic'), updateUserProfile);
router.put('/change-password', authenticateUser, changePassword);
router.delete('/delete-account', authenticateUser, deleteAccount);
router.put('/select-rv', authenticateUser, selectRV);

module.exports = router;
