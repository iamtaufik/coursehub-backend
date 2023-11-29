const router = require('express').Router();
const { getCategories, getCourseByCategory } = require('../controllers/category.controller');

router.get('/', getCategories);
router.get('/:id', getCourseByCategory);

module.exports = router;
