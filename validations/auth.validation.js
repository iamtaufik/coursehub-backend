const joi = require('joi');

const registerUserSchema = joi.object({
  nickname: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  phone_number: joi
    .string()
    .pattern(/^[0-9]+$/)
    .required(),
});

const loginUserSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

const verifyOTPSchema = joi.object({
  email: joi.string().email().required(),
  otp: joi.string().length(6).required(),
});

const createAdminSchema = joi.object({
  idAdmin: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

const loginAdminSchema = joi.object({
  idAdmin: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

module.exports = {
  registerUserSchema,
  loginUserSchema,
  verifyOTPSchema,
  createAdminSchema,
  loginAdminSchema,
};
