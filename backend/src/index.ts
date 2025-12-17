import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.get("/api/items", async (_req: Request, res: Response) => {
  const items = await prisma.item.findMany({ orderBy: { createdAt: "desc" } });
  res.json(items);
});

app.post("/api/items", async (req: Request, res: Response) => {
  const { title } = req.body as { title?: string };
  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ message: "title is required" });
  }

  const item = await prisma.item.create({ data: { title: title.trim() } });
  res.status(201).json(item);
});

app.patch("/api/items/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "invalid id" });

  const { done } = req.body as { done?: boolean };
  if (typeof done !== "boolean") {
    return res.status(400).json({ message: "done boolean is required" });
  }

  const updated = await prisma.item.update({ where: { id }, data: { done } });
  res.json(updated);
});

app.delete("/api/items/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "invalid id" });

  await prisma.item.delete({ where: { id } });
  res.status(204).send();
});

app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ message: "unexpected error" });
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
