const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middlewares/auth.middleware');
const upload = require('../../utils/uploadConfig');
const {
    addTire,
    getTires,
    getTireById,
    updateTire,
    deleteTire
} = require('../../controllers/appliance.controller/tire.controller');

router.post('/add', authenticate, upload.array('picture', 5), addTire);
router.get('/', authenticate, getTires);
router.get('/:id', authenticate, getTireById);
router.put('/update/:id', authenticate, updateTire);
router.delete('/delete/:id', authenticate, deleteTire);

module.exports = router;
