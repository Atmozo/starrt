const Joi = require("joi");

// Define a validation schema
const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  age: Joi.number().integer().min(18).max(100),
});

module.exports = userSchema;
