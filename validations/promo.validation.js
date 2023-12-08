const joi = require('joi');

const createPromoSchema = joi.object({
  code_promo: joi.string().required(),
  discount: joi.number().required(),
  expiresAt: joi.string().required(),
});

const updatePromoSchema = joi.object({
    code_promo: joi.string().required(),
    discount: joi.number().required(),
    expiresAt: joi.string().required(),
  });

module.exports = {
  createPromoSchema,
  updatePromoSchema
};
