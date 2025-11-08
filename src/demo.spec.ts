import request from "supertest";

import { add } from "./server.ts";
import app from "./app.ts";

describe.skip("Add", () => {
  it("adds two numbers", () => {
    expect(add(1, 2)).toBe(3);
  });

  it("Should work", async () => {
    const res = await request(app).get("/").send();
    expect(res.statusCode).toBe(200);
  });
});
