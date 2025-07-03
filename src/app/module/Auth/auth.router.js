const express = require('express');

const router = express.Router();

const { signup, verifyEmail, login } = require('./auth.controller');


router.post('/register', signup);
router.post('/verify-email', verifyEmail);
router.post('/login', login);

module.exports = router;


