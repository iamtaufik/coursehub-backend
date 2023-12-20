const router = require('express').Router();

const { createReminder } = require('../controllers/reminder.controller');
const verifySecretCron = require('../middlewares/verifySecretCron');

router.get('/cron', verifySecretCron, createReminder);

module.exports = router;