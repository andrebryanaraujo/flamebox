"use client";

import { Plus, Search, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import Modal, { ModalFormGroup, ModalInput, ModalSelect, ModalTextarea, ModalRow, ModalActions, ModalBtnPrimary, ModalBtnSecondary, ModalError } from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  categorySlug: string;
  categoryId: string;
  category?: { name: string; emoji: string | null };
}

interface Category {
  id: string;
  slug: string;
  name: string;
  emoji: string | null;
}

function formatPrice(price: number) {
  return `R$ ${price.toFixed(2).replace(".", ",")}`;
}

const emptyForm = {
  name: "",
  price: "",
  stock: "",
  description: "",
  image: "",
  categoryId: "",
};

export default function AdminProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchProducts = useCallback((query?: string) => {
    const url = query ? `/api/products?search=${encodeURIComponent(query)}` : "/api/products";
    fetch(url)
      .then((r) => r.json())
      .then((data) => { setProducts(data); setLoading(false); });
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(search), 300);
    return () => clearTimeout(timer);
  }, [search, fetchProducts]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await fetch(`/api/products/${deleteId}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
    setDeleting(false);
  };

  const handleCreate = async () => {
    setError("");
    if (!form.name || !form.price || !form.categoryId) {
      setError("Preencha nome, preço e categoria.");
      return;
    }

    setSaving(true);
    const cat = categories.find((c) => c.id === form.categoryId);
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        price: parseFloat(form.price),
        stock: parseInt(form.stock || "0"),
        description: form.description || "Sem descrição",
        image: form.image || "/placeholder.png",
        categoryId: form.categoryId,
        categorySlug: cat?.slug || "",
      }),
    });

    if (res.ok) {
      setShowModal(false);
      setForm(emptyForm);
      fetchProducts();
    } else {
      const data = await res.json();
      setError(data.error || "Erro ao criar produto.");
    }
    setSaving(false);
  };

  const openEdit = (product: Product) => {
    setEditId(product.id);
    setForm({
      name: product.name,
      price: String(product.price),
      stock: String(product.stock),
      categoryId: product.categoryId,
      image: product.image,
      description: product.description,
    });
    setError("");
    setShowModal(true);
  };

  const handleEdit = async () => {
    if (!editId) return;
    setError("");
    if (!form.name || !form.price || !form.categoryId) {
      setError("Preencha nome, preço e categoria.");
      return;
    }
    setSaving(true);
    const cat = categories.find((c) => c.id === form.categoryId);
    const res = await fetch(`/api/products/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        price: parseFloat(form.price),
        stock: parseInt(form.stock || "0"),
        description: form.description || "Sem descrição",
        image: form.image || "/placeholder.png",
        categoryId: form.categoryId,
        categorySlug: cat?.slug || "",
      }),
    });
    if (res.ok) {
      setShowModal(false);
      setForm(emptyForm);
      setEditId(null);
      fetchProducts();
    } else {
      const data = await res.json();
      setError(data.error || "Erro ao atualizar produto.");
    }
    setSaving(false);
  };

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Produtos</h1>
          <p className="admin-page-subtitle">{products.length} produtos cadastrados</p>
        </div>
        <button className="btn-admin primary" onClick={openCreate}>
          <Plus size={16} /> Novo Produto
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div className="search-bar" style={{ maxWidth: 360 }}>
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td><div className="skeleton" style={{ width: "200px", height: "20px", borderRadius: "4px" }} /></td>
                  <td><div className="skeleton" style={{ width: "100px", height: "20px", borderRadius: "4px" }} /></td>
                  <td><div className="skeleton" style={{ width: "70px", height: "20px", borderRadius: "4px" }} /></td>
                  <td><div className="skeleton" style={{ width: "40px", height: "20px", borderRadius: "4px" }} /></td>
                  <td><div className="skeleton" style={{ width: "60px", height: "20px", borderRadius: "4px" }} /></td>
                  <td><div className="skeleton" style={{ width: "80px", height: "20px", borderRadius: "4px" }} /></td>
                </tr>
              ))
            ) : products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={40}
                      height={40}
                      style={{ borderRadius: 6, objectFit: "cover" }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.82rem" }}>{product.name}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>ID: {product.id.slice(0, 12)}...</div>
                    </div>
                  </div>
                </td>
                <td>{product.category?.emoji} {product.category?.name}</td>
                <td style={{ fontWeight: 600 }}>{formatPrice(product.price)}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`badge ${product.stock > 0 ? "success" : "danger"}`}>
                    {product.stock > 0 ? "Ativo" : "Esgotado"}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "0.35rem" }}>
                    <button className="btn-admin secondary sm" onClick={() => openEdit(product)}><Edit size={13} /></button>
                    <button className="btn-admin danger sm" onClick={() => setDeleteId(product.id)}><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && products.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>Nenhum produto encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Product Modal */}
      <Modal open={showModal} onClose={() => { setShowModal(false); setError(""); setEditId(null); }} title={editId ? "Editar Produto" : "Novo Produto"}>
        <ModalError message={error} />
        <ModalFormGroup label="Nome" required>
          <ModalInput placeholder="Ex: Conta Blox Fruits V4" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </ModalFormGroup>
        <ModalRow>
          <ModalFormGroup label="Preço (R$)" required>
            <ModalInput type="number" step="0.01" placeholder="0,00" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </ModalFormGroup>
          <ModalFormGroup label="Estoque">
            <ModalInput type="number" placeholder="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          </ModalFormGroup>
        </ModalRow>
        <ModalFormGroup label="Categoria" required>
          <ModalSelect value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
            <option value="">Selecione...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
            ))}
          </ModalSelect>
        </ModalFormGroup>
        <ModalFormGroup label="URL da Imagem">
          <ModalInput placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        </ModalFormGroup>
        <ModalFormGroup label="Descrição">
          <ModalTextarea placeholder="Descreva o produto..." rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </ModalFormGroup>
        <ModalActions>
          <ModalBtnSecondary onClick={() => { setShowModal(false); setError(""); setEditId(null); }}>Cancelar</ModalBtnSecondary>
          <ModalBtnPrimary onClick={editId ? handleEdit : handleCreate} disabled={saving}>
            {saving ? "Salvando..." : editId ? "Salvar Alterações" : "Criar Produto"}
          </ModalBtnPrimary>
        </ModalActions>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="Este produto será excluído permanentemente. Esta ação não pode ser desfeita."
        loading={deleting}
      />
    </>
  );
}
