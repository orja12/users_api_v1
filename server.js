import express from "express";
import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

try {
  console.log("Running: npx prisma db push");
  execSync("npx prisma db push", { stdio: "inherit" });
} catch (e) {
  console.error("Prisma db push failed:", e.message || e);
}

app.get("/", (req, res) => {
  res.json({ ok: true, service: "users_api_v1", status: "users_api" });
});

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
    res.json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "failed_to_list_users" });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ error: "user_not_found" });
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "failed_to_get_user" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { email, name } = req.body;
    const user = await prisma.user.create({ data: { email, name } });
    res.status(201).json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "failed_to_create_user" });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const { email, name } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { email, name }
    });
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "failed_to_update_user" });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "failed_to_delete_user" });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Users API running on port", port);
});
