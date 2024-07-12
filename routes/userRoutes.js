import { Router } from "express";
import { loginUser, registerUser } from "../controller/userController.js";
import { validateUserRegistration,validateUserLogin } from "../validation/userValidationSchema.js";
const userRoutes = Router();


userRoutes.post('/register',validateUserRegistration,registerUser);
userRoutes.post('/login',validateUserLogin,loginUser);

export default userRoutes;
