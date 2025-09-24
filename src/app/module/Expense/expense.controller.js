const Expense = require('./Expense');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const QueryBuilder = require('../../../builder/queryBuilder');
const getSelectedRvByUserId = require('../../../utils/currentRv');
const deleteDocumentWithFiles = require('../../../utils/deleteDocumentWithImages');

// @desc    Create a new expense
// @route   POST /api/v1/expense/create
// @access  Private
exports.createExpense = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const selectedRvId = await getSelectedRvByUserId(userId);
    let rvId = req.body.rvId;
    
    if(!rvId && !selectedRvId) throw new ApiError('No selected RV found', 404);
    if(!rvId) rvId = selectedRvId;
    
    const expense = await Expense.create({
        rvId,
        ...req.body,
        user: userId,
    });
    
    const images = req.files;
    if (!expense) throw new ApiError('Expense not created', 500);

    if (images && images.length > 0) {
        const imagePaths = images.map(image => image.location);
        expense.images = imagePaths;
        await expense.save();
    }

    res.status(201).json({
        success: true,
        message: 'Expense created successfully',
        data: expense
    });
});

// @desc    Get all expenses with filtering, sorting, and pagination
// @route   GET /api/v1/expense/get
// @access  Private
exports.getExpenses = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const selectedRvId = await getSelectedRvByUserId(userId);
    let rvId = req.query.rvId;
    
    if(!rvId && !selectedRvId) throw new ApiError('No selected RV found', 404);
    if(!rvId) rvId = selectedRvId;
    
    const baseQuery = { user: userId, rvId };

    const expenseQuery = new QueryBuilder(
        Expense.find(baseQuery),
        req.query
    );
    
    const expenses = await expenseQuery
        .search(['expenseType', 'vendor', 'notes']) // Add searchable fields
        .filter()
        .sort()
        .paginate()
        .fields()
        .modelQuery;

    const meta = await new QueryBuilder(
        Expense.find(baseQuery),
        req.query
    ).countTotal();

    if (!expenses || expenses.length === 0) {
        throw new ApiError('No expenses found', 404);
    }

    res.status(200).json({
        success: true,
        message: 'Expenses retrieved successfully',
        meta,
        data: expenses
    });
});

// @desc    Get single expense by ID
// @route   GET /api/v1/expense/get/:id
// @access  Private
exports.getExpenseById = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    
    const expense = await Expense.findOne({
        _id: req.params.id,
        user: userId
    });

    if (!expense) {
        throw new ApiError('Expense not found or access denied', 404);
    }

    res.status(200).json({
        success: true,
        message: 'Expense retrieved successfully',
        data: expense
    });
});

// @desc    Update an expense
// @route   PUT /api/v1/expense/update/:id
// @access  Private
exports.updateExpense = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    
    const expense = await Expense.findOne({
        _id: req.params.id,
        user: userId
    });
    
    if (!expense) {
        throw new ApiError('Expense not found or access denied', 404);
    }

    // Update expense fields from req.body
    Object.keys(req.body).forEach(key => {
        if (key !== 'images') { // Don't override images from req.body
            expense[key] = req.body[key];
        }
    });

    // Handle image updates if new files are uploaded
    if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => file.location);
        expense.images = [...expense.images, ...newImages];
    }

    await expense.save();

    res.status(200).json({
        success: true,
        message: 'Expense updated successfully',
        data: expense
    });
});

// @desc    Delete an expense
// @route   DELETE /api/v1/expense/delete/:id
// @access  Private
exports.deleteExpense = asyncHandler(async (req, res) => {
    const expense = await deleteDocumentWithFiles(Expense, req.params.id, "uploads");
    if (!expense) throw new ApiError("Expense not found", 404);

    return res.status(200).json({
        success: true,
        message: "Expense deleted successfully (with images)",
        expense,
    });
});