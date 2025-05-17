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
const upload = require('../utils/uploadConfig');



router.post('/add-insurance', authenticate, upload.array('pictures', 5),  addInsurance);
router.get('/get-all-insurances', authenticate, getInsurances);
router.get('/get-insurance/:id', authenticate, getInsurance);
router.put('/update-insurance/:id', authenticate, updateInsurance);
router.delete('/delete-insurance/:id', authenticate, deleteInsurance);


module.exports = router;