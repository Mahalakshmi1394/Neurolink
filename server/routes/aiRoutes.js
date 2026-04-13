const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');
const aiController = require('../controllers/aiController');

// Route: POST /api/ai/brain-tumor/analyze
// Protected: Only doctors
router.post('/brain-tumor/analyze', authMiddleware, roleMiddleware, upload.single('file'), aiController.analyzeBrainTumor);

// Route: GET /api/ai/brain-tumor/history
router.get('/brain-tumor/history', authMiddleware, aiController.getBrainTumorHistory);

// Route: POST /api/ai/neuro-risk/predict
router.post('/neuro-risk/predict', authMiddleware, roleMiddleware, aiController.predictNeurologicalRisk);

// Route: GET /api/ai/neuro-risk/history
router.get('/neuro-risk/history', authMiddleware, aiController.getNeurologicalRiskHistory);

// Route: POST /api/ai/patient/preventive-check
router.post('/patient/preventive-check', authMiddleware, aiController.patientPreventiveCheck);

module.exports = router;
