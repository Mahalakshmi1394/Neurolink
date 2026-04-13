const User = require('../models/User');
const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate Unique Health ID: NL-IND-XXXXX
const generateHealthId = async () => {
    let unique = false;
    let healthId = '';
    while (!unique) {
        const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
        healthId = `NL-IND-${randomPart}`;
        const existingUser = await User.findOne({ healthId });
        if (!existingUser) unique = true;
    }
    return healthId;
};

exports.registerUser = async (req, res) => {
    try {
        const { name, age, gender, phone, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const healthId = await generateHealthId();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            age,
            gender,
            phone,
            email,
            password: hashedPassword,
            healthId
        });

        await user.save();

        const token = jwt.sign({ id: user._id, role: 'patient' }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                healthId: user.healthId,
                role: 'patient'
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.registerDoctor = async (req, res) => {
    try {
        const { name, specialization, hospital, registrationId, licenseId, email, password } = req.body;

        let doctor = await Doctor.findOne({ email });
        if (doctor) return res.status(400).json({ message: 'Doctor already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        doctor = new Doctor({
            name,
            specialization,
            hospital,
            registrationId,
            licenseId,
            email,
            password: hashedPassword,
            isApproved: false // Requires admin approval logic if needed, or default true for demo
        });

        await doctor.save();

        const token = jwt.sign({ id: doctor._id, role: 'doctor' }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({
            token,
            doctor: {
                id: doctor._id,
                name: doctor.name,
                role: 'doctor'
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password, role } = req.body; // Expect role in body

    try {
        let user;
        if (role === 'patient') {
            user = await User.findOne({ email });
        } else if (role === 'doctor') {
            user = await Doctor.findOne({ email });
        } else {
            // Fallback or error
            return res.status(400).json({ message: 'Invalid role' });
        }

        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const payload = { id: user._id, role: role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ token, user: { id: user._id, name: user.name, role: role, healthId: user.healthId } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
