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
  idAdmin: joi.string().required(),
  password: joi.string().min(6).required(),
});

const loginAdminSchema = joi.object({
  idAdmin: joi.string().required(),
  password: joi.string().min(6).required(),
});

const forgotPasswordSchema = joi.object({
  email: joi.string().email().required(),
});

const resetPasswordSchema = joi.object({
  password: joi.string().min(6).required(),
  confirm_password: joi.string().min(6).required(),
});

const changePasswordSchema = joi.object({
  old_password: joi.string().min(6).required(),
  new_password: joi.string().min(6).required(),
  confirm_password: joi.string().min(6).required(),
});

module.exports = {
  registerUserSchema,
  loginUserSchema,
  verifyOTPSchema,
  createAdminSchema,
  loginAdminSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema
};
