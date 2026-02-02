const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const doctorOnly = require('../middleware/roleMiddleware');
const { searchPatient, addRecord, getPatientHistory } = require('../controllers/recordController');

router.post('/search', auth, doctorOnly, searchPatient);
router.post('/add', auth, doctorOnly, addRecord);
router.get('/history', auth, getPatientHistory);

module.exports = router;
