const MedicalRecord = require('../models/MedicalRecord');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

// @desc    Search patient by Health ID
// @route   POST /api/records/search
exports.searchPatient = async (req, res) => {
    const { healthId } = req.body;
    try {
        const patient = await User.findOne({ healthId }).select('-password');
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        res.json(patient);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add a medical record
// @route   POST /api/records/add
exports.addRecord = async (req, res) => {
    try {
        const { healthId, diagnosis, medicines, notes } = req.body;

        const patient = await User.findOne({ healthId });
        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        const doctor = await Doctor.findById(req.user.id);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        const newRecord = new MedicalRecord({
            patientId: patient._id,
            doctorId: doctor._id,
            doctorName: doctor.name,
            hospital: doctor.hospital,
            diagnosis,
            medicines, // Array of structured objects
            notes
        });

        await newRecord.save();
        res.status(201).json({ message: 'Record added successfully', record: newRecord });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get patient medical history
// @route   GET /api/records/history
exports.getPatientHistory = async (req, res) => {
    try {
        let query = {};

        if (req.user.role === 'patient') {
            query = { patientId: req.user.id };
        } else if (req.user.role === 'doctor') {
            const { healthId } = req.query;
            if (!healthId) return res.status(400).json({ message: 'Health ID required' });

            const patient = await User.findOne({ healthId });
            if (!patient) return res.status(404).json({ message: 'Patient not found' });

            query = { patientId: patient._id };
        } else {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const records = await MedicalRecord.find(query).sort({ visitDate: -1 });
        res.json(records);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
