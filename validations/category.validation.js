const joi = require("joi")

const getCategoriesSchema = joi.object({
    id: joi.number().required(),
})

module.exports = { getCategoriesSchema }