import { pgTable, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }),
  email: varchar({ length: 25 }).notNull().unique(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
