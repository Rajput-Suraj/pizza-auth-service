import type { Response } from "express";

import type { RegisterUserRequest } from "../types/index.ts";
import { UserService } from "../services/UserService.ts";

export class AuthController {
  userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async register(req: RegisterUserRequest, res: Response) {
    const { firstName, lastName, email } = req.body;

    await this.userService.create({ firstName, lastName, email });

    res.status(201).json({
      message: "User created successfully",
    });
  }
}
