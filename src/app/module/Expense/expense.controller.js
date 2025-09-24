const Expense = require('./Expense');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const deleteDocumentWithFiles = require('../../../utils/deleteDocumentWithImages');
const QueryBuilder = require('../../../builder/queryBuilder');
const getSelectedRvByUserId = require('../../../utils/currentRv');

// @desc    Create a new expense
// @route   POST /api/v1/expense
// @access  Private
exports.createExpense = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const selectedRv = await getSelectedRvByUserId(userId);
    
    if (!selectedRv) {
        throw new ApiError('Please select an RV first', 400);
    }

    // Process images from S3
    const images = [];
    if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
            if (file.location) {
                images.push(file.location);
            }
        });
    }

    const expenseData = {
        ...req.body,
        user: userId,
        rvId: selectedRv._id,
        images
    };

    const expense = await Expense.create(expenseData);
    if (!expense) throw new ApiError('Failed to create expense', 500);

    res.status(201).json({
        success: true,
        message: 'Expense created successfully',
        data: expense
    });
});

// @desc    Get all expenses with filtering, sorting, and pagination
// @route   GET /api/v1/expense
// @access  Private
exports.getExpenses = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const selectedRv = await getSelectedRvByUserId(userId);
    
    if (!selectedRv) {
        throw new ApiError('Please select an RV first', 400);
    }

    // Use QueryBuilder for advanced querying
    const features = new QueryBuilder(Expense.find({ rvId: selectedRv._id }), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const expenses = await features.query;
    const meta = features.getMeta();

    res.status(200).json({
        success: true,
        message: 'Expenses retrieved successfully',
        data: expenses,
        meta
    });
});

// @desc    Get single expense by ID
// @route   GET /api/v1/expense/:id
// @access  Private
exports.getExpenseById = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const selectedRv = await getSelectedRvByUserId(userId);
    
    if (!selectedRv) {
        throw new ApiError('Please select an RV first', 400);
    }

    const expense = await Expense.findOne({
        _id: req.params.id,
        rvId: selectedRv._id,
        user: userId
    });

    if (!expense) {
        throw new ApiError('Expense not found', 404);
    }

    res.status(200).json({
        success: true,
        message: 'Expense retrieved successfully',
        data: expense
    });
});

// @desc    Update an expense
// @route   PUT /api/v1/expense/:id
// @access  Private
exports.updateExpense = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const selectedRv = await getSelectedRvByUserId(userId);
    
    if (!selectedRv) {
        throw new ApiError('Please select an RV first', 400);
    }

    let expense = await Expense.findOne({
        _id: req.params.id,
        rvId: selectedRv._id,
        user: userId
    });

    if (!expense) {
        throw new ApiError('Expense not found', 404);
    }

    // Process new images from S3
    if (req.files && req.files.length > 0) {
        // Add new images
        const newImages = req.files
            .filter(file => file.location)
            .map(file => file.location);
        
        // Combine with existing images if needed, or replace them
        const updatedImages = [...expense.images, ...newImages];
        
        // Update the expense with new images
        expense.images = updatedImages;
    }

    // Update other fields
    Object.keys(req.body).forEach(key => {
        if (key !== 'images') { // Don't override images from req.body
            expense[key] = req.body[key];
        }
    });

    await expense.save();

    res.status(200).json({
        success: true,
        message: 'Expense updated successfully',
        data: expense
    });
});

// @desc    Delete an expense
// @route   DELETE /api/v1/expense/:id
// @access  Private
exports.deleteExpense = asyncHandler(async (req, res) => {
    const { userId } = req.user;
    const selectedRv = await getSelectedRvByUserId(userId);
    
    if (!selectedRv) {
        throw new ApiError('Please select an RV first', 400);
    }

    const expense = await Expense.findOne({
        _id: req.params.id,
        rvId: selectedRv._id,
        user: userId
    });

    if (!expense) {
        throw new ApiError('Expense not found', 404);
    }

    // Use the utility function to delete the document and its associated files
    await deleteDocumentWithFiles(Expense, req.params.id);

    res.status(200).json({
        success: true,
        message: 'Expense deleted successfully',
        data: {}
    });
});