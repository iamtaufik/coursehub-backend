const { createNotification, getMyNotifications, getAllNotifications, deleteNotification } = require('../controllers/notification.controller');
const router = require('express').Router();
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.post('/', verifyToken, verifyAdmin, createNotification);
router.get('/', verifyToken, getMyNotifications);
router.get('/all', verifyToken, verifyAdmin, getAllNotifications);
router.delete('/:id', verifyToken, verifyAdmin, deleteNotification);

module.exports = router;
