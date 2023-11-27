const prisma = require('../libs/prisma');
const { createCourseSchema } = require('../validations/course.validation');

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
            id: req.body.categoryId,
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

module.exports = {
  createCourse,
};
