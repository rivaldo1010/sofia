import { Router } from "express";
import { prisma } from "../lib/prisma.js";

export const ordersRouter = Router();

async function generateOrderNumber() {
  const year = new Date().getFullYear();
  const count = await prisma.order.count({
    where: { createdAt: { gte: new Date(`${year}-01-01`) } },
  });
  return `PED-${year}-${String(count + 1).padStart(4, "0")}`;
}

ordersRouter.post("/", async (req, res) => {
  try {
    const { items, customer, deliveryMethod, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Carrito vacío" });
    }

    let subtotal = 0;
    let shippingTotal = 0; // 👈 NUEVO: Acumulador de envío
    const validatedItems: any[] = [];

    for (const it of items) {
      const product = await prisma.product.findUnique({
        where: { id: it.productId },
      });

      if (!product || !product.active) {
        return res
          .status(400)
          .json({ error: `Producto no disponible: ${it.productId}` });
      }

      // Fallback: si no hay talla, usar "Única"
      const color = it.color || "Única";
      const size = it.size || "Única";

      const variant = await prisma.variant.findUnique({
        where: {
          productId_color_size: {
            productId: it.productId,
            color,
            size,
          },
        },
      });

      if (!variant || variant.stock < it.quantity) {
        return res.status(400).json({
          error: `Sin stock suficiente: ${product.name} (${color}/${size})`,
        });
      }

      const price = Number(product.price);
      subtotal += price * it.quantity;

      // 👇 NUEVO: Sumar el costo de envío del producto (multiplicado por cantidad)
      // Si el producto no tiene shippingCost configurado, usamos 4.99 por defecto.
      const itemShippingCost = product.shippingCost ? Number(product.shippingCost) : 4.99;
      shippingTotal += itemShippingCost * it.quantity;

      validatedItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: it.quantity,
        color,
        size,
        image: product.images[0],
      });
    }

    // 👇 NUEVO: Si es retiro en tienda, el envío es $0. Si no, usamos el total calculado.
    const shipping = deliveryMethod === "retiro" ? 0 : shippingTotal;
    
    const total = subtotal + shipping;
    const orderNumber = await generateOrderNumber();

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          fullName: customer.fullName,
          phone: customer.phone,
          email: customer.email,
          province: customer.province,
          city: customer.city,
          address: customer.address,
          reference: customer.reference || null,
          deliveryMethod,
          paymentMethod,
          subtotal,
          shipping,
          total,
          items: { create: validatedItems },
        },
        include: { items: true },
      });

      for (const it of validatedItems) {
        await tx.variant.update({
          where: {
            productId_color_size: {
              productId: it.productId,
              color: it.color,
              size: it.size,
            },
          },
          data: { stock: { decrement: it.quantity } },
        });

        await tx.product.update({
          where: { id: it.productId },
          data: {
            stock: { decrement: it.quantity },
            soldCount: { increment: it.quantity },
          },
        });
      }

      return created;
    });

    res.status(201).json(order);
  } catch (err: any) {
    console.error("Error creando pedido:", err);
    res.status(500).json({ error: err.message });
  }
});

ordersRouter.get("/:orderNumber", async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { orderNumber: req.params.orderNumber },
    include: { items: true },
  });
  if (!order) return res.status(404).json({ error: "Pedido no encontrado" });
  res.json(order);
});