const express =  require('express');
const router = express.Router();
const { createInternetSatellite, getInternetSatellite, getInternetSatelliteById, updateInternetSatellite, deleteInternetSatellite } = require('./internetSatellite.controller');
const upload = require('../../../utils/uploadConfig');
const { authenticateUser } = require('../../middleware/auth.middleware');

router.post('/create', authenticateUser, upload.array('images'), createInternetSatellite );
router.get('/get', authenticateUser, getInternetSatellite);
router.get('/get/:id', authenticateUser, getInternetSatelliteById);
router.put('/update/:id', authenticateUser, upload.array('images'), updateInternetSatellite);
router.delete('/delete/:id', authenticateUser, deleteInternetSatellite);

module.exports = router;
