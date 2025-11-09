import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

import { usersTable } from "./users";

const db = drizzle(process.env.DATABASE_URL!);

export default db;
export { usersTable };
