const router = require('express').Router();
const {} = require('../controllers/auth.controller');

router.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = router;
