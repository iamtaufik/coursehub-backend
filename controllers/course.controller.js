const prisma = require('../libs/prisma');
const { createCourseSchema, getCourseSchema, joinCourseSchema } = require('../validations/course.validation');
const { createCourseSchema, getCourseSchema, updateCourseSchema } = require('../validations/course.validation');
const { getPagination } = require('../libs/getPaggination');

const createCourse = async (req, res, next) => {
  const { title, description, price, image, chapters, requirements, author, level } = req.body;
  try {
    const { error } = createCourseSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: 'Validation Error',
        err: error.details[0].message,
        data: null,
      });
    }
    const course = await prisma.courses.create({
      data: {
        title,
        description,
        image,
        price,
        author,
        level,
        ratings: 0,
        requirements: { set: requirements },
        category: {
          connect: {
            id: req.body.category_id,
          },
        },
        chapters: {
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
    if (req.query.search) {
      const { search } = req.query;

      const courses = await prisma.courses.findMany({
        where: {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
      });

      return res.status(200).json({
        status: true,
        message: 'Courses retrieved successfully',
        data: courses,
      });
    }

    if (req.query.level || req.category || req.query.filter) {
      const { level, category, fillter } = req.query;

      const filterOptions = {
        populer: { orderBy: { ratings: 'desc' } },
        terbaru: { orderBy: { createdAt: 'desc' } },
      };

      const courses = await prisma.courses.findMany({
        ...filterOptions[fillter],
        where: {
          category: {
            name_categories: typeof category === 'string' ? { in: [category] } : { in: [...category] },
          },
          ...(level && { level }),
        },

      return res.status(200).json({
        status: true,
        message: 'Courses retrieved successfully',
        data: courses,
      });
    }
    if (req.query.page || req.query.limit) {
      const { page = 1, limit = 10 } = req.query;

      const courses = await prisma.courses.findMany({
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
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
    }

    const courses = await prisma.courses.findMany();

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

    const { error } = updateCourseSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: error.details[0].message,
        data: null,
      });
    }

    const existingCourse = await prisma.courses.findUnique({
      where: {
        id: course_id,
      },
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
        error: 'Course with the provided ID does not exist',
        
const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const getCourses = await prisma.courses.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!getCourses) {
      return res.status(404).json({
        status: false,
        message: 'Course not found',
        data: null,
      });
    }

    const { title, description, price, image, chapters, requirements, author, level } = req.body;

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
    await prisma.courses.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse,
      status: true,
      message: 'Course deleted successfully',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
}


const getDetailCourses = async (req, res, next) => {
  try {
    let { id } = req.params;
    let course = await prisma.courses.findUnique({
      where: { id: Number(id) },
      include: {
        chapters: {
          include: {
            modules: true
          }
        }
      }
    });

    if (!course) {
      return res.status(400).json({
        status: false,
        message: 'Bad Request',
        data: 'Courses data not found with Id ' + id
      });
    }

    res.status(200).json({
      status: true,
      message: 'Detail Courses!',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

const joinCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    await joinCourseSchema.validateAsync({ ...req.params, ...req.body });

    const course = await prisma.courses.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!course) {
      return res.status(404).json({
        status: false,
        message: 'Course not found',
        data: null,
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

    const {courses} = await prisma.users.findUnique({
      where: {
        email,
      },
      select: {
        courses: true,
      },
    });

    res.status(200).json({
      status: true,
      message: 'Courses retrieved successfully',
      data: [...courses]
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createCourse,
  getCourses,
  joinCourse,
  myCourse,
  getDetailCourses
  updateCourse,
  deleteCourse,
};
