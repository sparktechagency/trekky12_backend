const NewExpense = require('../models/newExpense.model');

// Add new expense
const addExpense = async (req, res) => {
    try {
        const {
            rvId,
            expenseType,
            date,
            vendor,
            city,
            cost,
            quantity,
            note
        } = req.body;

        // Get file paths from uploaded pictures
        const pictures = req.files ? req.files.map(file => file.path) : [];

        const newExpense = await NewExpense.create({
            userId: req.user.id || req.user._id || req.user.userId,
            rvId,
            expenseType,
            date,
            vendor,
            city,
            cost,
            quantity,
            pictures,
            note
        });

        res.status(201).json({
            success: true,
            message: 'Expense added successfully',
            expense: newExpense
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add expense',
            error: error.message
        });
    }
};

// Get all expenses for a user
const getExpenses = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id || req.user.userId;
        const expenses = await NewExpense.find({ userId })
            .populate('rvId', 'nickname manufacturer model')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            expenses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch expenses',
            error: error.message
        });
    }
};

// Get single expense by ID
const getExpenseById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id || req.user._id || req.user.userId;

        const expense = await NewExpense.findOne({
            _id: id,
            userId
        }).populate('rvId', 'nickname manufacturer model');

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found or unauthorized'
            });
        }

        res.status(200).json({
            success: true,
            expense
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch expense',
            error: error.message
        });
    }
};

// Delete expense
const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id || req.user._id || req.user.userId;

        const expense = await NewExpense.findOneAndDelete({
            _id: id,
            userId
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found or unauthorized'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Expense deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete expense',
            error: error.message
        });
    }
};

module.exports = {
    addExpense,
    getExpenses,
    getExpenseById,
    deleteExpense
};