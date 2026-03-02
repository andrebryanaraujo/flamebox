"use client";

import { Plus, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import Modal, { ModalFormGroup, ModalInput, ModalRow, ModalActions, ModalBtnPrimary, ModalBtnSecondary, ModalError } from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";

interface Category {
  id: string;
  slug: string;
  name: string;
  emoji: string | null;
  image: string;
  subcategories: { id: string; slug: string; name: string }[];
  _count: { products: number };
}

const emptyForm = {
  name: "",
  slug: "",
  emoji: "",
  image: "",
  banner: "",
};

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchCategories = useCallback(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => { setCategories(data); setLoading(false); });
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await fetch(`/api/categories/${deleteId}`, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c.id !== deleteId));
    setDeleteId(null);
    setDeleting(false);
  };

  const handleCreate = async () => {
    setError("");
    if (!form.name || !form.slug) {
      setError("Preencha nome e slug.");
      return;
    }

    setSaving(true);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        emoji: form.emoji || null,
        image: form.image || "/placeholder.png",
        banner: form.banner || "/placeholder.png",
      }),
    });

    if (res.ok) {
      setShowModal(false);
      setForm(emptyForm);
      fetchCategories();
    } else {
      const data = await res.json();
      setError(data.error || "Erro ao criar categoria.");
    }
    setSaving(false);
  };

  const openEdit = (cat: Category) => {
    setEditId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      emoji: cat.emoji || "",
      image: cat.image,
      banner: "",
    });
    setError("");
    setShowModal(true);
  };

  const handleEdit = async () => {
    if (!editId) return;
    setError("");
    if (!form.name || !form.slug) {
      setError("Preencha nome e slug.");
      return;
    }
    setSaving(true);
    const res = await fetch(`/api/categories/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        emoji: form.emoji || null,
        image: form.image || undefined,
        banner: form.banner || undefined,
      }),
    });
    if (res.ok) {
      setShowModal(false);
      setForm(emptyForm);
      setEditId(null);
      fetchCategories();
    } else {
      const data = await res.json();
      setError(data.error || "Erro ao atualizar categoria.");
    }
    setSaving(false);
  };

  const openCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  // Auto-generate slug from name (only for new categories)
  const handleNameChange = (name: string) => {
    if (!editId) {
      const slug = name
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setForm({ ...form, name, slug });
    } else {
      setForm({ ...form, name });
    }
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Categorias</h1>
          <p className="admin-page-subtitle">{categories.length} categorias cadastradas</p>
        </div>
        <button className="btn-admin primary" onClick={openCreate}>
          <Plus size={16} /> Nova Categoria
        </button>
      </div>

      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Slug</th>
              <th>Subcategorias</th>
              <th>Produtos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  <td><div className="skeleton" style={{ width: "150px", height: "20px", borderRadius: "4px" }} /></td>
                  <td><div className="skeleton" style={{ width: "100px", height: "20px", borderRadius: "4px" }} /></td>
                  <td><div className="skeleton" style={{ width: "30px", height: "20px", borderRadius: "4px" }} /></td>
                  <td><div className="skeleton" style={{ width: "30px", height: "20px", borderRadius: "4px" }} /></td>
                  <td><div className="skeleton" style={{ width: "80px", height: "20px", borderRadius: "4px" }} /></td>
                </tr>
              ))
            ) : categories.map((cat) => (
              <tr key={cat.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      width={40}
                      height={40}
                      style={{ borderRadius: 6, objectFit: "cover" }}
                    />
                    <div style={{ fontWeight: 600 }}>{cat.emoji} {cat.name}</div>
                  </div>
                </td>
                <td style={{ color: "var(--text-muted)", fontFamily: "monospace", fontSize: "0.8rem" }}>{cat.slug}</td>
                <td>{cat.subcategories.length}</td>
                <td>{cat._count.products}</td>
                <td>
                  <div style={{ display: "flex", gap: "0.35rem" }}>
                    <button className="btn-admin secondary sm" onClick={() => openEdit(cat)}><Edit size={13} /></button>
                    <button className="btn-admin danger sm" onClick={() => setDeleteId(cat.id)}><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && categories.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>Nenhuma categoria encontrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Category Modal */}
      <Modal open={showModal} onClose={() => { setShowModal(false); setError(""); setEditId(null); }} title={editId ? "Editar Categoria" : "Nova Categoria"}>
        <ModalError message={error} />
        <ModalFormGroup label="Nome" required>
          <ModalInput placeholder="Ex: Blox Fruits" value={form.name} onChange={(e) => handleNameChange(e.target.value)} />
        </ModalFormGroup>
        <ModalRow>
          <ModalFormGroup label="Slug" required>
            <ModalInput placeholder="blox-fruits" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} style={{ fontFamily: "monospace" }} />
          </ModalFormGroup>
          <ModalFormGroup label="Emoji">
            <ModalInput placeholder="🎮" value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} maxLength={4} style={{ maxWidth: 80, textAlign: "center", fontSize: "1.1rem" }} />
          </ModalFormGroup>
        </ModalRow>
        <ModalFormGroup label="URL da Imagem (Card)">
          <ModalInput placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        </ModalFormGroup>
        <ModalFormGroup label="URL do Banner">
          <ModalInput placeholder="https://..." value={form.banner} onChange={(e) => setForm({ ...form, banner: e.target.value })} />
        </ModalFormGroup>
        <ModalActions>
          <ModalBtnSecondary onClick={() => { setShowModal(false); setError(""); setEditId(null); }}>Cancelar</ModalBtnSecondary>
          <ModalBtnPrimary onClick={editId ? handleEdit : handleCreate} disabled={saving}>
            {saving ? "Salvando..." : editId ? "Salvar Alterações" : "Criar Categoria"}
          </ModalBtnPrimary>
        </ModalActions>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="Esta ação não pode ser desfeita. Todos os produtos dessa categoria ficarão sem categoria."
        loading={deleting}
      />
    </>
  );
}
