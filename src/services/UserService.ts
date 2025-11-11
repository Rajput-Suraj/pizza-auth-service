import db from "../../db/index.ts";
import { usersTable } from "../../db/users.ts";
import type { UserData } from "../types/index.ts";

export class UserService {
  async create({ firstName, lastName, email }: UserData) {
    await db.insert(usersTable).values({ firstName, lastName, email });
  }
}
