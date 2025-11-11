import type { NextFunction, Response } from "express";

import type { RegisterUserRequest } from "../types/index.ts";
import { UserService } from "../services/UserService.ts";

export class AuthController {
  userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    const { firstName, lastName, email } = req.body;
    try {
      const data = await this.userService.create({
        firstName,
        lastName,
        email,
      });

      res.status(201).json({
        userId: data?.userId,
        message: "User created successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}
