import request from "supertest";
import createJWKSMock from "mock-jwks";

import app from "../../src/app";
import { Roles } from "../../src/constants";

describe("GET /auth/self", () => {
  let jwks: ReturnType<typeof createJWKSMock>;

  beforeAll(() => {
    jwks = createJWKSMock("http://localhost:5501");
  });

  beforeEach(async () => {
    await jwks.start();
  });

  afterEach(async () => {
    await jwks.stop();
  });

  afterAll(async () => {
    await jwks.stop();
  });

  describe("Given all fields", () => {
    it("should return the 200 status code", async () => {
      const response = await request(app).get("/auth/self").send();
      expect(response.statusCode).toBe(200);
    });

    it("should return the user data", async () => {
      // Arrange
      const userData = {
        firstName: "Tom",
        lastName: "Cruise",
        email: "tomcurise@gmail.com",
        role: Roles.CUSTOMER,
        password: "123456789",
      };
      // Act
      const userRes = await request(app).post("/auth/register").send(userData);

      const accessToken = jwks.token({
        sub: String(userRes.body.id),
        role: userRes.body.role,
      });

      const response = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken};`])
        .send();

      //Assert
      expect(response.body.id).toBe(userRes.body.id);
    });
  });
});
