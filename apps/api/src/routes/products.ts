import { Router } from "express";
import { prisma } from "../lib/prisma.js";

export const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  const {
    gender,
    category,
    q,
    sort = "recent",
    page = "1",
    limit = "24",
  } = req.query as Record<string, string>;

  const where: any = { active: true };

  if (gender) where.gender = gender.toUpperCase();
  if (category && category !== "todos") where.category = { slug: category };

  // Búsqueda inteligente: nombre, descripción, marca, color, keywords, categoría
  if (q && q.trim()) {
    const term = q.trim();
    where.OR = [
      { name: { contains: term, mode: "insensitive" } },
      { description: { contains: term, mode: "insensitive" } },
      { brand: { contains: term, mode: "insensitive" } },
      { keywords: { has: term.toLowerCase() } },
      { colors: { has: term.toLowerCase() } },
      { category: { name: { contains: term, mode: "insensitive" } } },
    ];
  }

  const orderBy: any =
    {
      recent: { createdAt: "desc" },
      priceAsc: { price: "asc" },
      priceDesc: { price: "desc" },
      bestSellers: { soldCount: "desc" },
      featured: { featured: "desc" },
    }[sort] || { createdAt: "desc" };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      include: { category: true },
    }),
    prisma.product.count({ where }),
  ]);

  res.json({ items, total, page: Number(page) });
});

productsRouter.get("/:slug", async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { slug: req.params.slug },
    include: { category: true, variants: true },
  });
  if (!product) return res.status(404).json({ error: "No encontrado" });
  res.json(product);
});