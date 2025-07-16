const express = require('express');

const router = express.Router();

const { createReport, getReport, getReportById, updateReport, deleteReport, addFavoriteReport, removeFavoriteReport } = require('./reports.controller');
const upload = require('../../../utils/uploadConfig');
const { authenticateUser } = require('../../middleware/auth.middleware');

router.post('/create',authenticateUser, upload.array('images'), createReport);
router.get('/get', authenticateUser, getReport);
router.get('/get/:id', authenticateUser, getReportById);
router.put('/update/:id', authenticateUser, upload.array('images'), updateReport);
router.delete('/delete/:id', authenticateUser, deleteReport); 
//favorite the report
router.post('/addFavorite/:id', authenticateUser, addFavoriteReport);
router.delete('/removeFavorite/:id', authenticateUser, removeFavoriteReport);  

module.exports = router;
