import express from "express";
import { AuthController } from "../controllers/AuthController.ts";
import { UserService } from "../services/UserService.ts";

const router = express();
const userService = new UserService();
const authController = new AuthController(userService);

router.post("/register", (req, res, next) =>
  authController.register(req, res, next),
);

export default router;
