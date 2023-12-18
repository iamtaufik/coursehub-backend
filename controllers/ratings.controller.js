const prisma = require('../libs/prisma');

const createRatings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { courseId, ratings } = req.body;

    const existingRating = await prisma.courseRatings.findFirst({
      where: {
        userId: userId,
        courseId: courseId,
      },
    });

    if (existingRating) {
      return res.status(400).json({
        status: false,
        message: 'You have already rated this course!',
      });
    }

    const isUsersEnrolled = await prisma.users.findFirst({
      where: {
        id: userId,
        courses: {
          some: {
            id: courseId,
          },
        },
      },
    });

    if (!isUsersEnrolled) {
      return res.status(403).json({
        status: false,
        message: 'Users have not purchased this course!'
      });
    }

    const newRatings = await prisma.courseRatings.create({
      data: {
        courseId: courseId,
        userId: userId,
        ratings: ratings,
      },
    });

    res.status(201).json({
      status: true,
      message: 'Created Ratings Successfully!',
      data: newRatings
    });

  } catch (error) {
    next(error);
  }
};

const getRatingCourses = async (req, res, next) => {
  try {
    const courseId = parseInt(req.params.id);

    // Mendapatkan ratings dari database menggunakan Prisma
    const ratings = await prisma.courseRatings.findMany({
      where: {
        courseId: courseId
      },
    });

    // Menghitung jumlah total rating dan jumlah pengguna yang memberikan rating
    const totalRatings = ratings.reduce((sum, rating) => sum + rating.ratings, 0);
    const totalUsers = ratings.length;

    // Menghitung rata-rata rating
    const averageRatings = totalUsers > 0 ? totalRatings / totalUsers : 0;

    res.status(200).json({
      status: true,
      message: `Ratings Course with Id ${courseId}`,
      data: {
        totalRatings: totalRatings,
        totalUsers: totalUsers,
        averageRatings: averageRatings,
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRatings,
  getRatingCourses
};