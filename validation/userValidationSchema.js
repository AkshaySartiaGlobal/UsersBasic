import { Joi } from "express-validation";
import ApiError from "../helper/ApiError.js";


export const userRegistrationValidationSchema = Joi.object({
  first_name: Joi.string().min(3).max(30).required().messages({
    "string.base": "First Name should be a type of string",
    "string.empty": "First Name cannot be an empty field",
    "string.min": "First Name should have a minimum length of {#limit}",
    "string.max": "First Name should have a maximum length of {#limit}",
    "any.required": "First Name is a required field",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email",
    "any.required": "Email is a required field",
  }),
  state_id: Joi.number().integer().positive().required().messages({
    "number.base": "State Id should be a type of number",
    "number.empty": "State Id cannot be an empty field",
    "number.integer": "State Id must be a positive integer",
    "number.positive": "State Id must be a positive number",
    "any.required": "State Id is a required field",
  }),
  city_id: Joi.number().integer().positive().required().messages({
    "number.base": "City Id should be a type of number",
    "number.empty": "City Id cannot be an empty field",
    "number.integer": "City Id must be an integer",
    "number.positive": "City Id must be a positive number",
    "any.required": "City Id is a required field",
  }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$"))
    .required()
    .messages({
      "string.base": "Password should be a type of string",
      "string.empty": "Password cannot be an empty field",
      "string.min": "Password should have a minimum length of 8",
      "string.pattern.base":
        "Password should contain at least one uppercase letter, one lowercase letter, and one number",
      "any.required": "Password is a required field",
    }),
}).options({ allowUnknown: false });

export const userLoginValidationSchema = Joi.object({

  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email",
    "any.required": "Email is a required field",
  }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$"))
    .required()
    .messages({
      "string.base": "Password should be a type of string",
      "string.empty": "Password cannot be an empty field",
      "string.min": "Password should have a minimum length of 8",
      "string.pattern.base":
        "Password should contain at least one uppercase letter, one lowercase letter, and one number",
      "any.required": "Password is a required field",
    }),
 
});

const validateSchema = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    throw new ApiError(error.details[0]?.message, 400);
  }
  next();
};

export const validateUserRegistration = validateSchema(userRegistrationValidationSchema);

export const validateUserLogin = validateSchema(userLoginValidationSchema);
