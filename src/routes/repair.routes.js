const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const {
    addRepair,
    updateRepair,
    getRepairs,
    getRepair,
    deleteRepair
} = require('../controllers/repair.controller');

// Routes
router.post('/add', authenticate, addRepair);
router.put('/update/:id', authenticate, updateRepair);
router.get('/', authenticate, getRepairs);
router.get('/:id', authenticate, getRepair);
router.delete('delete/:id', authenticate, deleteRepair);

module.exports = router;