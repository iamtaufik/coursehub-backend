const router = require('express').Router();
const { createCourse, getCourses, joinCourse, myCourse, getDetailCourses, updateCourse, deleteCourse, getDetailMyCourse } = require('../controllers/course.controller');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.post('/', verifyToken, verifyAdmin, createCourse);
router.get('/', getCourses);
router.put('/:id/join', verifyToken, joinCourse);
router.get('/me', verifyToken, myCourse);
router.get('/me/:id', verifyToken, getDetailMyCourse);
router.get('/:id', getDetailCourses);
router.put('/:id', verifyToken, verifyAdmin, updateCourse);
router.delete('/:id', verifyToken, verifyAdmin, deleteCourse);

module.exports = router;
