const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const {
    addInsurance,
    updateInsurance,
    getInsurances,
    getInsurance,
    deleteInsurance
} = require('../controllers/insurance.controller');

router.route('/')
    .post(authenticate, addInsurance)
    .get(authenticate, getInsurances);

router.route('/:id')
    .get(authenticate, getInsurance)
    .put(authenticate, updateInsurance)
    .delete(authenticate, deleteInsurance);

module.exports = router;