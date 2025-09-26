// const Checklist = require("./Checklist");
// const asyncHandler = require("../../../utils/asyncHandler");
// const { ApiError } = require("../../../errors/errorHandler");
// const getSelectedRvByUserId = require("../../../utils/currentRv");
// const deleteDocumentWithFiles = require("../../../utils/deleteDocumentWithImages");
// const checkValidRv = require("../../../utils/checkValidRv");
// const QueryBuilder = require("../../../builder/queryBuilder");
// const deleteS3Objects = require("../../../utils/deleteS3ObjectsImage");

// // @desc    Create a new checklist
// // @route   POST /api/v1/checklists
// // @access  Private
// exports.createChecklist = asyncHandler(async (req, res) => {
//     const userId = req.user.id || req.user._id;
//     const { title, rvId } = req.body;

//     const selectedRvId = await getSelectedRvByUserId(userId);
//     const targetRvId = rvId || selectedRvId;
    
//     if (!targetRvId) {
//         throw new ApiError("No RV selected. Please select an RV first.", 400);
//     }

//     const checklist = await Checklist.create({ 
//         title,
//         rvId: targetRvId,
//         user: userId,
//         items: []
//     });

//     res.status(201).json({
//         success: true,
//         message: 'Checklist created successfully',
//         data: checklist
//     });
// });

// // @desc    Get all checklists for the current RV
// // @route   GET /api/v1/checklists
// // @access  Private
// exports.getAllChecklists = asyncHandler(async (req, res) => {
//     const userId = req.user.id || req.user._id;
//     const selectedRvId = await getSelectedRvByUserId(userId);
    
//     if (!selectedRvId) {
//         throw new ApiError("No RV selected. Please select an RV first.", 400);
//     }

//     const checklists = await Checklist.find({ 
//         user: userId,
//         rvId: selectedRvId
//     }).sort({ createdAt: -1 });

//     res.status(200).json({
//         success: true,
//         count: checklists.length,
//         data: checklists
//     });
// });

// // @desc    Get single checklist
// // @route   GET /api/v1/checklists/:id
// // @access  Private
// exports.getChecklist = asyncHandler(async (req, res) => {
//     const userId = req.user.id || req.user._id;
//     const checklist = await Checklist.findOne({
//         _id: req.params.id,
//         user: userId
//     });

//     if (!checklist) {
//         throw new ApiError('Checklist not found', 404);
//     }

//     res.status(200).json({
//         success: true,
//         data: checklist
//     });
// });

// // @desc    Update checklist title
// // @route   PUT /api/v1/checklists/:id
// // @access  Private
// exports.updateChecklist = asyncHandler(async (req, res) => {
//     const userId = req.user.id || req.user._id;
//     const { title } = req.body;

//     const checklist = await Checklist.findOneAndUpdate(
//         { _id: req.params.id, user: userId },
//         { title },
//         { new: true, runValidators: true }
//     );

//     if (!checklist) {
//         throw new ApiError('Checklist not found', 404);
//     }

//     res.status(200).json({
//         success: true,
//         message: 'Checklist updated successfully',
//         data: checklist
//     });
// });

// // @desc    Delete checklist
// // @route   DELETE /api/v1/checklists/:id
// // @access  Private
// exports.deleteChecklist = asyncHandler(async (req, res) => {
//     const userId = req.user.id || req.user._id;
    
//     const checklist = await Checklist.findOneAndDelete({
//         _id: req.params.id,
//         user: userId
//     });

//     if (!checklist) {
//         throw new ApiError('Checklist not found', 404);
//     }

//     res.status(200).json({
//         success: true,
//         message: 'Checklist deleted successfully',
//         data: {}
//     });
// });

// // @desc    Add item to checklist
// // @route   POST /api/v1/checklists/:checklistId/items
// // @access  Private
// exports.addItem = asyncHandler(async (req, res) => {
//     const userId = req.user.id || req.user._id;
//     const { name } = req.body;

//     const checklist = await Checklist.findOne({
//         _id: req.params.checklistId,
//         user: userId
//     });

