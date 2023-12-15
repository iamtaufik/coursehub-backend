const router = require('express').Router();

router.use('/auth', require('./auth.route'));
router.use('/courses', require('./course.route'));
router.use('/categories', require('./category.route'));
router.use('/payment', require('./payment.route'));
router.use('/transactions', require('./transaction.route'));
router.use('/profile', require('./profile.route'));
router.use('/', require('./dashboard.route'));
router.use('/promo', require('./promo.route'));
router.use('/notification', require('./notification.route'));
router.use(require('./reminder.route'));

module.exports = router;
