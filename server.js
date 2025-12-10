import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 8080;

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ ok: true, service: "users_api_v1", status: "users_api" });
});

// GET /users
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (e) {
    console.error("GET /users error:", e);
    res.status(500).json({
      error: "failed_to_list_users",
      message: e.message
    });
  }
});

// POST /users
app.post("/users", async (req, res) => {
  const { email, name } = req.body;

  try {
    const user = await prisma.user.create({
      data: { email, name }
    });
    res.status(201).json(user);
  } catch (e) {
    console.error("POST /users error:", e);
    res.status(500).json({
      error: "failed_to_create_user",
      message: e.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Users API running on port ${PORT}`);
});
