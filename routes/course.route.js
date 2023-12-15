const router = require('express').Router();
const { createCourse, getCourses, joinCourse, myCourse, getDetailCourses, updateCourse, deleteCourse, getDetailMyCourse, myCourseProgress } = require('../controllers/course.controller');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');
const {upload } = require('../libs/multer');

router.post('/', upload.single('image'), verifyToken, verifyAdmin, createCourse);
router.get('/', getCourses);
router.put('/:id/join', verifyToken, joinCourse);
router.get('/me', verifyToken, myCourse);
router.get('/me/:id', verifyToken, getDetailMyCourse);
router.put('/me/progress/:progressId',verifyToken, myCourseProgress);
router.get('/:id', getDetailCourses);
router.put('/:id', verifyToken, verifyAdmin, updateCourse);
router.delete('/:id', verifyToken, verifyAdmin, deleteCourse);

module.exports = router;
