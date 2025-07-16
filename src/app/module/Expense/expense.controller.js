const Expense = require('./Expense');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');

exports.createExpense = asyncHandler(async (req, res) => {
    const expense = await Expense.create(req.body);
    if (!expense) throw new ApiError('Expense not created', 500);
    const images = req.files.map(file => file.path);
    expense.images = images;
    await expense.save();
    
    res.status(201).json({
        success: true,
        message: 'Expense created successfully',
        expense
    });
});

exports.getExpense = asyncHandler(async (req, res) => {
    const expense = await Expense.find();
    if (!expense) throw new ApiError('Expense not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Expense retrieved successfully',
        expense
    });
});

exports.getExpenseById = asyncHandler(async (req, res) => {
    const expense = await Expense.findById(req.params.id);
    if (!expense) throw new ApiError('Expense not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Expense retrieved successfully',
        expense
    });
});


exports.updateExpense = asyncHandler(async (req, res) => {
    const expense = await Expense.findById(req.params.id);
    if (!expense) throw new ApiError('Expense not found', 404);

    if (req.files && req.files.length > 0) {
        const oldImages = expense.images;
        const newImages = req.files.map(image => image.path);
        expense.images = [...oldImages, ...newImages];
        await expense.save();
    } else {
        await expense.updateOne(req.body);
    }

    return res.status(200).json({
        success: true,
        message: 'Expense updated successfully',
        expense
    });
});


exports.deleteExpense = asyncHandler(async (req, res) => {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) throw new ApiError('Expense not found', 404);
    return res.status(200).json({
        success: true,
        message: 'Expense deleted successfully',
        expense
    });
});
