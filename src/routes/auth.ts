import express from "express";
import type { NextFunction, Request, Response } from "express";

import { UserService } from "../services/UserService.ts";
import { TokenService } from "../services/TokenService.ts";
import { AuthController } from "../controllers/AuthController.ts";
import registerValidator from "../validators/register-validator.ts";

const router = express();
const userService = new UserService();
const tokenService = new TokenService();
const authController = new AuthController(userService, tokenService);

router.post(
  "/register",
  registerValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.register(req, res, next),
);

export default router;
