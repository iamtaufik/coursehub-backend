const prisma = require('../libs/prisma');
const { getCategoriesSchema } = require('../validations/category.validation');

const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.categories.findMany();

    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

const getCourseByCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const category = await prisma.categories.findUnique({
      where: { id: Number(id) },
      include: {
        courses: true,
      },
    });

    if (!category) {
      return res.status(404).json({
        message: 'Course category not found!'
      });
    }

    if (category.courses.length === 0) {
      res.status(200).json({
        status: true,
        message: 'Course data does not exist in the category ' + category.name_categories,
        data: category.courses,
      });
    }

    res.status(200).json({
      status: true,
      message: category.name_categories,
      data: category.courses,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, getCourseByCategory };
