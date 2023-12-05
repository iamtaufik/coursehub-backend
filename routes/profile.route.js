const router = require('express').Router();
const { updateProfile, getProfile } = require('../controllers/profile.controller');
const {upload } = require('../libs/multer');
const verifyToken = require('../middlewares/verifyToken');

router.put('/', verifyToken, upload.single('profile_image'), updateProfile);
router.get('/', verifyToken, getProfile);

module.exports = router;