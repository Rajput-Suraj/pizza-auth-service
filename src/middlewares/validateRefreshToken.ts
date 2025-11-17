import { and, eq } from "drizzle-orm";
import { expressjwt } from "express-jwt";

import type { Request } from "express";

import db from "../db/client.ts";
import logger from "../config/logger.ts";

import { Config } from "../config/index.ts";
import { refreshTokenTable } from "../db/index.ts";
import type { AuthCookie, IRefreshTokenPayload } from "../types/index.ts";

export default expressjwt({
  secret: Config.REFRESH_TOKEN_SECRET!,
  algorithms: ["HS256"],
  getToken(req: Request) {
    const { refreshToken } = req.cookies as AuthCookie;
    return refreshToken;
  },
  async isRevoked(req: Request, token) {
    try {
      const refreshToken = await db
        .select()
        .from(refreshTokenTable)
        .where(
          and(
            eq(
              refreshTokenTable.id,
              Number((token?.payload as IRefreshTokenPayload).refreshTokenId),
            ),
            eq(refreshTokenTable.userId, Number(token?.payload.sub)),
          ),
        );

      return refreshToken === null;
      //eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      logger.error("Error while getting the refresh token", {
        id: (token?.payload as IRefreshTokenPayload).refreshTokenId,
      });
    }

    return true;
  },
});
