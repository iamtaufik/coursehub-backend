const router = require('express').Router();
const { createCourse, getCourses, updateCourse} = require('../controllers/course.controller');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.post('/', verifyToken, verifyAdmin, createCourse);
router.get('/', getCourses);
router.put('/:id', verifyToken,verifyAdmin, updateCourse);

module.exports = router;
