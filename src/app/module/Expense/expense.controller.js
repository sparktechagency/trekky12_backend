const Expense = require('./Expense');
const asyncHandler = require('../../../utils/asyncHandler');
const { ApiError } = require('../../../errors/errorHandler');
const deleteDocumentWithFiles = require('../../../utils/deleteDocumentWithImages');

exports.createExpense = asyncHandler(async (req, res) => {
    const expense = await Expense.create(req.body);
    if (!expense) throw new ApiError('Expense not created', 500);

     if (!images) throw new ApiError('No images uploaded', 400);

    if (images && images.length > 0) {
        const imagePaths = images.map(image => image.path);
        expense.images = imagePaths;
        await expense.save();
    }

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
    Object.keys(req.body).forEach(key => {
        expense[key] = req.body[key];
    });

    await expense.save();


    if (req.files && req.files.length > 0) {
        const oldImages = expense.images;

        // Delete old images from disk
        oldImages.forEach(image => {
            const path = image.split('/').pop();
            try {
                fs.unlinkSync(`${uploadPath}/${path}`);
            } catch (err) {
                if (err.code !== 'ENOENT') {
                    console.error(err);
                }
            }
        });

        // Set only new images
        const newImages = req.files.map(image => image.path.replace('upload/', ''));
        expense.images = newImages;
    }
    // if (req.files && req.files.length > 0) {
    //     const oldImages = expense.images;
    //     const newImages = req.files.map(image => image.path);
    //     expense.images = [...oldImages, ...newImages];
    //     await expense.save();
    // } else {
    //     await expense.updateOne(req.body);
    // }

    return res.status(200).json({
        success: true,
        message: 'Expense updated successfully',
        expense
    });
});


// exports.deleteExpense = asyncHandler(async (req, res) => {
//     const expense = await Expense.findByIdAndDelete(req.params.id);
//     if (!expense) throw new ApiError('Expense not found', 404);
//     return res.status(200).json({
//         success: true,
//         message: 'Expense deleted successfully',
//         expense
//     });
// });

exports.deleteExpense = asyncHandler(async (req, res) => {
    const expense = await deleteDocumentWithFiles(Expense, req.params.id, "uploads");
    if (!expense) throw new ApiError("expense not found", 404);

    return res.status(200).json({
        success: true,
        message: "expense deleted successfully (with images)",
        expense,
    });
});