import { Router } from "express";
import { prisma } from "../lib/prisma.js";

export const configRouter = Router();

// Configuración pública (solo datos que el cliente necesita)
configRouter.get("/", async (_req, res) => {
  try {
    let config = await prisma.config.findUnique({ where: { id: "global" } });

    // Si no existe, la creamos con valores por defecto
    if (!config) {
      config = await prisma.config.create({
        data: {
          id: "global",
          whatsappNumber: "+593963735413",
          storeName: "Sofía",
          currency: "USD",
        },
      });
    }

    res.json({
      whatsappNumber: config.whatsappNumber,
      storeName: config.storeName,
      currency: config.currency,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});