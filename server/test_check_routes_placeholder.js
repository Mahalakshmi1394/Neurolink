const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = 'http://localhost:5000';

const runTest = async () => {
    try {
        console.log('1. Registering a new doctor...');
        const randomStr = Math.random().toString(36).substring(7);
        const doctorData = {
            name: `Dr. Test ${randomStr}`,
            specialization: 'Neurology',
            hospital: 'Test Hospital',
            registrationId: `REG-${randomStr}`,
            email: `dr${randomStr}@test.com`,
            password: 'password123',
            role: 'doctor' // registerDoctor doesn't strictly need this but good to have context
        };

        // Note: registerDoctor route might be /api/auth/register-doctor or similar. 
        // I need to check authRoutes.js to be sure. Assumed from standard patterns.
        // Let's check authRoutes first real quick, but I'll assume /api/auth/doctor/register based on common patterns or just /api/auth/register-doctor
        // ACTUALLY, I should check the routes.

        // Let's assume the path is /api/auth/doctor/signup or /api/auth/register-doctor.
        // I will check the file content of authRoutes.js before running this script.

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
};

// I will write the rest after checking routes.
console.log("Checking routes...");
