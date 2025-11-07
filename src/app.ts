import express from "express";
import type { HttpError } from "http-errors";
import type { Request, Response, NextFunction } from "express";
import logger from "./config/logger.ts";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Auth Service");
});

//Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message);
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    errors: [
      {
        type: err.name,
        msg: err.message,
        path: "",
        location: "",
      },
    ],
  });
});

export default app;
