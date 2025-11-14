import fs from "node:fs";
import path from "node:path";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";

import type { JwtPayload } from "jsonwebtoken";
import type { NextFunction, Response } from "express";
import type { RegisterUserRequest } from "../types/index.ts";

import { Config } from "../config/index.ts";
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

      const payload: JwtPayload = {
        sub: String(data?.userId),
        role: data?.role,
      };

      let privateKey: Buffer;
      try {
        privateKey = fs.readFileSync(
          path.join(__dirname, "../../certs/private.pem"),
        );
        //eslint-disable-next-line  @typescript-eslint/no-unused-vars
      } catch (err) {
        const error = createHttpError(500, "Error while reading private key");
        next(error);
        return;
      }

      const accessToken = jwt.sign(payload, privateKey, {
        algorithm: "RS256",
        expiresIn: "1h",
        issuer: "auth-service",
      });
      const refreshToken = jwt.sign(payload, Config.REFRESH_TOKEN_SECRET!, {
        algorithm: "HS256",
        expiresIn: "1y",
        issuer: "auth-service",
      });

      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
        domain: "localhost",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
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
