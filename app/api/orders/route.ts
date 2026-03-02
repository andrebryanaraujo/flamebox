import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orderSchema } from "@/lib/validations";

// GET /api/orders — list orders (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: "insensitive" } },
        { customerEmail: { contains: search, mode: "insensitive" } },
        { orderNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ error: "Erro ao buscar pedidos" }, { status: 500 });
  }
}

// POST /api/orders — create an order (checkout)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Generate order number
    const count = await prisma.order.count();
    const orderNumber = `NV-${String(count + 1).padStart(4, "0")}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: parsed.data.customerName,
        customerEmail: parsed.data.customerEmail,
        total: parsed.data.total,
        paymentMethod: parsed.data.paymentMethod ?? "PIX",
        transactionId: parsed.data.transactionId ?? null,
        items: {
          create: parsed.data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            productName: item.productName,
          })),
        },
      },
      include: { items: true },
    });

    // Decrease stock for each product
    for (const item of parsed.data.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: "Erro ao criar pedido" }, { status: 500 });
  }
}
