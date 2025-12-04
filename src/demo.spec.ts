import request from "supertest";

import app from "./app.ts";

describe.skip("App", () => {
  it("Should work", async () => {
    const res = await request(app).get("/").send();
    expect(res.statusCode).toBe(200);
  });
});
