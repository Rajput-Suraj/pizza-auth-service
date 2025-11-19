import { pgTable, integer, primaryKey, timestamp } from "drizzle-orm/pg-core";

import { tenants } from "./tenant.ts";
import { usersTable } from "./users.ts";

export const usersToTenants = pgTable(
  "users_to_tenants",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    tenantId: integer("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    // optional: metadata
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.tenantId] })],
);
