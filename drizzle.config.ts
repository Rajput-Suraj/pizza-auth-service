import "dotenv/config";
import { defineConfig } from "drizzle-kit";

import { Config } from "./src/config/index";

export default defineConfig({
  out: "./drizzle",
  schema: "./db/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: Config.DATABASE_URL!,
  },
});
