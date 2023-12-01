const router = require('express').Router();
const { createCourse, getCourses, joinCourse, myCourse } = require('../controllers/course.controller');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.post('/', verifyToken, verifyAdmin, createCourse);
router.get('/', getCourses);
router.put('/:id/join', verifyToken, joinCourse);
router.get('/me', verifyToken, myCourse);

module.exports = router;
