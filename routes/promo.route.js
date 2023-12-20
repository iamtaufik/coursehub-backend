const router = require('express').Router();
const { createPromo, getPromo, detailPromo, updatePromo, deletePromo } = require('../controllers/promo.controller');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.post('/', verifyToken, verifyAdmin, createPromo);
router.get('/', verifyToken, getPromo);
router.get('/:id', verifyToken, detailPromo);
router.put('/:id', verifyToken, verifyAdmin, updatePromo);
router.delete('/:id', verifyToken, verifyAdmin, deletePromo);

module.exports = router;