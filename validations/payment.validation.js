const joi = require('joi');

const createPaymentSchema = joi.object({
  courseId: joi.number().required(),
  promoCode: joi.string().allow(null, ''),
  nickname: joi.string().required(),
  email: joi.string().email().required(),
  phone_number: joi.string(),
  id: joi.number().required(),
});

const createNotificationPaymentSchema = joi.object({
    order_id: joi.number().required(),
    transaction_status: joi.string().required(),
    payment_type: joi.string().required(),
    transaction_time: joi.string().required(),
    });

module.exports = {
  createPaymentSchema,
  createNotificationPaymentSchema
};
