const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const {
    addChassis,
    getChassis,
    getChassisById,
    updateChassis,
    deleteChassis
} = require('../controllers/chessis.controller');

// Routes
router.post('/add', authenticate, addChassis);
router.get('/', authenticate, getChassis);
router.get('/:id', authenticate, getChassisById);
router.put('/update/:id', authenticate, updateChassis);
router.delete('/delete/:id', authenticate, deleteChassis);

module.exports = router;