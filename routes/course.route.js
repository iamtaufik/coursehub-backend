const router = require('express').Router();
const { createCourse, getCourses} = require('../controllers/course.controller');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.post('/', verifyToken, verifyAdmin, createCourse);
router.get('/', getCourses);

module.exports = router;
