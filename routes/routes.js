import express from "express";
import userRoutes from "./userRoutes.js";


const routes = express();


routes.use("/users", userRoutes);




export default routes;

