"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettings } from "@/lib/settings-context";
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
} from "lucide-react";
import { useAdmin } from "@/lib/admin-context";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/produtos", icon: Package, label: "Produtos" },
  { href: "/admin/pedidos", icon: ShoppingCart, label: "Pedidos" },
  { href: "/admin/categorias", icon: Tags, label: "Categorias" },
  { href: "/admin/clientes", icon: Users, label: "Clientes" },
  { href: "/admin/relatorios", icon: BarChart3, label: "Relatórios" },
  { href: "/admin/configuracoes", icon: Settings, label: "Configurações" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAdmin();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const { settings } = useSettings();

  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="admin-sidebar-header">
        <div className="admin-sidebar-logo">
          <div className="logo-icon" style={{ width: 32, height: 32, fontSize: "0.85rem" }}>{settings.logoIcon || "🏪"}</div>
          <div>
            <div className="admin-sidebar-brand">{settings.storeName || "Minha Loja"}</div>
            <div className="admin-sidebar-sub">Painel Admin</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="admin-sidebar-nav">
        <div className="admin-sidebar-section">MENU</div>
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-sidebar-link ${isActive ? "active" : ""}`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="admin-sidebar-footer">
        <Link href="/" className="admin-sidebar-link" target="_blank">
          <Store size={18} />
          <span>Ver Loja</span>
        </Link>
        <button className="admin-sidebar-link" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Sair</span>
        </button>

        {user && (
          <div className="admin-sidebar-user">
            <div className="admin-sidebar-avatar">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="admin-sidebar-username">{user.name}</div>
              <div className="admin-sidebar-email">{user.email}</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
