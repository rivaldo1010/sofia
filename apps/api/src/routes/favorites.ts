import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

export const favoritesRouter = Router();

favoritesRouter.use(requireAuth);

favoritesRouter.get("/", async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user!.id },
      include: {
        product: { include: { category: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(favorites.map((f) => f.product));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

favoritesRouter.get("/ids", async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user!.id },
      select: { productId: true },
    });
    res.json(favorites.map((f) => f.productId));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

favoritesRouter.post("/:productId", async (req, res) => {
  try {
    const favorite = await prisma.favorite.upsert({
      where: {
        userId_productId: {
          userId: req.user!.id,
          productId: req.params.productId,
        },
      },
      update: {},
      create: {
        userId: req.user!.id,
        productId: req.params.productId,
      },
    });
    res.json(favorite);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

favoritesRouter.delete("/:productId", async (req, res) => {
  try {
    await prisma.favorite.deleteMany({
      where: {
        userId: req.user!.id,
        productId: req.params.productId,
      },
    });
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});