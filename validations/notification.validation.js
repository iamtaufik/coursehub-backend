const joi = require('joi');

const createNotificationSchema = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  body: joi.string().required(),
});

const deleteNotificationSchema = joi.object({
  id: joi.number().required(),
});

module.exports = {
  createNotificationSchema,
  deleteNotificationSchema,
};
