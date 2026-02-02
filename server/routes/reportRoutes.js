const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const doctorOnly = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { uploadReport, getReports } = require('../controllers/reportController');

router.post('/upload', auth, doctorOnly, upload.single('file'), uploadReport);
router.get('/', auth, getReports);

module.exports = router;
