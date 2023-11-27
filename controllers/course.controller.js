const prisma = require('../libs/prisma');
const { createCourseSchema, getCourseSchema } = require('../validations/course.validation');

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

const getCourse = async (req, res, next) => {
  try {
    const { error } = getCourseSchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        status: false,
        message: 'Validation Error',
        err: error.details[0].message,
        data: null,
      });
    }

    const { level, page, pageSize } = req.query;
       const whereCondition = {
      isActive: true, 
      };

    if (level) {
      whereCondition.level = level;
    }

    const currentPage = parseInt(page, 10) || 1;
    const perPage = parseInt(pageSize, 10) || 10;
    const offset = (currentPage - 1) * perPage;

    const totalCourses = await prisma.courses.count({
      where: whereCondition,
    });

    const courses = await prisma.courses.findMany({
      where: whereCondition,
      include: {
      },
      take: perPage, 
      skip: offset, 
    });

    
    res.status(200).json({
      status: true,
      message: 'Courses retrieved successfully',
      data: {
        courses,
        currentPage,
        pageSize: perPage,
        totalCourses,
        totalPages: Math.ceil(totalCourses / perPage),
      },
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createCourse,
  getCourse,
};

