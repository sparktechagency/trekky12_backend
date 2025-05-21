const express = require('express');
const router = express.Router();
const { register, login, googleAuth, appleAuth, googleCallback, appleCallback, logout } = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { forgotPassword, verifyResetCode, resetPassword } = require('../controllers/auth.controller');


router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/google/callback', googleCallback);
router.post('/apple', appleAuth);
router.post('/apple/callback', appleCallback);
router.post('/logout', authenticate, logout);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password', resetPassword);

module.exports = router;

