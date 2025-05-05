const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser } = require('../controllers/admin.controller');
const { authenticate, authorizeAdmin } = require('../middlewares/auth.middleware');

router.get('/users', authenticate, authorizeAdmin, getAllUsers);
router.delete('/user/:id', authenticate, authorizeAdmin, deleteUser);

module.exports = router;