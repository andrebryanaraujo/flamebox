"use client";

import { Search, Eye } from "lucide-react";
import { useEffect, useState } from "react";

interface OrderItem {
  productName: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  paymentMethod: string;
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

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchOrders = (query?: string) => {
    const url = query ? `/api/orders?search=${encodeURIComponent(query)}` : "/api/orders";
    fetch(url)
      .then((r) => r.json())
      .then((data) => { setOrders(data); setLoading(false); });
  };

  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchOrders(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Pedidos</h1>
          <p className="admin-page-subtitle">{orders.length} pedidos encontrados</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="btn-admin secondary">Exportar</button>
        </div>
      </div>

      <div style={{ marginBottom: "1.25rem" }}>
        <div className="search-bar" style={{ maxWidth: 360 }}>
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Buscar por pedido ou cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Data</th>
              <th>Cliente</th>
              <th>Produto</th>
              <th>Valor</th>
              <th>Pagamento</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j}><div className="skeleton" style={{ width: j === 3 ? "150px" : "80px", height: "20px", borderRadius: "4px" }} /></td>
                  ))}
                </tr>
              ))
            ) : orders.map((order) => (
              <tr key={order.id}>
                <td style={{ fontWeight: 600, color: "var(--purple-light)" }}>{order.orderNumber}</td>
                <td style={{ color: "var(--text-muted)" }}>
                  {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                </td>
                <td>
                  <div>
                    <div style={{ fontWeight: 500 }}>{order.customerName}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{order.customerEmail}</div>
                  </div>
                </td>
                <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {order.items.map((i) => i.productName).join(", ")}
                </td>
                <td style={{ fontWeight: 600 }}>{formatPrice(order.total)}</td>
                <td><span className="badge info">{order.paymentMethod}</span></td>
                <td><span className={`badge ${getStatusType(order.status)}`}>{order.status}</span></td>
                <td>
                  <button className="btn-admin secondary sm" style={{ padding: "0.25rem 0.4rem" }}>
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {!loading && orders.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>Nenhum pedido encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
