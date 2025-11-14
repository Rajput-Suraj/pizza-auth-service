import { pgTable, integer, timestamp } from "drizzle-orm/pg-core";

import { usersTable } from "./users.ts";

export const refreshTokenTable = pgTable("refresh_token", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  expiresAt: timestamp("expires_at").notNull(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
