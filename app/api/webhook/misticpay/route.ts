import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/webhook/misticpay — Receive MisticPay deposit notifications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { transactionId, status } = body;

    if (!transactionId || !status) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    // Only process completed deposits
    if (status !== "COMPLETO") {
      return NextResponse.json({ message: "Status ignorado", status });
    }

    // Find order by transactionId
    const order = await prisma.order.findUnique({
      where: { transactionId: String(transactionId) },
    });

    if (!order) {
      console.warn(`[Webhook] Pedido não encontrado para transactionId: ${transactionId}`);
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    // Update order status to "Entregue"
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "Entregue" },
    });

    console.log(`[Webhook] Pedido ${order.orderNumber} marcado como Entregue (txn: ${transactionId})`);

    return NextResponse.json({ message: "OK", orderNumber: order.orderNumber });
  } catch (error) {
    console.error("[Webhook] Erro:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
