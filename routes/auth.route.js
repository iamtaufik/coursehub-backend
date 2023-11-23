const router = require('express').Router();
const { register } = require('../controllers/auth.controller');

router.get('/', (req, res) => {
  res.send('Hello World!');
});

// register
router.post('/register', register);

module.exports = router;
