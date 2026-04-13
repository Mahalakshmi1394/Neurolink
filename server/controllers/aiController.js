const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const BrainTumorResult = require('../models/BrainTumorAnalysis');
const NeurologicalRiskAssessment = require('../models/NeurologicalRiskAssessment');
const User = require('../models/User');
const MedicalRecord = require('../models/MedicalRecord');

exports.analyzeBrainTumor = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 'error', message: 'No MRI scan uploaded' });
        }

        const { patientHealthId } = req.body;
        if (!patientHealthId) {
            // Clean up file if validation fails
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ status: 'error', message: 'Patient Health ID is required' });
        }

        // Prepare to send to Python AI Service
        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path));

        const aiServiceUrl = 'http://127.0.0.1:5001/predict-brain-tumor';

        try {
            const aiResponse = await axios.post(aiServiceUrl, formData, {
                headers: {
                    ...formData.getHeaders(),
                },
            });

            const { tumorType, confidence, grade, severity, interpretation, nextSteps } = aiResponse.data.result;

            // Save result to MongoDB
            const newAnalysis = new BrainTumorResult({
                patientHealthId,
                doctorId: req.user.id, // Assumes authMiddleware attaches user
                scanFilePath: req.file.path, // Store the local path for now (or cloud URL later)
                tumorType,
                confidence,
                grade,
                severity,
                interpretation,
                nextSteps
            });

            await newAnalysis.save();

            res.json({
                status: 'success',
                data: newAnalysis,
            });

        } catch (aiError) {
            console.error('AI Service Error:', aiError.message);
            res.status(500).json({ status: 'error', message: 'AI Service failed' });
        }

    } catch (error) {
        console.error('Server Error:', error.message);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

exports.getBrainTumorHistory = async (req, res) => {
    try {
        const { healthId } = req.query;
        if (!healthId) {
            return res.status(400).json({ message: 'Health ID required' });
        }

        const history = await BrainTumorResult.find({ patientHealthId: healthId }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.predictNeurologicalRisk = async (req, res) => {
    try {
        const { healthId, bp, sugar } = req.body;

        if (!healthId) {
            return res.status(400).json({ message: 'Patient Health ID required' });
        }

        // 1. Fetch Patient Data
        const user = await User.findOne({ healthId });
        if (!user) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // 2. Fetch Medical History from this doctor's records (or all records if centralized)
        // Ideally fetch all records for this patient
        const records = await MedicalRecord.find({ patientId: user._id });
        const diagnoses = records.map(r => r.diagnosis);
        const medicines = records.flatMap(r => r.medicines.map(m => m.name));

        // 3. Check for Brain Tumor History
        const tumorHistory = await BrainTumorResult.findOne({ patientHealthId: healthId, tumorType: { $ne: 'No Tumor' } });

        // 4. Prepare Payload for AI Service (Module 2)
        const aiPayload = {
            age: user.age,
            gender: user.gender,
            history: diagnoses,
            medicines: medicines,
            brainTumorHistory: !!tumorHistory,
            // Add manual inputs if provided
            manual_bp: bp,
            manual_sugar: sugar
        };

        // 5. Call AI Service
        try {
            const aiServiceUrl = 'http://127.0.0.1:5002/predict-neurological-risk';
            const aiResponse = await axios.post(aiServiceUrl, aiPayload);

            // Check if result exists before destructuring
            if (!aiResponse.data || !aiResponse.data.result) {
                throw new Error("Invalid response from AI Service");
            }

            const { riskScore, riskLevel, factors } = aiResponse.data.result;

            // 6. Save Assessment
            const assessment = new NeurologicalRiskAssessment({
                patientHealthId: healthId,
                patientId: user._id,
                doctorId: req.user.id,
                riskScore,
                riskLevel,
                factors
            });
            await assessment.save();

            res.json({
                success: true,
                data: assessment
            });

        } catch (aiError) {
            console.error('Neuro AI Service Error:', aiError.message);
            // Fallback for Phase 1 Demo if Python service isn't reachable
            res.status(503).json({ message: 'Neurological Risk AI Service Unavailable' });
        }

    } catch (error) {
        console.error("Neuro Risk Prediction Error:", error.message);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.patientPreventiveCheck = async (req, res) => {
    try {
        const userId = req.user.id; // From authMiddleware
        const { bp, sugar, weight } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Fetch User's History
        const records = await MedicalRecord.find({ patientId: userId });
        const diagnoses = records.map(r => r.diagnosis);
        const medicines = records.flatMap(r => r.medicines.map(m => m.name));

        // Check Tumor History
        const tumorHistory = await BrainTumorResult.findOne({ patientHealthId: user.healthId, tumorType: { $ne: 'No Tumor' } });

        const aiPayload = {
            age: user.age,
            gender: user.gender,
            history: diagnoses,
            medicines: medicines,
            brainTumorHistory: !!tumorHistory,
            manual_bp: bp,
            manual_sugar: sugar,
            manual_weight: weight
        };

        try {
            const aiServiceUrl = 'http://127.0.0.1:5002/predict-neurological-risk';
            const aiResponse = await axios.post(aiServiceUrl, aiPayload);
            const { riskScore, riskLevel, factors } = aiResponse.data.result;

            // Simplified Output messages
            let recommendation = "";
            if (riskLevel === 'High') {
                recommendation = "Based on your inputs and history, there are indicators of elevated risk. We strongly recommend scheduling a consultation with a neurologist or your general physician for a detailed checkup.";
            } else if (riskLevel === 'Moderate') {
                recommendation = "Some risk factors were noted. Maintaining a healthy lifestyle and monitoring your vitals regularily is advised. Consider a routine checkup.";
            } else {
                recommendation = "Your neurological risk profile appears stable. Keep up the good habits!";
            }

            // Save for Patient History (Report)
            const assessment = new NeurologicalRiskAssessment({
                patientHealthId: user.healthId,
                patientId: userId,
                // No doctorId for self-check
                riskScore,
                riskLevel,
                factors,
                source: 'Patient'
            });
            await assessment.save();

            res.json({
                success: true,
                data: {
                    riskLevel,
                    recommendation,
                    // Filtered view for patient (no raw score)
                    factors
                }
            });

        } catch (aiError) {
            console.error('AI Service Error:', aiError.message);
            res.status(503).json({ message: 'Preventive AI Service Unavailable' });
        }

    } catch (error) {
        console.error("Patient Preventive Check Error:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getNeurologicalRiskHistory = async (req, res) => {
    try {
        const { healthId } = req.query;
        // If doctor calls this, they pass healthId. If patient calls, maybe they use their own token context?
        // Let's support both.

        let query = {};
        if (healthId) {
            query.patientHealthId = healthId;
        } else if (req.user && req.user.role === 'patient') {
            // If patient is logged in and no healthId param, use their own
            const user = await User.findById(req.user.id);
            if (user) query.patientHealthId = user.healthId;
        }

        if (!query.patientHealthId) {
            return res.status(400).json({ message: "Health ID required" });
        }

        const history = await NeurologicalRiskAssessment.find(query).sort({ generatedDate: -1 });
        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