//     if (!checklist) {
//         throw new ApiError('Checklist not found', 404);
//     }

//     checklist.items.push({ name });
//     await checklist.save();

//     const newItem = checklist.items[checklist.items.length - 1];

//     res.status(201).json({
//         success: true,
//         message: 'Item added successfully',
//         data: newItem
//     });
// });

// // @desc    Update checklist item
// // @route   PUT /api/v1/checklists/:checklistId/items/:itemId
// // @access  Private
// exports.updateItem = asyncHandler(async (req, res) => {
//     const userId = req.user.id || req.user._id;
//     const { name, status } = req.body;

//     const checklist = await Checklist.findOne({
//         _id: req.params.checklistId,
//         user: userId
//     });

//     if (!checklist) {
//         throw new ApiError('Checklist not found', 404);
//     }

//     const itemIndex = checklist.items.findIndex(
//         item => item._id.toString() === req.params.itemId
//     );

//     if (itemIndex === -1) {
//         throw new ApiError('Item not found', 404);
//     }

//     if (name !== undefined) checklist.items[itemIndex].name = name;
//     if (status !== undefined) checklist.items[itemIndex].status = status;

//     await checklist.save();

//     res.status(200).json({
//         success: true,
//         message: 'Item updated successfully',
//         data: checklist.items[itemIndex]
//     });
// });

// // @desc    Delete checklist item
// // @route   DELETE /api/v1/checklists/:checklistId/items/:itemId
// // @access  Private
// exports.deleteItem = asyncHandler(async (req, res) => {
//     const userId = req.user.id || req.user._id;

//     const checklist = await Checklist.findOne({
//         _id: req.params.checklistId,
//         user: userId
//     });

//     if (!checklist) {
//         throw new ApiError('Checklist not found', 404);
//     }

//     const itemIndex = checklist.items.findIndex(
//         item => item._id.toString() === req.params.itemId
//     );

//     if (itemIndex === -1) {
//         throw new ApiError('Item not found', 404);
//     }

//     checklist.items.splice(itemIndex, 1);
//     await checklist.save();

//     res.status(200).json({
//         success: true,
//         message: 'Item deleted successfully',
//         data: {}
//     });
// });


const Checklist = require("./Checklist");
const asyncHandler = require("../../../utils/asyncHandler");
const { ApiError } = require("../../../errors/errorHandler");
const getSelectedRvByUserId = require("../../../utils/currentRv");

// @desc    Create a new checklist
// @route   POST /api/v1/checklists
// @access  Private
exports.createChecklist = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { title, rvId, items } = req.body;

    const selectedRvId = await getSelectedRvByUserId(userId);
    const targetRvId = rvId || selectedRvId;
    
    if (!targetRvId) {
        throw new ApiError("No RV selected. Please select an RV first.", 400);
    }

    const checklist = await Checklist.create({ 
        title,
        rvId: targetRvId,
        user: userId,
        items: items || []
    });

    res.status(201).json({
        success: true,
        message: 'Checklist created successfully',
        data: checklist
    });
});

// @desc    Get all checklists for the current RV
// @route   GET /api/v1/checklists
// @access  Private
exports.getAllChecklists = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const selectedRvId = await getSelectedRvByUserId(userId);
    
    if (!selectedRvId) {
        throw new ApiError("No RV selected. Please select an RV first.", 400);
    }

    const checklists = await Checklist.find({ 
        user: userId,
        rvId: selectedRvId
    }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: checklists.length,
        data: checklists
    });
});

// @desc    Get single checklist
// @route   GET /api/v1/checklists/:id
// @access  Private
exports.getChecklist = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const checklist = await Checklist.findOne({
        _id: req.params.id,
        user: userId
    });

    if (!checklist) {
        throw new ApiError('Checklist not found', 404);
    }

    res.status(200).json({
        success: true,
        data: checklist
    });
});

