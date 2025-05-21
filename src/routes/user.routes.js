const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { forgotPassword, verifyResetCode, resetPassword } = require('../controllers/auth.controller');

router.get('/profile', authenticate, getProfile);
router.put('/edit-profile', authenticate, updateProfile);


module.exports = router;
