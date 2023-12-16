const router = require('express').Router();
const { loginAdmin, register, loginUser, verifyOTP, loginGoogle, authenticate, resendOTP, createAdmin, forgotPassword, resetPassword, changePassword } = require('../controllers/auth.controller');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.get('/', (req, res) => {
  res.send('Hello World! this is development branch');
});

router.post('/login', loginUser);
router.post('/register', register);
router.post('/verifyOTP', verifyOTP);
router.post('/admin/login', loginAdmin);
router.post('/admin/register', createAdmin);
router.get('/whoami', verifyToken, authenticate);
router.post('/forgotPassword', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/admin/whoami', verifyToken, verifyAdmin, authenticate);
router.put('/change-password', verifyToken, changePassword);
router.post('/resend-otp', resendOTP);

// Google OAuth
router.post('/google', loginGoogle);

module.exports = router;
