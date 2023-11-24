const router = require('express').Router();
const { loginAdmin, register, loginUser } = require('../controllers/auth.controller');

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.post('/login', loginUser);
router.post('/register', register);
router.post('/admin/login', loginAdmin);

module.exports = router;
