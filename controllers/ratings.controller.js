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
        message: 'You have not purchased this course!'
      });
    }

    // Cek apakah ada rating dari pengguna sebelumnya
    const isPreviousRatingGiven = await prisma.courseRatings.findFirst({
      where: {
        courseId: courseId,
      },
    });

    // Jika tidak ada rating sebelumnya, set status_rating menjadi false
    const statusRating = isPreviousRatingGiven ? true : false;

    // Update status_rating
    await prisma.courses.update({
      where: { id: courseId },
      data: { status_rating: statusRating },
    });

    const newRatings = await prisma.courseRatings.create({
      data: {
        courseId: courseId,
        userId: userId,
        ratings: ratings,
      },
    });

    res.status(201).json({
      status: true,
      message: 'Created ratings successfully!',
      data: newRatings
    });

  } catch (error) {
    next(error);
  }
};


const getRatingCourses = async (req, res, next) => {
  try {
    const courseId = parseInt(req.params.id);

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