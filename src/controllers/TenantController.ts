import { Logger } from "winston";
import { validationResult } from "express-validator";
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

    //Validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

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

  async deleteTenantById(req: Request, res: Response, next: NextFunction) {
    try {
      await this.tenantService.deleteTenantById(Number(req.params.id));

      res.status(200).json({
        message: `Tenant with id ${req.params.id} is deleted successfully`,
      });
    } catch (err) {
      next(err);
    }
  }
}
