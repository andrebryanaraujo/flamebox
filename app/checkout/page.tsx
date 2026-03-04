"use client";

import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/data";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CheckCircle, Copy, Clock, Loader2 } from "lucide-react";

interface PaymentData {
  transactionId: string;
  qrCodeBase64: string;
  qrcodeUrl: string;
  copyPaste: string;
  amount: number;
}

export default function CheckoutPage() {
  const { cartTotal, items, clearCart } = useCart();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  // Payer form
  const [payerName, setPayerName] = useState("");
  const [payerDocument, setPayerDocument] = useState("");

  // Save cart items before we clear
  const savedItems = useRef(items);
  const savedTotal = useRef(cartTotal);
  useEffect(() => {
    if (items.length > 0) {
      savedItems.current = items;
      savedTotal.current = cartTotal;
    }
  }, [items, cartTotal]);

  // Normalize cart items for API calls
  const getItemsPayload = () => savedItems.current.map((item) => ({
    productId: item.product.id,
    productName: item.product.name,
    quantity: item.quantity,
    price: item.product.price,
  }));

  // Countdown timer (starts after payment created)
  useEffect(() => {
    if (!paymentData) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [paymentData]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  };

  const handleCopy = () => {
    if (paymentData) {
      navigator.clipboard.writeText(paymentData.copyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (!payerName.trim()) { setError("Informe seu nome."); return; }
    if (payerDocument.replace(/\D/g, "").length !== 11) { setError("Informe um CPF válido."); return; }

    setProcessing(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: savedTotal.current,
          payerName: payerName.trim(),
          payerDocument: payerDocument.replace(/\D/g, ""),
          items: getItemsPayload(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao gerar pagamento.");
        setProcessing(false);
        return;
      }

      const data = await res.json();
      setPaymentData(data);

      // Create order and clear cart
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: payerName.trim(),
          customerEmail: "cliente@email.com",
          total: savedTotal.current,
          paymentMethod: "PIX",
          transactionId: data.transactionId,
          items: getItemsPayload(),
        }),
      });
      if (!orderRes.ok) {
        const orderErr = await orderRes.json().catch(() => ({ error: "Erro ao registrar pedido." }));
        // Log for debugging — PIX was already generated so we still show QR
        console.error("Erro ao criar pedido:", orderErr);
      }

      clearCart();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    }
    setProcessing(false);
  };

  // Empty cart and no payment = no order
  if (items.length === 0 && !paymentData && !processing) {
    return (
      <div className="container-main">
        <div className="cart-empty">
          <div className="cart-empty-icon">✅</div>
          <h2 className="cart-empty-title">Nenhum pedido em aberto</h2>
          <p className="cart-empty-text">Adicione produtos ao carrinho para fazer um pedido.</p>
          <Link href="/" className="btn-back-home">Voltar à loja</Link>
        </div>
      </div>
    );
  }

  // Payment created — show QR Code
  if (paymentData) {
    return (
      <div className="container-main">
        <div className="checkout-layout">
          <div className="checkout-card">
            <h2 className="checkout-title">💳 Pagamento via PIX</h2>

            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              Escaneie o QR Code ou copie o código abaixo para pagar
            </p>

            {/* QR Code */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1.25rem",
            }}>
              {paymentData.qrCodeBase64 ? (
                <img
                  src={paymentData.qrCodeBase64}
                  alt="QR Code PIX"
                  style={{
                    width: 220,
                    height: 220,
                    borderRadius: 12,
                    background: "white",
                    padding: 8,
                  }}
                />
              ) : paymentData.qrcodeUrl ? (
                <img
                  src={paymentData.qrcodeUrl}
                  alt="QR Code PIX"
                  style={{
                    width: 220,
                    height: 220,
                    borderRadius: 12,
                    background: "white",
                    padding: 8,
                  }}
                />
              ) : (
                <div className="pix-qr"><div className="pix-qr-inner" /></div>
              )}
            </div>

            <div style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--purple-light)" }}>
              {formatPrice(savedTotal.current)}
            </div>

            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
              ID: {paymentData.transactionId}
            </p>

            <div className="pix-code">{paymentData.copyPaste}</div>

            <button className="btn-copy" onClick={handleCopy}>
              {copied ? <><CheckCircle size={14} /> Copiado!</> : <><Copy size={14} /> Copiar código PIX</>}
            </button>

            <div className="checkout-timer">
              <Clock size={14} style={{ verticalAlign: "middle", marginRight: 4 }} />
              Expira em <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Collect payer info
  return (
    <div className="container-main">
      <div className="checkout-layout">
        <div className="checkout-card">
          <h2 className="checkout-title">📋 Dados para Pagamento</h2>

          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
            Informe seus dados para gerar o PIX
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
            <div className="form-group">
              <label className="form-label">Nome Completo *</label>
              <input
                className="form-input"
                placeholder="Seu nome completo"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">CPF *</label>
              <input
                className="form-input"
                placeholder="000.000.000-00"
                value={payerDocument}
                onChange={(e) => setPayerDocument(formatCPF(e.target.value))}
                maxLength={14}
              />
            </div>
          </div>

          {/* Order summary */}
          <div style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border-color)",
            borderRadius: 10,
            padding: "1rem",
            marginBottom: "1.25rem",
          }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem", fontWeight: 600 }}>
              RESUMO DO PEDIDO
            </div>
            {savedItems.current.map((item, i) => (
              <div key={`${item.product.id}-${i}`} style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.82rem",
                padding: "0.25rem 0",
                color: "var(--text-secondary)",
              }}>
                <span>{item.quantity}x {item.product.name}</span>
                <span>{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 700,
              fontSize: "0.95rem",
              marginTop: "0.5rem",
              paddingTop: "0.5rem",
              borderTop: "1px solid var(--border-color)",
              color: "var(--purple-light)",
            }}>
              <span>Total</span>
              <span>{formatPrice(savedTotal.current)}</span>
            </div>
          </div>

          {error && (
            <div style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#ef4444",
              padding: "0.55rem 0.85rem",
              borderRadius: 8,
              fontSize: "0.8rem",
              fontWeight: 500,
              marginBottom: "0.75rem",
            }}>
              {error}
            </div>
          )}

          <button
            className="btn-checkout"
            onClick={handleSubmit}
            disabled={processing}
            style={{ width: "100%", opacity: processing ? 0.7 : 1 }}
          >
            {processing ? (
              <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Gerando PIX...</>
            ) : (
              <>💳 Gerar PIX — {formatPrice(savedTotal.current)}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
