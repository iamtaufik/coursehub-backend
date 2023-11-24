const router = require('express').Router();
const { loginAdmin, register, loginUser, verifyOTP, authenticate, createAdmin } = require('../controllers/auth.controller');
const verifyToken = require('../libs/verifyToken');

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.post('/login', loginUser);
router.post('/register', register);
router.post('/verifyOTP', verifyOTP);
router.post('/admin/login', loginAdmin);
router.post('/admin/register', createAdmin);
router.get('/whoami', verifyToken, authenticate);

module.exports = router;
