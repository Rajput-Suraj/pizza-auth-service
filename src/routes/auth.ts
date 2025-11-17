import express from "express";
import type { NextFunction, Request, Response } from "express";

import type { AuthRequest } from "../types/index.ts";
import { UserService } from "../services/UserService.ts";
import { TokenService } from "../services/TokenService.ts";
import { AuthController } from "../controllers/AuthController.ts";
import authenticate from "../middlewares/authenticate.ts";
import loginValidator from "../validators/login-validator.ts";
import registerValidator from "../validators/register-validator.ts";
import validateRefreshToken from "../middlewares/validateRefreshToken.ts";

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

router.post(
  "/login",
  loginValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.login(req, res, next),
);

router.get("/self", authenticate, (req: Request, res: Response) =>
  authController.self(req as AuthRequest, res),
);

router.post(
  "/refresh",
  validateRefreshToken,
  (req: Request, res: Response, next: NextFunction) =>
    authController.refresh(req as AuthRequest, res, next),
);

export default router;
