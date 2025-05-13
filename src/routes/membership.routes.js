const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membership.controller');
const auth = require('../middleware/auth'); // assuming you have authentication middleware

router.use(auth); // Protect all routes

router.post('/', membershipController.createMembership);
router.get('/', membershipController.getMemberships);
router.get('/:id', membershipController.getMembership);
router.put('/:id', membershipController.updateMembership);
router.delete('/:id', membershipController.deleteMembership);

module.exports = router;
