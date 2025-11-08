import express from "express";
import { AuthController } from "../controllers/AuthController.ts";

const router = express();
const authController = new AuthController();

router.post("/register", (req, res) => authController.register(req, res));

export default router;
