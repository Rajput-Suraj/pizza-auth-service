import type { Request } from "express";
import { expressjwt } from "express-jwt";
import jwksClient, { type GetVerificationKey } from "jwks-rsa";

import { Config } from "../config/index.ts";

export default expressjwt({
  secret: jwksClient({
    jwksUri: Config.JWKS_URI!,
    cache: true,
    rateLimit: true,
  }) as unknown as GetVerificationKey,
  algorithms: ["RS256"],
  getToken(req: Request) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.split(" ")[1] !== "undefined") {
      const token = authHeader.split(" ")[1];
      if (token) {
        return token;
      }
    }

    type AuthCookie = {
      accessToken: string;
    };

    const { accessToken } = req.cookies as AuthCookie;
    return accessToken;
  },
});
