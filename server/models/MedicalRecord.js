const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    doctorName: { type: String, required: true },
    hospital: { type: String, required: true },
    diagnosis: { type: String, required: true },
    medicines: [{
        name: { type: String, required: true },
        dosage: { type: String, required: true }, // e.g., "500 mg"
        frequency: { type: String, required: true }, // e.g., "2 times/day"
        duration: { type: String, required: true }, // e.g., "5 days"
        system: { type: String, required: true, enum: ['Allopathy', 'Ayurveda', 'Siddha'] },
        therapeuticClass: { type: String },
        arushCode: { type: String },
        ayurvedaEquivalent: { type: String }
    }],
    notes: { type: String },
    visitDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
