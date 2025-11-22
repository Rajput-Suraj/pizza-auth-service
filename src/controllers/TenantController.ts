import { Logger } from "winston";
import type { NextFunction, Request, Response } from "express";

import { TenantService } from "../services/TenantService.ts";

export class TenantController {
  tenantService: TenantService;
  logger: Logger;

  constructor(tenantService: TenantService, logger: Logger) {
    this.logger = logger;
    this.tenantService = tenantService;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    this.logger.debug("Request for creating a tenant", req.body);
    try {
      const tenant = await this.tenantService.create(req.body);
      this.logger.info("Tenant has been created", { id: tenant?.id });

      res.status(201).json({ message: "Tenant created" });
    } catch (err) {
      next(err);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const tenant = await this.tenantService.getTenantById(
        Number(req.params.id),
      );

      res.status(200).json({ tenant });
    } catch (err) {
      next(err);
    }
  }

  async getAllTenants(req: Request, res: Response, next: NextFunction) {
    try {
      const tenants = await this.tenantService.getAllTenants();

      res.status(200).json({ tenants });
    } catch (err) {
      next(err);
    }
  }
}
