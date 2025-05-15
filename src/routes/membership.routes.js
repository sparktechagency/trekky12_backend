const express = require('express');
const router = express.Router();
const { addMembership } = require('../controllers/membership.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const upload = require('../utils/uploadConfig');
// Route to add a new membership

router.post('/add-membership', authenticate, upload.single('picture'), addMembership);


module.exports = router;