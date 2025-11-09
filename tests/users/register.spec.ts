import request from "supertest";

import app from "../../src/app";
import db from "../../db/index";
import { usersTable } from "../../db/users";

const userData = {
  firstName: "Suraj",
  lastName: "Rajput",
  email: "example@gmail.com",
  password: "123456",
};

describe("POST /auth/register", () => {
  describe("Given all fields", () => {
    it("should return the 201 status code", async () => {
      // Arrange
      // Add userData here
      // Act
      const response = await request(app).post("/auth/register").send(userData);
      // Assert
      expect(response.statusCode).toBe(201);
    });

    it("should return valid JSON response", async () => {
      const response = await request(app).post("/auth/register").send(userData);
      // Assert
      expect(
        (response.headers as Record<string, string>)["content-type"],
      ).toEqual(expect.stringContaining("json"));
    });

    it("should persist the user in the database", async () => {
      const res = await db.select().from(usersTable);

      expect(res).toHaveLength(1);
    });
  });
  describe("Fields are missing", () => {});
});
