import fs from "node:fs";
import path from "node:path";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";

import { eq } from "drizzle-orm";
import type { JwtPayload } from "jsonwebtoken";

import db from "../db/client.ts";
import { Config } from "../config/index.ts";
import { refreshTokenTable } from "../db/index.ts";

export class TokenService {
  generateAccessToken(payload: JwtPayload) {
    let privateKey: Buffer;
    try {
      privateKey = fs.readFileSync(
        path.join(process.cwd(), "certs/private.pem"),
      );
      //eslint-disable-next-line  @typescript-eslint/no-unused-vars
    } catch (err) {
      const error = createHttpError(500, "Error while reading private key");
      throw error;
    }

    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "1h",
      issuer: "auth-service",
    });

    return accessToken;
  }

  generateRefreshToken(payload: JwtPayload) {
    const refreshToken = jwt.sign(payload, Config.REFRESH_TOKEN_SECRET!, {
      algorithm: "HS256",
      expiresIn: "1y",
      issuer: "auth-service",
      jwtid: String(payload.refreshTokenId),
    });

    return refreshToken;
  }

  async persistRefreshToken(userData: { userId: number }) {
    const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;
    let newRefreshToken;
    try {
      newRefreshToken = await db
        .insert(refreshTokenTable)
        .values({
          userId: userData.userId,
          expiresAt: new Date(Date.now() + MS_IN_YEAR),
        })
        .returning({
          refreshTokenId: refreshTokenTable.id,
        });
    } catch (err) {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = createHttpError(500, (err as any).cause?.detail);
      throw error;
    }

    return newRefreshToken[0];
  }

  async deleteRefreshToken(tokenId: number) {
    return await db
      .delete(refreshTokenTable)
      .where(eq(refreshTokenTable.id, tokenId));
  }
}