// @desc    Update checklist (title or items)
// @route   PATCH /api/v1/checklists/:id
// @access  Private
exports.updateChecklist = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { title, items, itemOperations } = req.body;

    const checklist = await Checklist.findOne({
        _id: req.params.id,
        user: userId
    });

    if (!checklist) {
        throw new ApiError('Checklist not found', 404);
    }

    // Update title if provided
    if (title !== undefined) {
        checklist.title = title;
    }

    // Replace entire items array if provided
    if (items !== undefined) {
        checklist.items = items;
    }

    // Handle individual item operations (add, update, remove)
    if (itemOperations && Array.isArray(itemOperations)) {
        itemOperations.forEach(operation => {
            switch (operation.action) {
                case 'add':
                    if (operation.item) {
                        checklist.items.push(operation.item);
                    }
                    break;
                    
                case 'update':
                    if (operation.itemId && operation.updates) {
                        const itemIndex = checklist.items.findIndex(
                            item => item._id.toString() === operation.itemId
                        );
                        if (itemIndex !== -1) {
                            Object.assign(checklist.items[itemIndex], operation.updates);
                        }
                    }
                    break;
                    
                case 'remove':
                    if (operation.itemId) {
                        checklist.items = checklist.items.filter(
                            item => item._id.toString() !== operation.itemId
                        );
                    }
                    break;
                    
                case 'reorder':
                    if (operation.itemIds && Array.isArray(operation.itemIds)) {
                        // Create a map for quick lookup
                        const itemMap = new Map();
                        checklist.items.forEach(item => {
                            itemMap.set(item._id.toString(), item);
                        });
                        
                        // Reorder items based on the provided array of IDs
                        checklist.items = operation.itemIds.map(id => itemMap.get(id)).filter(Boolean);
                    }
                    break;
            }
        });
    }

    await checklist.save();

    res.status(200).json({
        success: true,
        message: 'Checklist updated successfully',
        data: checklist
    });
});

// @desc    Delete checklist
// @route   DELETE /api/v1/checklists/:id
// @access  Private
exports.deleteChecklist = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    
    const checklist = await Checklist.findOneAndDelete({
        _id: req.params.id,
        user: userId
    });

    if (!checklist) {
        throw new ApiError('Checklist not found', 404);
    }

    res.status(200).json({
        success: true,
        message: 'Checklist deleted successfully',
        data: {}
    });
});

// @desc    Bulk update checklist items
// @route   PATCH /api/v1/checklists/:id/items
// @access  Private
exports.bulkUpdateItems = asyncHandler(async (req, res) => {
    const userId = req.user.id || req.user._id;
    const { items, operations } = req.body;

    const checklist = await Checklist.findOne({
        _id: req.params.id,
        user: userId
    });

    if (!checklist) {
        throw new ApiError('Checklist not found', 404);
    }

    // Replace entire items array if provided
    if (items !== undefined) {
        checklist.items = items;
    }

    // Handle individual operations if provided
    if (operations && Array.isArray(operations)) {
        operations.forEach(operation => {
            switch (operation.action) {
                case 'add':
                    if (operation.item) {
                        checklist.items.push(operation.item);
                    }
                    break;
                    
                case 'update':
                    if (operation.itemId && operation.updates) {
                        const itemIndex = checklist.items.findIndex(
                            item => item._id.toString() === operation.itemId
                        );
                        if (itemIndex !== -1) {
                            Object.assign(checklist.items[itemIndex], operation.updates);
                        }
                    }
                    break;
                    
                case 'remove':
                    if (operation.itemId) {
                        checklist.items = checklist.items.filter(
                            item => item._id.toString() !== operation.itemId
                        );
                    }
                    break;
                    
                case 'reorder':
                    if (operation.itemIds && Array.isArray(operation.itemIds)) {
                        const itemMap = new Map();
                        checklist.items.forEach(item => {
                            itemMap.set(item._id.toString(), item);
                        });
                        
                        checklist.items = operation.itemIds.map(id => itemMap.get(id)).filter(Boolean);
                    }
                    break;
            }
        });
    }

    await checklist.save();

    res.status(200).json({
        success: true,
        message: 'Items updated successfully',
        data: checklist.items
    });
});