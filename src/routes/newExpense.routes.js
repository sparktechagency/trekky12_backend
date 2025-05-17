const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const upload = require('../utils/uploadConfig');
const {
    addExpense,
    getExpenses,
    getExpenseById,
    deleteExpense
} = require('../controllers/newExpense.controller');

router.post('/add', authenticate, upload.array('pictures', 5), addExpense);
router.get('/', authenticate, getExpenses);
router.get('/:id', authenticate, getExpenseById);
router.delete('/:id', authenticate, deleteExpense);

module.exports = router;