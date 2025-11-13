import express from "express";
import type { NextFunction, Request, Response } from "express";

import { UserService } from "../services/UserService.ts";
import { AuthController } from "../controllers/AuthController.ts";
import registerValidator from "../validators/register-validator.ts";

const router = express();
const userService = new UserService();
const authController = new AuthController(userService);

router.post(
  "/register",
  registerValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.register(req, res, next),
);

export default router;
