import type { NextFunction, Response } from "express";
import { validationResult } from "express-validator";

import type { RegisterUserRequest } from "../types/index.ts";
import { UserService } from "../services/UserService.ts";

export class AuthController {
  userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    //Validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { firstName, lastName, email, role, password } = req.body;

    try {
      const data = await this.userService.create({
        firstName,
        lastName,
        email,
        role,
        password,
      });

      res.status(201).json({
        userId: data?.userId,
        role: data?.role,
        message: "User created successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}
