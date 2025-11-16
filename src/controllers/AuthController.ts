import createHttpError from "http-errors";
import { validationResult } from "express-validator";

import type { JwtPayload } from "jsonwebtoken";
import type { NextFunction, Response } from "express";
import type { AuthRequest, RegisterUserRequest } from "../types/index.ts";

import { UserService } from "../services/UserService.ts";
import { TokenService } from "../services/TokenService.ts";

export class AuthController {
  userService: UserService;
  tokenService: TokenService;

  constructor(userService: UserService, tokenService: TokenService) {
    this.userService = userService;
    this.tokenService = tokenService;
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

      if (!data) {
        throw createHttpError(500, "User creation failed");
      }

      const payload: JwtPayload = {
        sub: String(data?.userId),
        role: data?.role,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);

      //Persist the refresh token
      const newRefreshToken = await this.tokenService.persistRefreshToken({
        userId: data.userId,
      });

      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        refreshTokenId: newRefreshToken?.refreshTokenId,
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

  async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
    //Validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { email, password } = req.body;

    try {
      const [user] = await this.userService.findByEmail(email);

      if (!user) {
        const err = createHttpError(400, "Email or password does not match.");
        next(err);
        return;
      }

      const passwordMatch = await this.userService.comparePassword(
        password,
        user.password,
      );

      if (!passwordMatch) {
        const err = createHttpError(400, "Email or password does not match.");
        next(err);
        return;
      }

      const payload: JwtPayload = {
        sub: String(user.id),
        role: user.role,
      };

      const accessToken = this.tokenService.generateAccessToken(payload);

      // //Persist the refresh token
      const newRefreshToken = await this.tokenService.persistRefreshToken({
        userId: user.id,
      });

      const refreshToken = this.tokenService.generateRefreshToken({
        ...payload,
        refreshTokenId: newRefreshToken?.refreshTokenId,
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

      res.status(200).json({
        user: user.id,
      });
    } catch (err) {
      next(err);
    }
  }

  async self(req: AuthRequest, res: Response) {
    const [user] = await this.userService.findById(req.auth.id);
    res.json({ ...user, password: "" });
  }
}
