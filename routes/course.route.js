const router = require('express').Router();
const { createCourse, getCourses, getDetailCourses } = require('../controllers/course.controller');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.post('/', verifyToken, verifyAdmin, createCourse);
router.get('/', getCourses);
router.get('/:id', getDetailCourses);

module.exports = router;
