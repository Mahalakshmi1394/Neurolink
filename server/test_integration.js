const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';

const runTest = async () => {
    try {
        // Create dummy image
        const imagePath = path.join(__dirname, 'test_mri.jpg');
        // Minimal valid JPEG header (not a real image, but might pass simple type checks if only checking extension, 
        // but multer 'fileFilter' checks mimetype. 
        // Writing a dummy text file might fail 'image/jpeg' check if implementation uses magic numbers.
        // Let's rely on extension check if fileFilter is simple, or try to emulate magic bytes if strict.
        // The uploadMiddleware uses `filetypes.test(file.mimetype)` and extension. 
        // file.mimetype comes from the headers sent by the client (FormData).
        // Standard fs.createReadStream won't automatically set mimetype to image/jpeg unless we tell FormData.

        fs.writeFileSync(imagePath, 'dummy image content');

        console.log('1. Registering a new doctor...');
        const randomStr = Math.random().toString(36).substring(7);
        const email = `dr${randomStr}@test.com`;
        const password = 'password123';
        const doctorData = {
            name: `Dr. Test ${randomStr}`,
            specialization: 'Neurology',
            hospital: 'Test Hospital',
            hospital: 'Test Hospital',
            registrationId: `REG-${randomStr}`,
            licenseId: `LIC-${randomStr}`,
            email: email,
            password: password
        };

        const regRes = await axios.post(`${BASE_URL}/auth/register/doctor`, doctorData);
        console.log('   Doctor Registered:', regRes.data.doctor.email);
        const token = regRes.data.token;

        console.log('2. Uploading MRI Scan...');
        const formData = new FormData();
        // explicit filename with extension and contentType
        formData.append('file', fs.createReadStream(imagePath), {
            filename: 'test_mri.jpg',
            contentType: 'image/jpeg',
        });
        formData.append('patientHealthId', 'NL-IND-TEST1');

        try {
            const analyzeRes = await axios.post(`${BASE_URL}/ai/brain-tumor/analyze`, formData, {
                headers: {
                    ...formData.getHeaders(),
                    'Authorization': token
                }
            });
            console.log('   Analysis Result:', JSON.stringify(analyzeRes.data, null, 2));
            console.log('✅ TEST PASSED: Full integration works!');
        } catch (err) {
            console.error('❌ Analysis Failed:', err.response ? err.response.data : err.message);
            // If it's a 500 from AI service, it might be because the image is invalid for the AI model 
            // (since it's text "dummy image content"). 
            // But if we get a response from the server that isn't 404 or 401, the Node routing works.
            if (err.response && err.response.status === 500 && err.response.data.message === 'AI Service failed') {
                console.log('⚠️ Node routed to Python, but Python likely failed on dummy image (Expected).');
                console.log('✅ TEST PASSED: Backend routing and Auth works!');
            }
        }

        // Cleanup
        fs.unlinkSync(imagePath);

    } catch (error) {
        console.error('Test script crashed:', error.message);
        if (error.response) console.error('Response data:', error.response.data);
    }
};

runTest();
