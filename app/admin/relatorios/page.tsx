"use client";

import { BarChart3, TrendingUp, DollarSign, ShoppingCart, Package, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface OrderItem {
  productName: string;
  price: number;
  quantity: number;
}

interface Order {
  total: number;
  customerEmail: string;
  items: OrderItem[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

function formatPrice(price: number) {
  return `R$ ${price.toFixed(2).replace(".", ",")}`;
}

export default function AdminRelatoriosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/orders").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ]).then(([ords, prods]) => {
      setOrders(ords);
      setProducts(prods);
      setLoading(false);
    });
  }, []);

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const avgTicket = orders.length > 0 ? totalRevenue / orders.length : 0;
  const uniqueClients = new Set(orders.map((o) => o.customerEmail)).size;

  // Top products by quantity sold
  const salesMap = new Map<string, { name: string; sales: number; revenue: number }>();
  for (const order of orders) {
    for (const item of order.items) {
      const existing = salesMap.get(item.productName) || { name: item.productName, sales: 0, revenue: 0 };
      existing.sales += item.quantity;
      existing.revenue += item.price * item.quantity;
      salesMap.set(item.productName, existing);
    }
  }
  const topProducts = Array.from(salesMap.values())
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  const stats = [
    { label: "Receita Total", value: formatPrice(totalRevenue), icon: DollarSign, color: "purple" },
    { label: "Ticket Médio", value: formatPrice(avgTicket), icon: ShoppingCart, color: "green" },
    { label: "Produtos Ativos", value: String(products.length), icon: Package, color: "blue" },
    { label: "Clientes Únicos", value: String(uniqueClients), icon: Users, color: "orange" },
  ];

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Relatórios</h1>
          <p className="admin-page-subtitle">Análise de desempenho da loja</p>
        </div>
        <button className="btn-admin secondary">Exportar PDF</button>
      </div>

      {/* Summary Cards */}
      <div className="admin-stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="admin-stat-label">{stat.label}</span>
              <div className={`admin-stat-icon ${stat.color}`}><stat.icon size={18} /></div>
            </div>
            <div className="admin-stat-value">
              {loading ? <div className="skeleton" style={{ width: "80px", height: "28px", borderRadius: "4px" }} /> : stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="admin-grid-2">
        <div className="admin-chart-card">
          <h3 className="admin-chart-title">📊 Receita por Mês</h3>
          <div className="admin-chart-placeholder">
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📉</div>
              <div>Gráfico de receita mensal</div>
            </div>
          </div>
        </div>

        <div className="admin-chart-card">
          <h3 className="admin-chart-title">🏆 Produtos Mais Vendidos</h3>
          <div className="admin-activity-list">
            {topProducts.map((product, i) => (
              <div key={i} className="admin-activity-item">
                <div style={{
                  width: 24, height: 24, borderRadius: 6,
                  background: i === 0 ? "var(--purple-primary)" : "var(--bg-primary)",
                  border: i !== 0 ? "1px solid var(--border-color)" : "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.7rem", fontWeight: 700, color: i === 0 ? "white" : "var(--text-muted)",
                  flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="admin-activity-text" style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                    {product.name}
                  </div>
                  <div className="admin-activity-time">
                    {product.sales} vendas · {formatPrice(product.revenue)}
                  </div>
                </div>
              </div>
            ))}
            {!loading && topProducts.length === 0 && (
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", padding: "1rem 0" }}>Nenhuma venda registrada ainda.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
