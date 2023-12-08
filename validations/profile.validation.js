const joi = require('joi');

const createProfileSchema = joi.object({
  phone_number: joi.string().required(),
  first_name: joi.string().required(),
  last_name: joi.string().required(),
  city: joi.string().required(),
  country: joi.string().required(),
});

module.exports = {
  createProfileSchema,
};
