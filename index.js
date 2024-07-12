import dotenv from "dotenv"
dotenv.config()
import express from "express"
import routes from "./routes/routes.js";
import cors from "cors"
import fileUpload from "express-fileupload"
import path from "path"
import compression from "compression"
import swaggerUi from "swagger-ui-express"
import swaggerSpec from "./swaggerConfig.js"
import { storeError } from "./helper/general.js";
const PORT = process.env.PORT || 8006
const app = express();


app.use(
    cors({
      origin: "*",
      allowedHeaders: "Authorization",
    })
  );
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "2000mb" }));
app.use(express.static(path.resolve("./public")));
app.use(cors({ origin: "*", allowedHeaders: "Authorization" }));
app.use(compression())




app.use("/api", routes)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// Error handler middleware
const errorHandler = async (error, req, res, next) => {
    // Simulate storing the error
    storeError(error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  };
  
  // Use the error handler middleware
  app.use(errorHandler);

app.listen(PORT, () => console.log(`server running on port ${PORT}`))