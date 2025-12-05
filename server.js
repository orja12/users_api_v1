
import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());
const db = new PrismaClient();

app.get("/", (req, res) => res.json({ ok: true, message: "Users API working" }));

// Create user
app.post("/users", async (req, res) => {
  try {
    const user = await db.user.create({ data: req.body });
    res.json(user);
  } catch (e) {
    res.json({ error: String(e) });
  }
});

// Read users
app.get("/users", async (req, res) => {
  const users = await db.user.findMany();
  res.json(users);
});

// Read user by ID
app.get("/users/:id", async (req, res) => {
  const user = await db.user.findUnique({
    where: { id: Number(req.params.id) }
  });
  res.json(user);
});

// Update user
app.put("/users/:id", async (req, res) => {
  const user = await db.user.update({
    where: { id: Number(req.params.id) },
    data: req.body
  });
  res.json(user);
});

// Delete user
app.delete("/users/:id", async (req, res) => {
  const user = await db.user.delete({
    where: { id: Number(req.params.id) }
  });
  res.json(user);
});

app.listen(3000, () => console.log("Users API running on port 3000"));
