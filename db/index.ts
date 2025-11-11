import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

import { usersTable } from "./users.ts";

const db = drizzle(process.env.DATABASE_URL!);

export default db;
export { usersTable };
