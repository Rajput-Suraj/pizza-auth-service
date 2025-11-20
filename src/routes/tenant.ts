import express from "express";
import type { NextFunction, Request, Response } from "express";

import logger from "../config/logger.ts";
import authenticate from "../middlewares/authenticate.ts";
import { TenantService } from "../services/TenantService.ts";
import { TenantController } from "../controllers/TenantController.ts";

const router = express.Router();
const tenantService = new TenantService();
const tenantController = new TenantController(tenantService, logger);

router.post(
  "/",
  authenticate,
  (req: Request, res: Response, next: NextFunction) =>
    tenantController.create(req, res, next),
);

export default router;
