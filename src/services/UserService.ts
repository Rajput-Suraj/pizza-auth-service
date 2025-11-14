import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { eq } from "drizzle-orm";

import db from "../db/client.ts";
import { usersTable } from "../db/index.ts";
import { Roles } from "../constants/index.ts";
import type { UserData } from "../types/index.ts";

export class UserService {
  async create({ firstName, lastName, email, password }: UserData) {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!user) {
      const err = createHttpError(400, "Email is already exists!");
      throw err;
    }

    //Hash the password
    const saltRounds = 10;
    const hasedPassword = await bcrypt.hash(password, saltRounds);
    try {
      const result = await db
        .insert(usersTable)
        .values({
          firstName,
          lastName,
          email,
          role: Roles.CUSTOMER,
          password: hasedPassword,
        })
        .returning({
          userId: usersTable.id,
          role: usersTable.role,
        });

      return result[0];
    } catch (err) {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = createHttpError(500, (err as any).cause?.detail);
      throw error;
    }
  }
}
