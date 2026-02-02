const express = require('express');
const router = express.Router();
const { registerUser, registerDoctor, loginUser } = require('../controllers/authController');

router.post('/register/user', registerUser);
router.post('/register/doctor', registerDoctor);
router.post('/login', loginUser);

module.exports = router;
