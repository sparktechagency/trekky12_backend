const express = require('express');
const router = express.Router();
const insuranceController = require('../controllers/insurance.controller');
const upload = require('../middleware/upload');

// const auth = require('../middleware/auth'); // Uncomment if you have auth middleware

// router.use(auth); // Uncomment to protect all routes

router.post('/', upload.array('documents'), insuranceController.createInsurance);
router.get('/', insuranceController.getInsurances);
router.get('/:id', insuranceController.getInsurance);
router.put('/:id', upload.array('documents'), insuranceController.updateInsurance);
router.delete('/:id', insuranceController.deleteInsurance);

module.exports = router;
