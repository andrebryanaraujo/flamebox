"use client";

import LineChart from "@/components/LineChart";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Eye,
  MoreVertical,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface OrderItem {
  productName: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

function formatPrice(price: number) {
  return `R$ ${price.toFixed(2).replace(".", ",")}`;
}

function getStatusType(status: string) {
  switch (status) {
    case "Entregue": return "success";
    case "Pendente": return "warning";
    case "Processando": return "info";
    case "Cancelado": return "danger";
    default: return "info";
  }
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/orders").then((r) => r.json()),
    ]).then(([prods, ords]) => {
      setProducts(prods);
      setOrders(ords);
      setLoading(false);
    });
  }, []);

  const totalRevenue = orders.reduce((acc: number, o: Order) => acc + o.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;

  const stats = [
    { label: "Receita Total", value: formatPrice(totalRevenue), icon: DollarSign, color: "purple" },
    { label: "Pedidos", value: String(totalOrders), icon: ShoppingCart, color: "green" },
    { label: "Produtos Ativos", value: String(totalProducts), icon: Package, color: "blue" },
    { label: "Clientes", value: "—", icon: Users, color: "orange" },
  ];

  // Build last 7 days sales data
  const salesData = useMemo(() => {
    const days: { label: string; value: number }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStr = date.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 86400000);
      const total = orders
        .filter((o) => {
          const d = new Date(o.createdAt);
          return d >= dayStart && d < dayEnd;
        })
        .reduce((acc, o) => acc + o.total, 0);
      days.push({ label: dayStr, value: total });
    }
    return days;
  }, [orders]);

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Visão geral da sua loja</p>
        </div>
        <button className="btn-admin secondary">
          <Eye size={16} /> Último 30 dias
        </button>
      </div>

      {/* Stats */}
      <div className="admin-stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="admin-stat-label">{stat.label}</span>
              <div className={`admin-stat-icon ${stat.color}`}>
                <stat.icon size={18} />
              </div>
            </div>
            <div className="admin-stat-value">
              {loading ? <div className="skeleton" style={{ width: "80px", height: "28px", borderRadius: "4px" }} /> : stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Charts + Activity */}
      <div className="admin-grid-2" style={{ marginBottom: "2rem" }}>
        <div className="admin-chart-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <h3 className="admin-chart-title" style={{ margin: 0 }}>📊 Vendas (últimos 7 dias)</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Total: {formatPrice(salesData.reduce((a, d) => a + d.value, 0))}
            </span>
          </div>
          {loading ? (
            <div className="skeleton" style={{ width: "100%", height: "220px", borderRadius: "8px" }} />
          ) : (
            <LineChart
              data={salesData}
              height={220}
              formatValue={(v) => `R$${v.toFixed(0)}`}
            />
          )}
        </div>

        <div className="admin-chart-card">
          <h3 className="admin-chart-title">⚡ Atividade Recente</h3>
          <div className="admin-activity-list">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="admin-activity-item">
                <div className={`admin-activity-dot ${order.status === "Entregue" ? "green" : order.status === "Cancelado" ? "orange" : "purple"}`} />
                <div>
                  <div className="admin-activity-text">
                    Pedido {order.orderNumber} — {order.status}
                  </div>
                  <div className="admin-activity-time">
                    {new Date(order.createdAt).toLocaleString("pt-BR")}
                  </div>
                </div>
              </div>
            ))}
            {orders.length === 0 && !loading && (
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", padding: "1rem 0" }}>Nenhuma atividade recente.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="admin-table-card">
        <div className="admin-table-header">
          <h3 className="admin-table-title">🛒 Pedidos Recentes</h3>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Produto</th>
              <th>Valor</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 6).map((order) => (
              <tr key={order.id}>
                <td style={{ fontWeight: 600, color: "var(--purple-light)" }}>{order.orderNumber}</td>
                <td>{order.customerName}</td>
                <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {order.items.map((i) => i.productName).join(", ")}
                </td>
                <td style={{ fontWeight: 600 }}>{formatPrice(order.total)}</td>
                <td><span className={`badge ${getStatusType(order.status)}`}>{order.status}</span></td>
                <td>
                  <button className="btn-admin secondary sm" style={{ padding: "0.25rem 0.4rem" }}>
                    <MoreVertical size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && !loading && (
              <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>Nenhum pedido encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
