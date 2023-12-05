const router = require('express').Router();
const { countActiveUsers, countActiveClass,
  countPremiumClass } = require('../controllers/dashboard.controller');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.get('/activeUsers', verifyToken, verifyAdmin, countActiveUsers);
router.get('/activeClass', verifyToken, verifyAdmin, countActiveClass);
router.get('/premiumClass', verifyToken, verifyAdmin, countPremiumClass);

module.exports = router;