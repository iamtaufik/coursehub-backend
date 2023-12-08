const joi = require('joi');

const createCourseSchema = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  image: joi.string(),
  price: joi.number().required(),
  category_id: joi.number().required(),
  requirements: joi.array().items(joi.string()).required(),
  level: joi.string().valid('beginner', 'intermediate', 'advanced').required(),
  author: joi.string().required(),
  chapters: joi
    .array()
    .not()
    .empty()
    .min(1)
    .message('At least one chapter is required')
    .items(
      joi.object({
        name: joi.string().required(),
        modules: joi
          .array()
          .not()
          .empty()
          .min(1)
          .message('At least one module is required')
          .items(
            joi.object({
              title: joi.string().required(),
              duration: joi.number().required(),
              url: joi.string().required(),
            })
          )
          .required(),
      })
    )
    .required(),
});

const getCourseSchema = joi
  .object({
    level: joi.string().valid('beginner', 'intermediate', 'advanced').allow(''),
    page: joi.number().min(1).optional(),
    limit: joi.number().min(1).optional(),
  })
  .unknown(false);

const joinCourseSchema = joi.object({
  id: joi.number().required(),
  email: joi.string().email().required(),
});

const updateCourseSchema = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  image: joi.string(),
  price: joi.number().required(),
  category_id: joi.number().required(),
  requirements: joi.array().items(joi.string()).required(),
  level: joi.string().valid('beginner', 'intermediate', 'advanced').required(),
  author: joi.string().required(),
  chapters: joi
    .array()
    .not()
    .empty()
    .min(1)
    .message('At least one chapter is required')
    .items(
      joi.object({
        name: joi.string().required(),
        modules: joi
          .array()
          .not()
          .empty()
          .min(1)
          .message('At least one module is required')
          .items(
            joi.object({
              title: joi.string().required(),
              duration: joi.number().required(),
              url: joi.string().required(),
            })
          )
          .required(),
      })
    )
    .required(),
});

module.exports = {
  createCourseSchema,
  getCourseSchema,
  joinCourseSchema,
  updateCourseSchema,
};
