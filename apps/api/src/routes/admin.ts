import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import multer from "multer";

export const adminRouter = Router();

// Todas las rutas requieren admin
adminRouter.use(requireAuth, requireAdmin);

// Config multer — 15 MB para aceptar fotos de celular
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

adminRouter.get("/stats", async (_req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      salesToday,
      salesMonth,
      totalOrders,
      pendingOrders,
      totalProducts,
      productsSold,
      lowStock,
      totalUsers,
      recentOrders,
    ] = await Promise.all([
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfDay }, status: { not: "CANCELADO" } },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfMonth }, status: { not: "CANCELADO" } },
        _sum: { total: true },
      }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDIENTE" } }),
      prisma.product.count({ where: { active: true } }),
      prisma.orderItem.aggregate({ _sum: { quantity: true } }),
      prisma.product.count({ where: { active: true, stock: { lt: 10 } } }),
      prisma.user.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          fullName: true,
          total: true,
          status: true,
        },
      }),
    ]);

    res.json({
      salesToday: Number(salesToday._sum.total || 0),
      salesMonth: Number(salesMonth._sum.total || 0),
      totalOrders,
      pendingOrders,
      totalProducts,
      productsSold: productsSold._sum.quantity || 0,
      lowStock,
      totalUsers,
      recentOrders,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ==================== PRODUCTOS ====================

adminRouter.get("/products", async (req, res) => {
  try {
    const { q, gender, category } = req.query as Record<string, string>;
    const where: any = {};

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { sku: { contains: q, mode: "insensitive" } },
      ];
    }
    if (gender && gender !== "todos") where.gender = gender;
    if (category && category !== "todos") where.categoryId = category;

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

adminRouter.get("/products/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true, variants: true },
    });
    if (!product) return res.status(404).json({ error: "No encontrado" });
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

adminRouter.post("/products", async (req, res) => {
  try {
    const {
      name, slug, description, price, comparePrice, sku, brand,
      gender, categoryId, images, colorImages, colors, sizes, keywords,
      stock, featured, isNew, active,
    } = req.body;

    if (!name || !slug || !price || !sku || !gender || !categoryId) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const product = await prisma.product.create({
      data: {
        name, slug,
        description: description || "",
        price: Number(price),
        comparePrice: comparePrice ? Number(comparePrice) : null,
        sku,
        brand: brand || null,
        gender,
        categoryId,
        images: images || [],
        colorImages: colorImages || null,
        colors: colors || [],
        sizes: sizes || [],
        keywords: keywords || [],
        stock: Number(stock) || 0,
        featured: !!featured,
        isNew: !!isNew,
        active: active !== false,
      },
      include: { category: true },
    });

    const cols = colors || [];
    const szs = sizes || [];
    if (cols.length && szs.length) {
      const stockPerVariant = Math.max(
        1,
        Math.floor((Number(stock) || 0) / (cols.length * szs.length))
      );
      for (const color of cols) {
        for (const size of szs) {
          await prisma.variant.create({
            data: { productId: product.id, color, size, stock: stockPerVariant },
          });
        }
      }
    }

    res.status(201).json(product);
  } catch (err: any) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "El slug o SKU ya existe" });
    }
    res.status(500).json({ error: err.message });
  }
});

adminRouter.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (data.stock !== undefined) data.stock = Number(data.stock);
    if (data.price !== undefined) data.price = Number(data.price);
    if (data.comparePrice) data.comparePrice = Number(data.comparePrice);
    else if (data.comparePrice === "" || data.comparePrice === null)
      data.comparePrice = null;

    if (data.colorImages === undefined) delete data.colorImages;
    else if (data.colorImages === "") data.colorImages = null;

    const product = await prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

adminRouter.delete("/products/:id", async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

adminRouter.get("/categories", async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: [{ gender: "asc" }, { name: "asc" }],
  });
  res.json(categories);
});

// ==================== PEDIDOS ====================

adminRouter.get("/orders", async (_req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

adminRouter.put("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ["PENDIENTE", "CONFIRMADO", "PREPARANDO", "ENVIADO", "ENTREGADO", "CANCELADO"];
    if (!valid.includes(status)) {
      return res.status(400).json({ error: "Estado inválido" });
    }
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: { items: true },
    });
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== INVENTARIO ====================

adminRouter.get("/inventory", async (_req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: { stock: "asc" },
    });
    res.json({ products });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== CLIENTES ====================

adminRouter.get("/customers", async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
    });

    const customers = await Promise.all(
      users.map(async (u) => {
        const orders = await prisma.order.findMany({
          where: { userId: u.id, status: { not: "CANCELADO" } },
          select: { total: true },
        });
        const totalSpent = orders.reduce((a, o) => a + Number(o.total), 0);
        return {
          id: u.id,
          email: u.email,
          name: u.name,
          phone: u.phone,
          role: u.role,
          createdAt: u.createdAt,
          ordersCount: u._count.orders,
          totalSpent,
        };
      })
    );

    res.json(customers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== UPLOAD DE IMÁGENES ====================

adminRouter.post(
  "/upload",
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        console.error("Error de multer:", err);
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            error: "La imagen pesa más de 15 MB. Intenta con una más pequeña.",
          });
        }
        return res.status(400).json({
          error: err.message || "Error al procesar la imagen",
        });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No se recibió archivo" });
      }

      console.log(
        "Archivo recibido:",
        req.file.originalname,
        req.file.size,
        "bytes"
      );

      const apiKey = process.env.IMGBB_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "IMGBB_API_KEY no configurada" });
      }

      const base64 = req.file.buffer.toString("base64");

      const formData = new URLSearchParams();
      formData.append("image", base64);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!data.success) {
        return res
          .status(500)
          .json({ error: data.error?.message || "Error en imgbb" });
      }

      res.json({
        url: data.data.display_url,
        deleteUrl: data.data.delete_url,
        thumb: data.data.thumb?.url,
      });
    } catch (err: any) {
      console.error("Error subiendo imagen:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

// ==================== INFO DEL SISTEMA ====================

adminRouter.get("/settings-info", async (_req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
    ]);

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      currency: "USD",
      country: "Ecuador",
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== CONFIGURACIÓN ====================

adminRouter.get("/config", async (_req, res) => {
  try {
    let config = await prisma.config.findUnique({ where: { id: "global" } });
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
    res.json(config);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

adminRouter.put("/config", async (req, res) => {
  try {
    const { whatsappNumber, whatsappMessage, storeName, currency } = req.body;

    const config = await prisma.config.upsert({
      where: { id: "global" },
      update: { whatsappNumber, whatsappMessage, storeName, currency },
      create: {
        id: "global",
        whatsappNumber,
        whatsappMessage,
        storeName,
        currency: currency || "USD",
      },
    });

    res.json(config);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});