import db from "../../db/index.ts";
import { usersTable } from "../../db/users.ts";
import type { UserData } from "../types/index.ts";

export class UserService {
  async create({ firstName, lastName, email }: UserData) {
    const result = await db
      .insert(usersTable)
      .values({ firstName, lastName, email })
      .returning({ userId: usersTable.id });

    return result[0];
  }
}
