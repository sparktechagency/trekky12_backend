const express = require('express');
const router = express.Router();
const { addMembership, updateMembership } = require('../controllers/membership.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const upload = require('../utils/uploadConfig');
// Route to add a new membership

router.post('/add-membership', authenticate, upload.single('picture'), addMembership);
router.patch('/update-membership/:id', authenticate, upload.single('picture'), updateMembership);


module.exports = router;