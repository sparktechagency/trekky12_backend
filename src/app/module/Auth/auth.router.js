const express = require('express');

const router = express.Router();

const { signup, verifyEmail, login, adminLogin, resendVerificationCode, forgotPassword, resetPassword, verifyCode, resendPasswordResetCode } = require('./auth.controller');


router.post('/register', signup);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/resend-verification-code', resendVerificationCode);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-reset-code', verifyCode);
router.post('/resend-password-reset-code', resendPasswordResetCode);
router.post('/admin-login', adminLogin);

module.exports = router;
