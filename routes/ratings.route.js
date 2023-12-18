const router = require('express').Router();
const { createRatings, getRatingCourses } = require('../controllers/ratings.controller');
const verifyToken = require('../middlewares/verifyToken');

router.post('/', verifyToken, createRatings);
router.get('/:id', getRatingCourses);

module.exports = router;