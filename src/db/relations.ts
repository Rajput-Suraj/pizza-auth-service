import { relations } from "drizzle-orm";

import { tenants } from "./schemas/tenant.ts";
import { usersTable } from "./schemas/users.ts";
import { usersToTenants } from "./schemas/usersToTenants.ts";

export const usersRelations = relations(usersTable, ({ many }) => ({
  usersToTenants: many(usersToTenants),
}));

export const tenantsRelations = relations(tenants, ({ many }) => ({
  usersToTenants: many(usersToTenants),
}));

export const usersToTenantsRelations = relations(usersToTenants, ({ one }) => ({
  user: one(usersTable, {
    fields: [usersToTenants.userId],
    references: [usersTable.id],
  }),
  tenant: one(tenants, {
    fields: [usersToTenants.tenantId],
    references: [tenants.id],
  }),
}));
