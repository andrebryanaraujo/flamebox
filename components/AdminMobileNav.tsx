"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Tags,
  LogOut,
  Store,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAdmin } from "@/lib/admin-context";
import { useRouter } from "next/navigation";
import { useSettings } from "@/lib/settings-context";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/produtos", icon: Package, label: "Produtos" },
  { href: "/admin/pedidos", icon: ShoppingCart, label: "Pedidos" },
  { href: "/admin/categorias", icon: Tags, label: "Categorias" },
  { href: "/admin/clientes", icon: Users, label: "Clientes" },
  { href: "/admin/relatorios", icon: BarChart3, label: "Relatórios" },
  { href: "/admin/configuracoes", icon: Settings, label: "Configurações" },
];

export default function AdminMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAdmin();
  const { settings } = useSettings();
  const router = useRouter();

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="hamburger-btn"
        onClick={() => setOpen(!open)}
        aria-label="Menu"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Overlay */}
      {open && (
        <div className="mobile-sidebar-overlay" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar Drawer */}
      <aside className={`mobile-sidebar-drawer ${open ? "open" : ""}`}>
        {/* Header */}
        <div className="mobile-drawer-header">
          <div className="logo-icon" style={{ width: 32, height: 32, fontSize: "0.85rem" }}>
            {settings.logoIcon}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{settings.storeName}</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Painel Admin</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="mobile-drawer-nav">
          <div style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", padding: "0.5rem 1rem 0.3rem", textTransform: "uppercase" }}>
            Menu
          </div>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-drawer-link ${isActive(item.href) ? "active" : ""}`}
              onClick={() => setOpen(false)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="mobile-drawer-footer">
          <Link href="/" className="mobile-drawer-link" target="_blank" onClick={() => setOpen(false)}>
            <Store size={18} />
            <span>Ver Loja</span>
          </Link>
          <button className="mobile-drawer-link" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Sair</span>
          </button>
          {user && (
            <div className="mobile-drawer-user">
              <div className="admin-sidebar-avatar">{user.name.charAt(0)}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.82rem" }}>{user.name}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{user.email}</div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
