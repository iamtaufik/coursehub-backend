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
    const { id } = req.params;

    await getCategoriesSchema.validateAsync(req.params);

    const { courses } = await prisma.categories.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        courses: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Courses retrieved successfully',
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, getCourseByCategory };
