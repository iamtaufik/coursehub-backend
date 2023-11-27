const router = require('express').Router();
const { createCourse } = require('../controllers/course.controller');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.post('/', verifyToken, verifyAdmin, createCourse);

module.exports = router;
