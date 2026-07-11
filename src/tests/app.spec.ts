import request from "supertest";
import app from "../app";

describe("App basic routes", () => {
  it("returns 404 JSON for unknown routes", async () => {
    const res = await request(app)
      .get("/this-route-does-not-exist")
      .expect(404);
    expect(res.body).toHaveProperty("error", "Not Found");
    expect(res.body).toHaveProperty(
      "message",
      `Cannot GET /this-route-does-not-exist`,
    );
  });

  it("serves Swagger UI at /api-docs", async () => {
    const res = await request(app).get("/api-docs").redirects(1).expect(200);
    const text = (res.text || "").toLowerCase();
    expect(text).toContain("swagger");
    expect(res.headers["content-type"]).toMatch(/html/);
  });
});
