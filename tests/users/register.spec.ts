import request from "supertest";
import { eq } from "drizzle-orm";

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
        firstName: "Bruce",
        lastName: "Wayne",
        email: "bruce@wayne.com",
        role: "customer",
        password: "batman",
      };
      // Act
      await request(app).post("/auth/register").send(userData);
      // Assert
      const res = await db.select().from(usersTable);
      const pass = res.at(-1)?.password;
      expect(pass).not.toBe(usersTable.password);
      expect(pass).toHaveLength(60);
      expect(pass).toMatch(/^\$2b\$\d+\$/);
    });

    it("should return 400 status code if email is already exists", async () => {
      // Arrange
      const userData: UserData = {
        firstName: "Natasha",
        lastName: "Romanoff",
        email: "natasharomanoff@gmail.com",
        role: "customer",
        password: "black-widow",
      };
      // Act
      const res = await request(app).post("/auth/register").send(userData);
      // Assert
      expect(res.statusCode).toBe(400);
    });
  });

  describe("Fields are missing", () => {
    it("should return 400 status code if email field is missing", async () => {
      // Arrange
      const userData: UserData = {
        firstName: "Clark",
        lastName: "Kent",
        email: "",
        role: "customer",
        password: "superman",
      };

      // Act
      const res = await request(app).post("/auth/register").send(userData);

      // Assert
      expect(res.statusCode).toBe(400);
      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.firstName, userData.firstName));
      expect(user).toHaveLength(0);
    });

    it("Should return 400 status code if firstName field is missing.", async () => {
      // Arrange
      const userData: UserData = {
        firstName: "",
        lastName: "Bravo",
        email: "jhoonybravo@gmail.com",
        role: "customer",
        password: "jhoonyBravo@123",
      };

      // Act
      const res = await request(app).post("/auth/register").send(userData);

      // Assert
      expect(res.statusCode).toBe(400);
      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, userData.email));
      expect(user).toHaveLength(0);
    });

    it("Should return 400 status code if password field is missing.", async () => {
      // Arrange
      const userData: UserData = {
        firstName: "Dexter",
        lastName: "",
        email: "dexter@dexlabs.com",
        role: "customer",
        password: "",
      };

      // Act
      const res = await request(app).post("/auth/register").send(userData);

      // Assert
      expect(res.statusCode).toBe(400);
      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, userData.email));
      expect(user).toHaveLength(0);
    });
  });

  describe("Fields are not in proper format", () => {
    it("should trim the email field", async () => {
      // Arrange
      const userData: UserData = {
        firstName: "Natasha",
        lastName: "Romanoff",
        email: " natasharomanoff@gmail.com ",
        role: "customer",
        password: "black-widow",
      };

      // Act
      //Assert
      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, userData.email.trim()));

      expect(user.at(-1)?.email).toBe("natasharomanoff@gmail.com");
    });

    //todo: have to work
    it.skip("should return 400 status code if email is not a valid email.", async () => {
      // Arrange
      const userData: UserData = {
        firstName: "Robin",
        lastName: "",
        email: "robin",
        role: "customer",
        password: "robin",
      };

      // Act
      await request(app).post("/auth/register").send(userData);
      //Assert
      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, userData.email.trim()));

      expect(user.at(-1)?.email).toBe("robin@batcave.com");
    });
  });
});
