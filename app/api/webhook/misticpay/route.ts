import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/webhook/misticpay — Receive MisticPay deposit notifications
 *
 * Payload:
 * {
 *   "transactionId": 31484480,
 *   "transactionType": "DEPOSITO",
 *   "transactionMethod": "PIX",
 *   "clientName": "Nome do cliente",
 *   "clientDocument": "12345678909",
 *   "status": "COMPLETO",
 *   "value": 455,
 *   "fee": 23
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      transactionId,
      transactionType,
      transactionMethod,
      clientName,
      status,
      value,
      fee,
    } = body;

    console.log(`[Webhook MisticPay] Recebido — txn: ${transactionId}, type: ${transactionType}, method: ${transactionMethod}, status: ${status}, value: ${value}, fee: ${fee}, client: ${clientName}`);

    // Validate required fields
    if (!transactionId || !status) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    // Only process deposit webhooks
    if (transactionType && transactionType !== "DEPOSITO") {
      console.log(`[Webhook MisticPay] Tipo ignorado: ${transactionType}`);
      return NextResponse.json({ message: "Tipo ignorado", transactionType });
    }

    // Only process completed deposits
    if (status !== "COMPLETO") {
      console.log(`[Webhook MisticPay] Status ignorado: ${status}`);
      return NextResponse.json({ message: "Status ignorado", status });
    }

    // Find order by transactionId
    const order = await prisma.order.findUnique({
      where: { transactionId: String(transactionId) },
    });

    if (!order) {
      console.warn(`[Webhook MisticPay] Pedido não encontrado para txn: ${transactionId}`);
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    // Already processed — skip
    if (order.status === "Pago" || order.status === "Entregue") {
      console.log(`[Webhook MisticPay] Pedido ${order.orderNumber} já processado (status: ${order.status})`);
      return NextResponse.json({ message: "Já processado", orderNumber: order.orderNumber });
    }

    // Update order status to "Pago"
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "Pago" },
    });

    console.log(`[Webhook MisticPay] ✅ Pedido ${order.orderNumber} marcado como Pago (txn: ${transactionId}, valor: ${value}, fee: ${fee})`);

    return NextResponse.json({ message: "OK", orderNumber: order.orderNumber });
  } catch (error) {
    console.error("[Webhook MisticPay] Erro:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
