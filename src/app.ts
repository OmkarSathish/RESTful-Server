import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import morgan from "morgan";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import connectDB from "./utils/connectDB.js";
import ShortURL from "./models/user.js";
import ErrorHandler from "./utils/errorHandler.js";

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
    <h1 style="font-family: Sans-Serif; width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center;">CI/CD Pipeline Project for NodeJS Apps using NGINX, GitHub Actions and AWS</h1>
  `;
  res.send(_html);
});

app
  .route("/api/short-url/:url")
  .post(async (req, res) => {
    try {
      const { url } = req.params;
      const smallURL = nanoid(10);
      const ans = new ShortURL({
        url,
        shortUrl: smallURL,
        clickCount: 0,
      });
      await ans.save();
      const _html = `
      <h1 style="font-family: Sans-Serif; width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center;">Your short URL is: ${ans.shortUrl}</h1>
    `;
      res.send(_html);
    } catch (error) {
      throw new ErrorHandler(500, "Internal Server Error");
    }
  })
  .get(async (req, res) => {
    try {
      const { url } = req.params;
      const ans = await ShortURL.findOne({
        shortUrl: url,
      });

      if (!ans) {
        return res.status(400).send({ error: "Invalid Url" });
      }

      ans.clickCount++;
      await ans.save();
      const _html = `
      <h1 style="font-family: Sans-Serif; width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center;">${ans.url}</h1>
    `;
      res.status(200).send(_html);
    } catch (error) {
      throw new ErrorHandler(500, "Internal Server Error");
    }
  });

app.get("/api/stats/:url", async (req, res) => {
  try {
    const { url } = req.params;
    const ans = await ShortURL.findOne({
      shortUrl: url,
    });
    if (!ans) {
      throw new ErrorHandler(400, "Invalid Url");
    }

    const _html = `
      <h1 style="font-family: Sans-Serif; width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center;">Click Count: ${ans.clickCount}</h1>
    `;
    res.send(_html);
  } catch (error) {
    throw new ErrorHandler(500, "Internal Server Error");
  }
});

app.get("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Page not found",
  });
});

app.use(errorMiddleware);

app.listen(port, () =>
  console.log("Server is working on Port:" + port + " in " + envMode + " Mode.")
);
