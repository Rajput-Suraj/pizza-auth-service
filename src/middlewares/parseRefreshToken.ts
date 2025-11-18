import { expressjwt } from "express-jwt";

import type { Request } from "express";

import { Config } from "../config/index.ts";
import type { AuthCookie } from "../types/index.ts";

export default expressjwt({
  secret: Config.REFRESH_TOKEN_SECRET!,
  algorithms: ["HS256"],
  getToken(req: Request) {
    const { refreshToken } = req.cookies as AuthCookie;
    return refreshToken;
  },
});
