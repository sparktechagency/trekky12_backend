const express = require('express');
const router = express.Router();

const { addRv, getRvs, getRv, updateRv, deleteRv } = require('./rv.controller');
const {authenticateUser} = require('../../middleware/auth.middleware');


router.post('/add-rv', authenticateUser, addRv);
router.get('/get-rvs', authenticateUser, getRvs);
router.get('/get-rv/:id', authenticateUser, getRv);
router.put('/update-rv/:id', authenticateUser, updateRv);
router.delete('/delete-rv/:id', authenticateUser, deleteRv);

module.exports = router;

