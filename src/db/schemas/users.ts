import { pgTable, varchar, integer, timestamp } from "drizzle-orm/pg-core";

import { tenants } from "./tenant.ts";

export const usersTable = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }),
  email: varchar({ length: 25 }).notNull().unique(),
  role: varchar("role", { length: 50 }),
  password: varchar({ length: 255 }).notNull().default(""),
  created_at: timestamp("created_at").defaultNow().notNull(),
  tenant: integer()
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
});
