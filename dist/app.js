import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./utils/connectDB.js";
dotenv.config({ path: "./.env" });
export const envMode = process.env.NODE_ENV?.trim() || "DEVELOPMENT";
const port = process.env.PORT || 3000;
const app = express();
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: " * ", credentials: true }));
app.use(morgan("dev"));
app.get("/api", (req, res) => {
    const _html = `
    <h1 style="width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center;">CI/CD Pipeline for NodeJS Apps</h1>
  `;
    res.send(_html);
});
app.get("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Page not found",
    });
});
app.use(errorMiddleware);
app.listen(port, () => console.log("Server is working on Port:" + port + " in " + envMode + " Mode."));
