const Report = require('../models/Report');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

exports.uploadReport = async (req, res) => {
    try {
        const { healthId, reportType } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ message: 'No file uploaded' });

        const patient = await User.findOne({ healthId });
        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        const doctor = await Doctor.findById(req.user.id);

        const newReport = new Report({
            patientId: patient._id,
            doctorId: doctor._id,
            doctorName: doctor.name,
            reportType,
            fileName: file.filename,
            filePath: file.path
        });

        await newReport.save();
        res.status(201).json({ message: 'Report uploaded successfully', report: newReport });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getReports = async (req, res) => {
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
        }

        const reports = await Report.find(query).sort({ uploadDate: -1 });
        res.json(reports);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
