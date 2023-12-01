const router = require('express').Router();
const { createCourse, getCourses, updateCourse} = require('../controllers/course.controller');
const { createCourse, getCourses, deleteCourse} = require('../controllers/course.controller');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.post('/', verifyToken, verifyAdmin, createCourse);
router.get('/', getCourses);
router.put('/:id', verifyToken,verifyAdmin, updateCourse);
router.delete('/:id', verifyToken, verifyAdmin, deleteCourse);

module.exports = router;
