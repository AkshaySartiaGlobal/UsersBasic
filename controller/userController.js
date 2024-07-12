import asyncHandler from "../helper/asyncHandler.js";
import {
  createQueryBuilder,
} from "../helper/queryBuilder.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Users from '../models/userSchema.js';
import { makeDb } from "../db-config.js";
import { getRecord } from "../helper/general.js";
import ApiError from "../helper/ApiError.js";
const db = makeDb();

/**
 * Register a new user.
 * @param {object} req - The request object containing user registration data.
 * @param {string} req.body.email - The email address of the user.
 * @param {string} req.body.password - The password chosen by the user.
 * @param {string} req.body.first_name - The first name of the user.
 * @param {string} req.body.last_name - The last name of the user.
 * @param {number} req.body.state_id - The ID of the state where the user resides.
 * @param {number} req.body.city_id - The ID of the city where the user resides.
 * @param {object} res - The response object used to send a response back to the client.
 * @returns {Promise<object>} A promise that resolves to an object containing registration status and JWT token.
 * @throws {ApiError} Throws an error if user already exists, email is invalid.
 */
export const registerUser = asyncHandler(async (req, res) => {
  const existingUser = await getRecord("users", "email", req.body.email);
  if (existingUser.length > 0) throw new ApiError("User already exists!", 400);

  const salt = bcrypt.genSaltSync();

  const hashedPassword = bcrypt.hashSync(req.body.password, salt);
  req.body.password = hashedPassword;
  const { query, values } = createQueryBuilder(Users, req.body);
  const insertedRecord = await db.query(query, values);
  const token = jwt.sign(
    { id: insertedRecord.insertId },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );
  return res.json({
    msg: "User registered successfully",
    status: true,
    token: token,
  });
});

/**
 * User Login controller.
 * @param {object} req - The request object containing the user's email and password.
 * @param {string} req.body.email - The email address of the user trying to log in.
 * @param {string} req.body.password - The password entered by the user.
 * @param {object} res - The response object.
 * @returns {Promise<object>} A promise that resolves to an object containing login status and JWT token.
 * @throws {ApiError} Throws an error if login credentials are invalid or user is not found.
 */
export const loginUser = asyncHandler(async (req, res) => {
  const existingUser = await getRecord("users", "email", req.body.email);
  if (existingUser.length === 0) throw new ApiError("User not found!", 400);
  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    existingUser[0].password
  );

  if (!isPasswordMatch) throw new ApiError("Email or Password is incorrect!", 400);
  const token = jwt.sign(
    { id: existingUser[0].id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );
  return res.json({
    msg: "User login successfully",
    status: true,
    token: token,
  });
});
