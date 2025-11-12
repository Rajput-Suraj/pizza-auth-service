import createHttpError from "http-errors";
import db from "../db/client.ts";
import { usersTable } from "../db/index.ts";
import { Roles } from "../constants/index.ts";
import type { UserData } from "../types/index.ts";

export class UserService {
  async create({ firstName, lastName, email }: UserData) {
    try {
      const result = await db
        .insert(usersTable)
        .values({
          firstName,
          lastName,
          email,
          role: Roles.CUSTOMER,
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
