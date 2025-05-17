const express = require('express');
const router = express.Router();
const { addRepair, updateRepair, getRepair, deleteRepair } = require('../controllers/repair.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// Route to add a new repair
router.post('/', authenticate, addRepair);

// Route to update an existing repair
router.put('/:id', authenticate, updateRepair);

// Route to get a specific repair by ID
router.get('/:id', authenticate, getRepair);

// Route to delete a repair
router.delete('/:id', authenticate, deleteRepair);

module.exports = router;