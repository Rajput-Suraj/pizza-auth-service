import createHttpError from "http-errors";
import type { Request, Response, NextFunction } from "express";

import type { AuthRequest } from "../types/index.ts";

const canAccess = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const _req = req as AuthRequest;
    const roleFromToken = _req.auth.role;

    if (!roles.includes(roleFromToken)) {
      const err = createHttpError(403, "You don't have enough permission");
      next(err);
      return;
    }
    next();
  };
};

export default canAccess;
