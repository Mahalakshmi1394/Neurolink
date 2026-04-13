const mongoose = require('mongoose');

const brainTumorSchema = new mongoose.Schema({
    patientHealthId: { type: String, required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    scanFilePath: { type: String, required: true },
    tumorType: { type: String, required: true },
    confidence: { type: Number, required: true },
    grade: { type: String },
    severity: { type: String },
    interpretation: { type: String },
    nextSteps: { type: [String] },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BrainTumorResult', brainTumorSchema);
