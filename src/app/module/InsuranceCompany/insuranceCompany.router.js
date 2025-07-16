const express = require('express');
const router = express.Router();

const { createInsuranceCompany, getInsuranceCompany, getInsuranceCompanyById, updateInsurance, deleteInsurance } = require('./insuranceCompany.controller');
const upload = require('../../../utils/uploadConfig');
const { authenticateUser } = require('../../middleware/auth.middleware');

router.post('/create',authenticateUser, upload.array('images'), createInsuranceCompany);
router.get('/get', authenticateUser, getInsuranceCompany);
router.get('/get/:id', authenticateUser, getInsuranceCompanyById);
router.put('/update/:id', authenticateUser, upload.array('images'), updateInsurance);
router.delete('/delete/:id', authenticateUser, deleteInsurance);

module.exports = router;
