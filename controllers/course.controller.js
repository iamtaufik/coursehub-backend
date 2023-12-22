const prisma = require('../libs/prisma');
const path = require('path');
const imagekit = require('../libs/imagekit');
const { createCourseSchema, updateCourseSchema, getCourseSchema, joinCourseSchema } = require('../validations/course.validation');
const { getPagination } = require('../libs/getPaggination');

const createCourse = async (req, res, next) => {
  try {
    const { value, error } = createCourseSchema.validate({ ...req.body });

    if (error) {
      return res.status(400).json({
        status: false,
        message: 'ValidationError',
        data: error.details[0].message,
      });
    }

    let image = null;
    if (req.file) {
      const strFile = req.file.buffer.toString('base64');
      const { url } = await imagekit.upload({
        fileName: Date.now() + path.extname(req.file.originalname),
        file: strFile,
      });
      image = url;
    }

    const course = await prisma.courses.create({
      data: {
        title: value.title,
        telegram_group: value.telegram_group,
        description: value.description,
        image,
        price: value.price,
        author: value.author,
        level: value.level,
        requirements: { set: value.requirements },
        category: {
          connect: {
            id: value.category_id,
          },
        },
        chapters: {
          create: value.chapters.map((chapter) => {
            return {
              name: chapter.name,
              modules: {
                create: chapter.modules.map((module) => {
                  return {
                    title: module.title,
                    duration: module.duration,
                    url: module.url,
                    isTrailer: module.isTrailer,
                  };
                }),
              },
            };
          }),
        },
      },
      include: {
        chapters: {
          include: {
            modules: true,
          },
        },
      },
    });
    res.status(201).json({
      status: true,
      message: 'Course created successfully',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};


const getCourses = async (req, res, next) => {
  try {
    let courses;

    if (req.query.search) {
      const { search } = req.query;
      courses = await prisma.courses.findMany({
        where: {
          title: {
            contains: search,
            mode: 'insensitive',
          },
          AND: { isDeleted: false },
        },
        include: {
          category: true,
          ratings: true,
        },
      });
    } else if (req.query.category) {
      const { category } = req.query;
      courses = await prisma.courses.findMany({
        where: {
          category: {
            name_categories: typeof category === 'string' ? { in: [category] } : { in: [...category] },
          },
          AND: { isDeleted: false },
        },
        include: {
          category: true,
          ratings: true,
        },
      });
    } else if (req.query.level) {
      const { level } = req.query;
      courses = await prisma.courses.findMany({
        where: {
          level: {
            in: [level],
          },
          AND: { isDeleted: false },
        },
        include: {
          category: true,
          ratings: true,
        },
      });
    } else if (req.query.filter) {
      const { filter } = req.query;
      const filterOptions = {
        populer: { orderBy: { ratings: 'desc' } },
        terbaru: { orderBy: { createdAt: 'desc' } },
      };
      courses = await prisma.courses.findMany({
        ...filterOptions[filter],
        where: {
          isDeleted: false,
        },
        include: {
          category: true,
          ratings: true,
        },
      });
    } else if (req.query.level && req.category && req.query.filter) {
      const { level, category, fillter } = req.query;
      const filterOptions = {
        populer: { orderBy: { ratings: 'desc' } },
        terbaru: { orderBy: { createdAt: 'desc' } },
      };
      courses = await prisma.courses.findMany({
        ...filterOptions[fillter],
        where: {
          category: {
            name_categories: typeof category === 'string' ? { in: [category] } : { in: [...category] },
          },
          ...(level && { level }),
        },
        include: {
          category: true,
          ratings: true,
        },
      });
    } else if (req.query.page && req.query.limit) {
      const { page = 1, limit = 10 } = req.query;
      courses = await prisma.courses.findMany({
        where: { isDeleted: false },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: {
          category: true,
          ratings: true,
        },
      });
      const { _count } = await prisma.courses.aggregate({
        _count: { id: true },
      });
      const pagination = getPagination(req, _count.id, Number(page), Number(limit));
      return res.status(200).json({
        status: true,
        message: 'Courses retrieved successfully',
        data: {
          courses,
          pagination,
        },
      });
    } else {
      courses = await prisma.courses.findMany({
        where: { isDeleted: false },
        include: {
          category: true,
          ratings: true,
        },
      });
    }

    const calculateAverageRating = (ratings) => {
      if (ratings && ratings.length > 0) {
        const totalRatings = ratings.reduce((sum, rating) => sum + rating.ratings, 0);
        const totalUsers = ratings.length;
        return totalRatings / totalUsers;
      } else {
        return 0;
      }
    };

    courses = courses.map((course) => ({
      ...course,
      averageRating: calculateAverageRating(course.ratings),
    }));

    return res.status(200).json({
      status: true,
      message: 'Courses retrieved successfully',
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const course_id = parseInt(req.params.id);

    await updateCourseSchema.validateAsync({ ...req.body });

    const existingCourse = await prisma.courses.findUnique({
      where: {
        id: course_id,
        AND: { isDeleted: false },
      },
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
        error: 'Course with the provided ID does not exist',
        data: null,
      });
    }

    const { title, description, telegram_group, price, image, chapters, requirements, author, level } = req.body;
    const existingChapters = await prisma.chapters.findMany({
      where: {
        course_id: course_id,
      },
    });

    for (const chapter of existingChapters) {
      await prisma.modules.deleteMany({
        where: {
          chapter_id: chapter.id,
        },
      });
    }

    const updatedCourse = await prisma.courses.update({
      where: {
        id: course_id,
      },
      data: {
        title,
        telegram_group,
        description,
        image,
        price,
        author,
        level,
        requirements: { set: requirements },
        chapters: {
          deleteMany: { course_id: course_id },
          create: chapters.map((chapter) => {
            return {
              name: chapter.name,
              modules: {
                create: chapter.modules.map((module) => {
                  return {
                    title: module.title,
                    duration: module.duration,
                    url: module.url,
                  };
                }),
              },
            };
          }),
        },
      },
      include: {
        chapters: {
          include: {
            modules: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const getCourses = await prisma.courses.findUnique({
      where: {
        id: Number(id),
        AND: { isDeleted: false },
      },
    });

    if (!getCourses) {
      return res.status(404).json({
        status: false,
        message: 'Course not found',
        data: null,
      });
    }

    await prisma.courses.update({
      where: {
        id: Number(id),
      },
      data: {
        isDeleted: true,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const getDetailCourses = async (req, res, next) => {
  try {
    let { id } = req.params;
    let course = await prisma.courses.findUnique({
      where: { id: Number(id), AND: { isDeleted: false } },
      include: {
        chapters: {
          include: {
            modules: true,
          },
        },
        ratings: true,
      },
    });

    if (!course) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        data: 'Courses data not found with Id ' + id,
      });
    }

    const calculateAverageRating = (ratings) => {
      if (ratings && ratings.length > 0) {
        const totalRatings = ratings.reduce((sum, rating) => sum + rating.ratings, 0);
        const totalUsers = ratings.length;
        return totalRatings / totalUsers;
      } else {
        return 0;
      }
    };

    const averageRating = calculateAverageRating(course.ratings);

    course = {
      ...course,
      averageRating: averageRating,
    };

    res.status(200).json({
      status: true,
      message: 'Detail Courses!',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};


const joinCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email } = req.user;

    // await joinCourseSchema.validateAsync({ ...req.params, ...req.body });

    const course = await prisma.courses.findUnique({
      where: {
        id: Number(id),
        AND: { isDeleted: false },
      },
      include: {
        chapters: {
          include: {
            modules: true,
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({
        status: false,
        message: 'Course not found',
        data: null,
      });
    }

    if (course.price > 0) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        data: 'Courses not free',
      });
    }

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
        data: null,
      });
    }

    // check if user already join course
    const checkJoin = await prisma.users.findFirst({
      where: {
        email,
        courses: {
          some: {
            id: Number(id),
          },
        },
      },
    });

    if (checkJoin) {
      return res.status(409).json({
        status: false,
        message: 'User already join this course',
        data: null,
      });
    }

    const join = await prisma.users.update({
      where: {
        email,
      },
      data: {
        courses: {
          connect: {
            id: Number(id),
          },
        },
      },
    });
    const temp = course.chapters.map((chapter) =>
      chapter.modules.map((module) => ({
        userId: Number(req.user.id),
        moduleId: Number(module.id),
        isCompleted: false,
      }))
    );

    // console.log(temp);

    await prisma.$transaction([
      prisma.userCourseProgress.createMany({
        data: temp.flat(),
      }),
      prisma.notification.create({
        data: {
          title: 'Notifikasi',
          notificationId: Math.floor(Math.random() * 1000000),
          body: `Selamat anda berhasil mengikuti kelas ${course.title}`,
          userId: user.id,
        },
      }),
    ]);

    delete join.password;

    res.status(201).json({
      status: true,
      message: 'Join course successfully',
      data: join,
    });
  } catch (error) {
    next(error);
  }
};

const myCourse = async (req, res, next) => {
  try {
    const { email } = req.user;

    // Mendapatkan data kursus pengguna
    let { courses } = await prisma.users.findUnique({
      where: {
        email,
      },
      select: {
        courses: {
          where: {
            isDeleted: false,
          },
        },
      },
    });

    const courseId = courses[0].id;

    const ratings = await prisma.courseRatings.findMany({
      where: {
        courseId: courseId,
      },
    });

    const totalRatings = ratings.reduce((sum, rating) => sum + rating.ratings, 0);
    const totalUsers = ratings.length;

    const averageRatings = totalUsers > 0 ? totalRatings / totalUsers : 0;

    const coursesWithRating = courses.map(course => ({
      ...course,
      ratings: {
        totalRatings: totalRatings,
        totalUsers: totalUsers,
        averageRatings: averageRatings,
      },
    }));

    res.status(200).json({
      status: true,
      message: `Courses retrieved successfully`,
      data: {
        userCourses: coursesWithRating,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getDetailMyCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email } = req.user;

    const course = await prisma.courses.findUnique({
      where: {
        id: Number(id),
        AND: { isDeleted: false },
      },
    });

    if (!course) {
      return res.status(404).json({
        status: false,
        message: 'Course not found',
        data: null,
      });
    }

    const checkJoin = await prisma.users.findUnique({
      where: {
        email,
        courses: {
          some: {
            id: Number(id),
            AND: {
              isDeleted: false,
            },
          },
        },
      },
    });

    if (!checkJoin) {
      return res.status(403).json({
        status: false,
        message: 'User not join this course',
        data: null,
      });
    }

    let { courses } = await prisma.users.findFirst({
      where: {
        email,
      },
      select: {
        courses: {
          where: {
            id: Number(id),
            isDeleted: false,
          },
          include: {
            chapters: {
              include: {
                modules: {
                  select: {
                    id: true,
                    title: true,
                    duration: true,
                    url: true,
                    userCourseProgress: {
                      where: {
                        userId: { equals: Number(req.user.id) },
                      },
                      select: {
                        id: true,
                        isCompleted: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    courses = courses.map((course) => ({
      ...course,
      chapters: course.chapters.map((chapter) => ({
        ...chapter,
        modules: chapter.modules.map((module) => ({
          ...module,
          userCourseProgress: module.userCourseProgress[0],
        })),
      })),
    }));

    const courseId = courses[0].id;
    const ratings = await prisma.courseRatings.findMany({
      where: {
        courseId: courseId,
      },
    });
    const totalRatings = ratings.reduce((sum, rating) => sum + rating.ratings, 0);
    const totalUsers = ratings.length;
    const averageRatings = totalUsers > 0 ? totalRatings / totalUsers : 0;

    const courseWithRating = {
      ...courses[0],
      ratings: {
        totalRatings: totalRatings,
        totalUsers: totalUsers,
        averageRatings: averageRatings,
      },
    };

    res.status(200).json({
      status: true,
      message: 'Detail Kursus!',
      data: courseWithRating,
    });
  } catch (error) {
    next(error);
  }
};

const myCourseProgress = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { progressId } = req.params;

    const isExsitUserProgress = await prisma.userCourseProgress.findFirst({
      where: {
        id: Number(progressId),
        AND: {
          userId: Number(id),
        },
      },
    });

    if (!isExsitUserProgress) {
      return res.status(400).json({
        success: false,
        message: 'You are not owner this progress',
        data: null,
      });
    }

    const isCompletedUserProgress = await prisma.userCourseProgress.update({
      where: {
        id: Number(progressId),
      },
      data: {
        isCompleted: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Success',
      data: isCompletedUserProgress,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCourse,
  getCourses,
  joinCourse,
  myCourse,
  getDetailCourses,
  updateCourse,
  deleteCourse,
  getDetailMyCourse,
  myCourseProgress,
};
