import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, service: "users_api_v1", status: "users_api" });
});

// GET /users - إرجاع كل المستخدمين
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error("Error in GET /users:", err);
    res.status(500).json({ error: "failed_to_list_users" });
  }
});

// POST /users - إنشاء مستخدم جديد
app.post("/users", async (req, res) => {
  try {
    const { email, name } = req.body;
    const user = await prisma.user.create({
      data: { email, name }
    });
    res.json(user);
  } catch (err) {
    console.error("Error in POST /users:", err);
    res.status(500).json({ error: "failed_to_create_user" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Users API running on port ${PORT}`);
});
