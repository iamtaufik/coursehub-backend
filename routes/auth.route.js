const router = require('express').Router();
const { loginAdmin, register, loginUser, verifyOTP, authenticate, createAdmin } = require('../controllers/auth.controller');
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
router.get('/admin/whoami', verifyToken, verifyAdmin, authenticate);

module.exports = router;
