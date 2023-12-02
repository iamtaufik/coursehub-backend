const router = require('express').Router();
const { getTransactions,myTransaction } = require('../controllers/transaction.controller');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.get('/', verifyToken, verifyAdmin, getTransactions);
router.get('/me', verifyToken, myTransaction);

module.exports = router;
