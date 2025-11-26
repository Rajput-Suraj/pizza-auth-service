import { eq } from "drizzle-orm";
import createHttpError from "http-errors";

import db from "../db/client.ts";
import { tenants } from "../db/index.ts";

import type { ITenant } from "../types/index.ts";

export class TenantService {
  async create({ name, address }: ITenant) {
    try {
      const result = await db
        .insert(tenants)
        .values({
          name,
          address,
        })
        .returning({
          id: tenants.id,
        });

      return result[0];
    } catch (err) {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = createHttpError(500, (err as any).cause?.detail);
      throw error;
    }
  }

  async getTenantById(id: number) {
    try {
      const result = await db.select().from(tenants).where(eq(tenants.id, id));

      return result[0];
    } catch (err) {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = createHttpError(500, (err as any).cause?.detail);
      throw error;
    }
  }

  async getAllTenants() {
    try {
      const result = await db.select().from(tenants);

      return result;
    } catch (err) {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = createHttpError(500, (err as any).cause?.detail);
      throw error;
    }
  }

  async deleteTenantById(id: number) {
    try {
      const result = await db.delete(tenants).where(eq(tenants.id, id));

      return result;
    } catch (err) {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = createHttpError(500, (err as any).cause?.detail);
      throw error;
    }
  }

  async updateTenant(id: number, { name, address }: ITenant) {
    try {
      const result = await db
        .update(tenants)
        .set({
          name,
          address,
        })
        .where(eq(tenants.id, id));

      return result;
    } catch (err) {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = createHttpError(500, (err as any).cause?.detail);
      throw error;
    }
  }
}
