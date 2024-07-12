import jwt from 'jsonwebtoken'
import ApiError from '../utils/ApiError.js';
import {User} from '../models/userSchema.js';


const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const { User } = require("../models");
const asyncHandler = require("../utils/asyncHandler");

export const auth = asyncHandler(async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) throw new ApiError("token must be provided", 400);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) throw new ApiError("Invalid token", 400);
   const user = await User.findOne({
    where: { id: decoded.id },
  });
  if (!user) throw new ApiError("Invalid user", 400);
  req.user = user;
  next();
});

