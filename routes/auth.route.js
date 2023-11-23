const router = require('express').Router();
const { loginAdmin } = require('../controllers/auth.controller');

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.post('/admin/login', loginAdmin);

module.exports = router;
