const router = require('express').Router();

router.use('/auth', require('./auth.route'));
router.use('/courses', require('./course.route'));
router.use('/categories', require('./category.route'));

module.exports = router;
