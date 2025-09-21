const express = require('express');
const router = express.Router();
// const { authenticateAdmin } = require('../../middleware/auth.middleware');
const { getUsers, getUserById, blockUser, unblockUser, deleteUser } = require('./userManagement');

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/block', blockUser);
router.put('/users/:id/unblock', unblockUser);
router.delete('/users/:id', deleteUser);

module.exports = router;