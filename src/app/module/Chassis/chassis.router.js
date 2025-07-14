const express = require('express');
const { createChassis, getChassis, getChassisById, updateChassis, deleteChassis } = require('./chassis.controller');
const router = express.Router();

router.post('/add-chassis', createChassis);
router.get('/get-chassis', getChassis);
router.get('/get-chassis/:id', getChassisById);
router.put('/update-chassis/:id', updateChassis);
router.delete('/delete-chassis/:id', deleteChassis);

module.exports = router;
