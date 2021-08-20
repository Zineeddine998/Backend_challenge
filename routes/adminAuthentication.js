const express = require('express');
const { login,
    register,
    logout,
    forgotPassword,
    resetPassword } = require('../controllers/adminAuthentication');
const { protectRoute } = require('../middleware/authentication');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.route('/logout').post(protectRoute, logout);
router.put('/resetpassword/:resettoken', resetPassword);
router.post('/forgotpassword', forgotPassword);

module.exports = router;