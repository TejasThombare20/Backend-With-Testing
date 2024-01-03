import supertest from "supertest";
import app from "../index.js";
import note from "../modals/note.js";
import user from "../modals/user.js";
import { connectToDB } from "../utils/db.js";

beforeEach(async () => {
  await connectToDB();
});

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU5MzAzNWYwOWIxY2E3NTY4MTQ4YWE2In0sImlhdCI6MTcwNDIxNDI0M30.PpvtysRxJMIWQ8GrE-ryq0Px0STwY1BPIzWv4pubegk";

describe("Testing for register user operation", () => {
  test("should return 400 if incomplete data is provided", async () => {
    const response = await supertest(app).post("/api/auth/register").send({});
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "incomplete data" });
  });

  test("should return 400 if user already exists", async () => {
    const response = await supertest(app)
      .post("/api/auth/register")
      .send({ email: "tejas@gmail.com", password: "@testing" });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "user already exists" });
  });

  test("should return 200 if user register successfully", async () => {
    const response = await supertest(app)
      .post("/api/auth/register")
      .send({ email: "testing1@gmail.com", password: "@testing" });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: " user has been created" });
  });
});

describe("Testing for Login user operation", () => {
  test("should return 404 if incomplete data is provided", async () => {
    const response = await supertest(app).post("/api/auth/login").send({});
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "enter required field" });
  });

  test("should return 404 if invalid email  is provided", async () => {
    const response = await supertest(app).post("/api/auth/login").send({
      email: "Invalid@gmail.com",
      password: "@testing",
    });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "User not found !" });
  });

  test("should return 400 if invalid credentials is provided", async () => {
    const response = await supertest(app).post("/api/auth/login").send({
      email: "johnDoe@gmail.com",
      password: "Invalidpassword",
    });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid credentils" });
  });


  describe("Testing for Login user operation" , ()=>{

    test("should return 400 if invalid credentials is provided", async () => {
      const response = await supertest(app).post("/api/auth/logout").set( "Cookie" , [""])
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "user logout successfully" });
    });

  })

  test("should return 400 if invalid credentials is provided", async () => {
    const response = await supertest(app).post("/api/auth/login").send({
      email: "johnDoe@gmail.com",
      password: "johnpassword",
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Logged in successfully" });
  });
});

describe("Testing for GET NOTE operation", () => {
  test("get complete notes", async () => {
    await supertest(app)
      .get("/api/notes/getnotes")
      .expect(200)
      .then(async (response) => {
        await expect(response).toBeTruthy();
        await expect(response.body.notes).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              user: expect.any(String),
              title: expect.any(String),
              content: expect.any(String),
              tag: expect.any(String),
            }),
          ])
        );
      });
  });

  test("get note with note Id ", async () => {
    await supertest(app)
      .get("/api/notes/getnote/6593193d88db6e3c2aefa999")
      .expect(200)
      .then(async (response) => {
        await expect(response).toBeTruthy();
        await expect(response.body).toEqual(
          expect.objectContaining({
            message: expect.any(String),
            note: expect.any(Object),
          })
        );
      });
  });

  test("should return 400 if Invalid  type of noteId", async () => {
    const response = await supertest(app).get("/api/notes/getnote/:NoteId");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid  type of noteId" });
  });
});

describe("Testing for ADD NOTE operation", () => {
  test("should return 401 if user is not authenticated", async () => {
    const response = await supertest(app)
      .post("/api/notes/add")
      .send({ title: "Test Title", content: "Test Content", tag: "tag" });
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Unauthorized" });
  });

  test("should return 400 if invalid userId is provided", async () => {
    const response = await supertest(app)
      .post("/api/notes/add")
      .set("cookies", " Invalid access_token")
      .send({ title: "Test Title", content: "Test Content" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Unauthorized" });
  });
  test("should return 404 if title or content is missing", async () => {
    const response = await supertest(app)
      .post("/api/notes/add")
      .set("Cookie", [`access_token=${token}`])
      .send({ content: "Test Content" });
    console.log(response.status);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "provide required fields" });
  });

  test("should return 200 if add a new note successfully", async () => {
    const response = await supertest(app)
      .post("/api/notes/add")
      .set("Cookie", [`access_token=${token}`])
      .send({ title: "Title", content: "Test Content", tag: "Tag" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("new note added successfully");
    expect(response.body.newNote.title).toBe("Title");
    expect(response.body.newNote.content).toBe("Test Content");
    expect(response.body.newNote.tag).toBe("Tag");
  });
});

describe("Testing for UPDATE NOTE OPERATION", () => {
  test("should return 401 if user is not authenticated", async () => {
    const response = await supertest(app).put(
      "/api/notes/update/6594f6989a5dde8c83b2dd61"
    );
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Unauthorized" });
  });

  test("should return 400 if Invalid  type of noteId", async () => {
    const response = await supertest(app)
      .put("/api/notes/update/NoteId")
      .set("Cookie", [`access_token=${token}`]);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid  type of noteId" });
  });

  test("should return 404 if no fields to update are provided", async () => {
    const response = await supertest(app)
      .put("/api/notes/update/6594f6989a5dde8c83b2dd61")
      .set("Cookie", [`access_token=${token}`])
      .send({});
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Nothing to update" });
  });
  test("should return 400 if noteID is invalid", async () => {
    const response = await supertest(app)
      .put("/api/notes/update/6593035f09b1ca7568148aa6")
      .set("Cookie", [`access_token=${token}`])
      .send({
        title: "u_Title",
        content: "updated Test Content",
        tag: "uTag",
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Note not found" });
  });

  test("should return 200 if add a existing note update successfully", async () => {
    const response = await supertest(app)
      .put("/api/notes/update/6593193d88db6e3c2aefa999")
      .set("Cookie", [`access_token=${token}`])
      .send({
        title: "u_Title",
        content: "updated Test Content",
        tag: "uTag",
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Note updated successfully");
    expect(response.body.updatedNote.title).toBe("u_Title");
    expect(response.body.updatedNote.content).toBe("updated Test Content");
    expect(response.body.updatedNote.tag).toBe("uTag");
  });
});

describe("Testing for DELETE Note Operation", () => {
  test("should return 401 if user is not authenticated", async () => {
    const response = await supertest(app).delete(
      "/api/notes/delete/6594f6989a5dde8c83b2dd61"
    );
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Unauthorized" });
  });

  test("should return 400 if Invalid  type of noteId", async () => {
    const response = await supertest(app)
      .delete("/api/notes/delete/NoteId")
      .set("Cookie", [`access_token=${token}`]);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid  type of noteId" });
  });

  test("should delete a note successfully", async () => {
    const response = await supertest(app)
      .delete("/api/notes/delete/6594f6989a5dde8c83b2dd61")
      .set("Cookie", [`access_token=${token}`]);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Note deleted Successfully");
  });
});
