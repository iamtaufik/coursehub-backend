const router = require('express').Router();

router.use('/auth', require('./auth.route'));
router.use('/courses', require('./course.route'));
router.use('/categories', require('./category.route'));
router.use('/payment', require('./payment.route'));
router.use('/transactions', require('./transaction.route'));
router.use('/profile', require('./profile.route'));

module.exports = router;
