"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useSettings } from "@/lib/settings-context";

export default function Header() {
  const { cartCount } = useCart();
  const { settings } = useSettings();

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <Link href="/" className="logo">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.storeName} style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover" }} />
            ) : (
              <div className="logo-icon">{settings.logoIcon}</div>
            )}
            {settings.storeName}
          </Link>

          <div className="search-bar">
            <Search className="search-icon" size={16} />
            <input type="text" placeholder="Pesquisar produto" />
          </div>

          <div className="header-actions">
            <button className="btn-header" aria-label="Suporte" title="Suporte">
              <User size={16} />
            </button>
            <Link href="/carrinho" className="btn-header">
              <ShoppingCart size={16} />
              Carrinho
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            <Link href="/login" className="btn-header">
              Entrar
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

export function ChatButton() {
  return (
    <button className="chat-btn" aria-label="Chat" title="Chat de suporte">
      <MessageCircle size={22} />
    </button>
  );
}

export function Toast() {
  const { showToast, toastMessage } = useCart();
  if (!showToast) return null;
  return <div className="toast">{toastMessage}</div>;
}
