const express = require('express');
const router = express.Router();
const { createExpense, getExpense, getExpenseById, updateExpense, deleteExpense } = require('./expense.controller');
const upload = require('../../../utils/uploadConfig');
const { authenticateUser } = require('../../middleware/auth.middleware');

router.post('/', authenticateUser, upload.array('images'), createExpense);
router.get('/', authenticateUser, getExpense);
router.get('/:id', authenticateUser, getExpenseById);
router.put('/:id', authenticateUser, upload.array('images'), updateExpense);
router.delete('/:id', authenticateUser, deleteExpense);

module.exports = router;
