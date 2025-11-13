import request from "supertest";

import app from "../../src/app";
import db from "../../src/db/client";
import { Roles } from "../../src/constants";
import { usersTable } from "../../src/db/index";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  role?: string | undefined;
  password: string;
}

const userData = {
  firstName: "Suraj",
  lastName: "Rajput",
  email: "example1@gmail.com",
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

      expect(res).toHaveLength(res.length);
    });

    it("should return an ID of the created user", async () => {
      const response = await request(app).post("/auth/register").send({
        firstName: "Bruce",
        lastName: "Wayne",
        email: "bruce4@wayneenterprise.com",
      });
      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("userId");
      expect(typeof response.body.userId).toBe("number");
    });

    it("should assign a customer role", async () => {
      // Arrange
      const userData: UserData = {
        firstName: "Bruce",
        lastName: "Banner",
        email: "brucebanner@gmail.com",
        role: "customer",
        password: "",
      };
      // Act
      const response = await request(app).post("/auth/register").send(userData);
      // Assert
      expect(response.body).toHaveProperty("role");
      expect(response.body.role).toEqual(Roles.CUSTOMER);
    });

    it("should store the hashed password in the database", async () => {
      // Arrange
      const userData: UserData = {
        firstName: "Steve",
        lastName: "Rogers",
        email: "steverogers@gmail.com",
        role: "customer",
        password: "captain-america",
      };
      // Act
      await request(app).post("/auth/register").send(userData);
      // Assert
      const res = await db.select().from(usersTable);
      expect(res.at(-1)?.password).not.toBe(usersTable.password);
    });
  });
  describe("Fields are missing", () => {});
});
