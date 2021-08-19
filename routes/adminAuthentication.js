const express = require('express');
const { login, register, logout, forgotPassword, resetPassword } = require('../controllers/adminAuthentication');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/resetpassword/:resettoken', resetPassword);
router.post('/forgotpassword', forgotPassword);

module.exports = router;