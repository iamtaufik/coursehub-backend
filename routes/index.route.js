const router = require('express').Router();

router.use('/auth', require('./auth.route'));
router.use('/courses', require('./course.route'));

module.exports = router;