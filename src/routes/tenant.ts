import express from "express";
import type { NextFunction, Request, Response } from "express";

import logger from "../config/logger.ts";
import canAccess from "../middlewares/canAccess.ts";
import authenticate from "../middlewares/authenticate.ts";
import { Roles } from "../constants/index.ts";
import { TenantService } from "../services/TenantService.ts";
import { TenantController } from "../controllers/TenantController.ts";

const router = express.Router();
const tenantService = new TenantService();
const tenantController = new TenantController(tenantService, logger);

router.post(
  "/",
  authenticate,
  canAccess([Roles.ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    tenantController.create(req, res, next),
);

router.get(
  "/:id",
  authenticate,
  canAccess([Roles.ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    tenantController.findById(req, res, next),
);

router.get(
  "/",
  authenticate,
  canAccess([Roles.ADMIN]),
  (req: Request, res: Response, next: NextFunction) =>
    tenantController.getAllTenants(req, res, next),
);

router.delete("/:id", (req: Request, res: Response, next: NextFunction) =>
  tenantController.deleteTenantById(req, res, next),
);

export default router;
