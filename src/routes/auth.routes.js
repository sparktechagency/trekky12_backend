const express = require('express');
const router = express.Router();
const { register, login, googleAuth, appleAuth, googleCallback, appleCallback, logout } = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/google/callback', googleCallback);
router.post('/apple', appleAuth);
router.post('/apple/callback', appleCallback);
router.post('/logout', authenticate, logout);

module.exports = router;

