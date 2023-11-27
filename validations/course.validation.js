const joi = require('joi');

const createCourseSchema = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  image: joi.string(),
  price: joi.number().required(),
  categoryId: joi.number().required(),
  requirements: joi.array().items(joi.string()).required(),
  level: joi.string().valid('beginner', 'intermediate', 'advanced').required(),
  author: joi.string().required(),
  chapters: joi
    .array()
    .items(
      joi.object({
        name: joi.string().required(),
        modules: joi.array().items(
          joi.object({
            title: joi.string().required(),
            duration: joi.number().required(),
            url: joi.string().required(),
          })
        ),
      })
    )
    .required(),
});

module.exports = {
  createCourseSchema,
};
