const { checkout, notification } = require('../controllers/payment.controller');
const verifyToken = require('../middlewares/verifyToken');
const router = require('express').Router();

router.post('/checkout', verifyToken, checkout);
router.post('/notification', verifyToken, notification);

module.exports = router;
