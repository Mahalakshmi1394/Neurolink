const mongoose = require('mongoose');

const neurologicalRiskSchema = new mongoose.Schema({
    patientHealthId: { type: String, required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    riskScore: { type: Number, required: true }, // 0.0 to 1.0
    riskLevel: { type: String, required: true, enum: ['Low', 'Moderate', 'High', 'Critical'] },
    factors: [{ type: String }], // List of contributing factors
    generatedDate: { type: Date, default: Date.now },
    modelUsed: { type: String, default: 'NeuroRisk-v1' },
    source: { type: String, enum: ['Patient', 'Doctor'], default: 'Doctor' },
    isReviewed: { type: Boolean, default: false },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    reviewNotes: { type: String }
});

module.exports = mongoose.model('NeurologicalRiskAssessment', neurologicalRiskSchema);
