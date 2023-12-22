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
    await getCategoriesSchema.validateAsync({ ...req.params });
    const categoryId = parseInt(req.params.id);
    const category = await prisma.categories.findUnique({
      where: { id: categoryId },
      include: {
        courses: {
          where: {
            isDeleted: false,
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({
        message: 'Kategori kursus tidak ditemukan!',
      });
    }

    if (category.courses.length === 0) {
      res.status(200).json({
        status: true,
        message: 'Data kursus tidak ada dalam kategori ' + category.name_categories,
        data: category.courses,
      });
    }

    const courseId = category.courses[0].id;
    const ratings = await prisma.courseRatings.findMany({
      where: {
        courseId: courseId,
      },
    });

    const totalRatings = ratings.reduce((sum, rating) => sum + rating.ratings, 0);
    const totalUsers = ratings.length;
    const averageRatings = totalUsers > 0 ? totalRatings / totalUsers : 0;

    res.status(200).json({
      status: true,
      message: `Detail Kategori dan Peringkat Kursus`,
      data: {
        category: {
          name: category.name_categories,
          courses: category.courses,
          ratings: {
            totalRatings: totalRatings,
            totalUsers: totalUsers,
            averageRatings: averageRatings,
          },
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, getCourseByCategory };
