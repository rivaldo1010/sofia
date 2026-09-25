import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import os from "os";
import { prisma } from "./lib/prisma.js";
import { productsRouter } from "./routes/products.js";
import { ordersRouter } from "./routes/orders.js";
import { authRouter } from "./routes/auth.js";
import { adminRouter } from "./routes/admin.js";
import { favoritesRouter } from "./routes/favorites.js";
import { configRouter } from "./routes/config.js";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(helmet());
app.use(cors({ origin: process.env.WEB_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use("/api", rateLimit({ windowMs: 60_000, max: 200 }));

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "connected", timestamp: new Date() });
  } catch (err) {
    res.status(500).json({ status: "error", db: "disconnected" });
  }
});

// ⬇️ Rutas
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/config", configRouter);

app.listen(PORT, "0.0.0.0", () => {
  console.log("API Sofía corriendo en http://localhost:" + PORT + "/api");
  console.log("Acceso desde red local:");
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        console.log("  → http://" + net.address + ":" + PORT + "/api");
      }
    }
  }
});