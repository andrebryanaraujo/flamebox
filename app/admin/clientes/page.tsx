"use client";

import { Search, Eye } from "lucide-react";
import { useEffect, useState } from "react";

interface Order {
  customerName: string;
  customerEmail: string;
  total: number;
  createdAt: string;
}

interface Client {
  name: string;
  email: string;
  orders: number;
  spent: number;
  firstOrder: string;
}

function formatPrice(price: number) {
  return `R$ ${price.toFixed(2).replace(".", ",")}`;
}

export default function AdminClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => (r.ok ? r.json() : []))
      .then((orders: Order[]) => {
        const arr = Array.isArray(orders) ? orders : [];
        // Derive unique clients from orders
        const clientMap = new Map<string, Client>();
        for (const o of arr) {
          const key = o.customerEmail;
          const existing = clientMap.get(key);
          if (existing) {
            existing.orders += 1;
            existing.spent += o.total;
          } else {
            clientMap.set(key, {
              name: o.customerName,
              email: o.customerEmail,
              orders: 1,
              spent: o.total,
              firstOrder: o.createdAt,
            });
          }
        }
        setClients(Array.from(clientMap.values()));
        setLoading(false);
      });
  }, []);

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Clientes</h1>
          <p className="admin-page-subtitle">{clients.length} clientes cadastrados</p>
        </div>
        <button className="btn-admin secondary">Exportar</button>
      </div>

      <div style={{ marginBottom: "1.25rem" }}>
        <div className="search-bar" style={{ maxWidth: 360 }}>
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>E-mail</th>
              <th>Desde</th>
              <th>Pedidos</th>
              <th>Total Gasto</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j}><div className="skeleton" style={{ width: "90px", height: "20px", borderRadius: "4px" }} /></td>
                  ))}
                </tr>
              ))
            ) : filtered.map((client) => (
              <tr key={client.email}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "linear-gradient(135deg, var(--purple-primary), var(--purple-secondary))",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: "0.75rem", color: "white", flexShrink: 0
                    }}>
                      {client.name.charAt(0)}
                    </div>
                    <span style={{ fontWeight: 500 }}>{client.name}</span>
                  </div>
                </td>
                <td style={{ color: "var(--text-muted)" }}>{client.email}</td>
                <td style={{ color: "var(--text-muted)" }}>
                  {new Date(client.firstOrder).toLocaleDateString("pt-BR")}
                </td>
                <td>{client.orders}</td>
                <td style={{ fontWeight: 600 }}>{formatPrice(client.spent)}</td>
                <td>
                  <button className="btn-admin secondary sm" style={{ padding: "0.25rem 0.4rem" }}>
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>Nenhum cliente encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
