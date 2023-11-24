const router = require('express').Router();
const { loginUser } = require('../controllers/auth.controller');

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.post('/login', loginUser);

module.exports = router;
