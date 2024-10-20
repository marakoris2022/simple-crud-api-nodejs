import request from "supertest";
import server from "../src/server";
import { UserProps } from "../src/database/db";

describe("Users API", () => {
  let createdUserId = "";

  afterAll((done) => {
    server.close(done);
  });

  it("GET /api/users should return an empty array", async () => {
    const response = await request(server).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("POST /api/users should create a new user", async () => {
    const newUser: UserProps = {
      username: "John Doe",
      age: 23,
      hobbies: ["hobbs1, hobbs2"],
      id: "test",
    };

    const response = await request(server)
      .post("/api/users")
      .send(newUser)
      .set("Content-Type", "application/json");

    expect(response.status).toBe(201);
    expect(response.body.data).toMatchObject(newUser);

    createdUserId = JSON.parse(
      (await request(server).get("/api/users")).text
    )[0].id;
  });

  it("GET /api/users/:userId should return the created user", async () => {
    const response = await request(server).get(`/api/users/${createdUserId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", createdUserId);
    expect(response.body).toHaveProperty("username", "John Doe");
    expect(response.body).toHaveProperty("age", 23);
  });

  it("PUT /api/users/:userId should update the user", async () => {
    const updatedUser: UserProps = {
      username: "John Update",
      age: 33,
      hobbies: ["hobbs1222", "test2"],
    };

    const response = await request(server)
      .put(`/api/users/${createdUserId}`)
      .send(updatedUser)
      .set("Content-Type", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject(updatedUser);
    expect(response.body.data.id).toBe(createdUserId); // ID should remain the same
  });

  it("DELETE /api/users/:userId should delete the user", async () => {
    const response = await request(server).delete(
      `/api/users/${createdUserId}`
    );
    expect(response.status).toBe(204);
  });

  it("GET /api/users/:userId should return 404 for deleted user", async () => {
    const response = await request(server).get(`/api/users/${createdUserId}`);
    expect(response.status).toBe(404);
    expect(response.text).toContain("No user found");
  });
});
