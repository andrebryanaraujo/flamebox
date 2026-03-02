import { NextRequest, NextResponse } from "next/server";

// POST /api/checkout — Create MisticPay PIX transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, payerName, payerDocument, items } = body;

    if (!amount || !payerName || !payerDocument) {
      return NextResponse.json(
        { error: "Campos obrigatórios: amount, payerName, payerDocument" },
        { status: 400 }
      );
    }

    const clientId = process.env.MISTICPAY_CLIENT_ID;
    const clientSecret = process.env.MISTICPAY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "MisticPay não configurado. Defina MISTICPAY_CLIENT_ID e MISTICPAY_CLIENT_SECRET." },
        { status: 500 }
      );
    }

    // Generate a unique transaction ID
    const transactionId = `ORDER-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Build description from items
    const description = items?.length
      ? `Pedido: ${items.map((i: { productName: string; quantity: number }) => `${i.quantity}x ${i.productName}`).join(", ")}`
      : "Pagamento de pedido";

    const misticRes = await fetch("https://api.misticpay.com/api/transactions/create", {
      method: "POST",
      headers: {
        "ci": clientId,
        "cs": clientSecret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        payerName,
        payerDocument: payerDocument.replace(/\D/g, ""), // Remove formatting
        transactionId,
        description,
      }),
    });

    if (!misticRes.ok) {
      const errText = await misticRes.text();
      console.error("MisticPay error:", misticRes.status, errText);
      return NextResponse.json(
        { error: "Erro ao criar pagamento" },
        { status: 502 }
      );
    }

    const misticData = await misticRes.json();

    return NextResponse.json({
      transactionId: misticData.data.transactionId,
      qrCodeBase64: misticData.data.qrCodeBase64,
      qrcodeUrl: misticData.data.qrcodeUrl,
      copyPaste: misticData.data.copyPaste,
      amount: misticData.data.transactionAmount / 100, // API returns in cents
    });
  } catch (error) {
    console.error("POST /api/checkout error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
