// const express = require('express');
// const router = express.Router();
// const { 
//     createChecklist,
//     getAllChecklists,
//     getChecklist,
//     updateChecklist,
//     deleteChecklist,
//     addItem,
//     updateItem,
//     deleteItem
// } = require('./checklist.controller');
// const { authenticateUser } = require('../../middleware/auth.middleware');

// // Checklist routes
// router.route('/')
//     .post(authenticateUser, createChecklist)
//     .get(authenticateUser, getAllChecklists);

// router.route('/:id')
//     .get(authenticateUser, getChecklist)
//     .put(authenticateUser, updateChecklist)
//     .post(authenticateUser, deleteChecklist);

// // Checklist item routes
// router.route('/:checklistId/items')
//     .post(authenticateUser, addItem);

// router.route('/:checklistId/items/:itemId')
//     .put(authenticateUser, updateItem)
//     .post(authenticateUser, deleteItem);

// module.exports = router;

const express = require('express');
const router = express.Router();
const { 
    createChecklist,
    getAllChecklists,
    getChecklist,
    updateChecklist,
    deleteChecklist,
    bulkUpdateItems
} = require('./checklist.controller');
const { authenticateUser } = require('../../middleware/auth.middleware');

// Checklist routes
router.route('/')
    .post(authenticateUser, createChecklist)
    .get(authenticateUser, getAllChecklists);

router.route('/:id')
    .get(authenticateUser, getChecklist)
    .patch(authenticateUser, updateChecklist)  // Changed to PATCH
    .post(authenticateUser, deleteChecklist);

// Bulk items operations
router.route('/:id/items')
    .patch(authenticateUser, bulkUpdateItems);  // PATCH for items operations

module.exports = router;