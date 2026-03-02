"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/data";

export default function CartPage() {
  const { items, removeItem, updateQuantity, cartTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-main">
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h2 className="cart-empty-title">Seu carrinho está vazio</h2>
          <p className="cart-empty-text">Adicione produtos para continuar comprando</p>
          <Link href="/" className="btn-back-home">
            <ArrowLeft size={16} /> Voltar à loja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main">
      <h1 className="section-title" style={{ textAlign: "left" }}>🛒 Meu Carrinho</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.product.id} className="cart-item">
              <Image
                src={item.product.image}
                alt={item.product.name}
                width={80}
                height={80}
                className="cart-item-image"
              />
              <div className="cart-item-info">
                <div className="cart-item-name">{item.product.name}</div>
                <div className="cart-item-price">{formatPrice(item.product.price)}</div>
              </div>
              <div className="cart-item-controls">
                <button className="qty-btn" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>−</button>
                <span className="cart-item-qty">{item.quantity}</span>
                <button className="qty-btn" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
              </div>
              <button className="btn-remove" onClick={() => removeItem(item.product.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3 className="cart-summary-title">Resumo do Pedido</h3>
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Desconto</span>
            <span style={{ color: "var(--green-online)" }}>-R$ 0,00</span>
          </div>
          <div className="cart-summary-total">
            <span>Total</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <Link href="/checkout" className="btn-checkout">
            <ShoppingBag size={18} /> Pagar com PIX
          </Link>
        </div>
      </div>
    </div>
  );
}
