const express = require('express');
const router = express.Router();
const { addRV, getRVDetails, updateRV, deleteRV } = require('../controllers/rv.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const upload = require('../utils/uploadConfig');


router.post('/add-rv', authenticate, upload.array('documents', 5), addRV);
router.get('/:rvId', authenticate, getRVDetails);
router.put('/:rvId', authenticate, upload.array('documents', 5), updateRV);
router.delete('/:rvId', authenticate, deleteRV);

module.exports = router;