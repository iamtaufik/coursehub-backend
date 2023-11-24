const router = require('express').Router();
const { loginAdmin, register, loginUser, authenticate } = require('../controllers/auth.controller');
const {restrict} = require('../middlewares/auth.middlewares');

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.post('/admin/login', loginAdmin);
router.post('/register', register);
router.post('/login', loginUser);
router.get('/whoami', restrict, authenticate);

module.exports = router;
