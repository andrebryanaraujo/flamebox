"use client";

import { Plus, Edit, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Fragment, useEffect, useState, useCallback } from "react";
import Modal, { ModalFormGroup, ModalInput, ModalRow, ModalActions, ModalBtnPrimary, ModalBtnSecondary, ModalError } from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";

interface Subcategory {
  id: string;
  slug: string;
  name: string;
}

interface Category {
  id: string;
  slug: string;
  name: string;
  emoji: string | null;
  image: string;
  subcategories: Subcategory[];
  _count: { products: number };
}

const emptyForm = {
  name: "",
  slug: "",
  emoji: "",
  image: "",
  banner: "",
};

const emptySubForm = {
  name: "",
  slug: "",
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

  // Subcategory state
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showSubModal, setShowSubModal] = useState(false);
  const [subForm, setSubForm] = useState(emptySubForm);
  const [subSaving, setSubSaving] = useState(false);
  const [subError, setSubError] = useState("");
  const [subEditId, setSubEditId] = useState<string | null>(null);
  const [subCategoryId, setSubCategoryId] = useState<string>("");
  const [deleteSubId, setDeleteSubId] = useState<string | null>(null);
  const [deletingSub, setDeletingSub] = useState(false);

  const fetchCategories = useCallback(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => { setCategories(data); setLoading(false); });
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  // --- Category CRUD ---
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

  // --- Subcategory CRUD ---
  const toggleExpand = (catId: string) => {
    setExpanded((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const openCreateSub = (categoryId: string) => {
    setSubEditId(null);
    setSubCategoryId(categoryId);
    setSubForm(emptySubForm);
    setSubError("");
    setShowSubModal(true);
  };

  const openEditSub = (sub: Subcategory, categoryId: string) => {
    setSubEditId(sub.id);
    setSubCategoryId(categoryId);
    setSubForm({ name: sub.name, slug: sub.slug });
    setSubError("");
    setShowSubModal(true);
  };

  const handleSubNameChange = (name: string) => {
    if (!subEditId) {
      const slug = name
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSubForm({ name, slug });
    } else {
      setSubForm({ ...subForm, name });
    }
  };

  const handleCreateSub = async () => {
    setSubError("");
    if (!subForm.name || !subForm.slug) {
      setSubError("Preencha o nome da subcategoria.");
      return;
    }
    setSubSaving(true);
    const res = await fetch("/api/subcategories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: subForm.name,
        slug: subForm.slug,
        categoryId: subCategoryId,
      }),
    });
    if (res.ok) {
      setShowSubModal(false);
      setSubForm(emptySubForm);
      fetchCategories();
      setExpanded((prev) => ({ ...prev, [subCategoryId]: true }));
    } else {
      const data = await res.json();
      setSubError(data.error || "Erro ao criar subcategoria.");
    }
    setSubSaving(false);
  };

  const handleEditSub = async () => {
    if (!subEditId) return;
    setSubError("");
    if (!subForm.name || !subForm.slug) {
      setSubError("Preencha o nome da subcategoria.");
      return;
    }
    setSubSaving(true);
    const res = await fetch(`/api/subcategories/${subEditId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: subForm.name, slug: subForm.slug }),
    });
    if (res.ok) {
      setShowSubModal(false);
      setSubForm(emptySubForm);
      setSubEditId(null);
      fetchCategories();
    } else {
      const data = await res.json();
      setSubError(data.error || "Erro ao atualizar subcategoria.");
    }
    setSubSaving(false);
  };

  const handleDeleteSub = async () => {
    if (!deleteSubId) return;
    setDeletingSub(true);
    await fetch(`/api/subcategories/${deleteSubId}`, { method: "DELETE" });
    setDeleteSubId(null);
    setDeletingSub(false);
    fetchCategories();
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
              <th style={{ width: 32 }}></th>
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
                  <td></td>
                  <td><div className="skeleton" style={{ width: "150px", height: "20px", borderRadius: "4px" }} /></td>
                  <td><div className="skeleton" style={{ width: "100px", height: "20px", borderRadius: "4px" }} /></td>
                  <td><div className="skeleton" style={{ width: "30px", height: "20px", borderRadius: "4px" }} /></td>
                  <td><div className="skeleton" style={{ width: "30px", height: "20px", borderRadius: "4px" }} /></td>
                  <td><div className="skeleton" style={{ width: "80px", height: "20px", borderRadius: "4px" }} /></td>
                </tr>
              ))
            ) : categories.map((cat) => (
              <Fragment key={cat.id}>
                <tr key={cat.id}>
                  <td>
                    {cat.subcategories.length > 0 && (
                      <button
                        onClick={() => toggleExpand(cat.id)}
                        style={{
                          background: "none", border: "none", cursor: "pointer",
                          color: "var(--text-muted)", padding: "2px", display: "flex",
                          alignItems: "center", justifyContent: "center",
                        }}
                      >
                        {expanded[cat.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                    )}
                  </td>
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
                  <td>
                    <span
                      onClick={() => cat.subcategories.length > 0 && toggleExpand(cat.id)}
                      style={{
                        cursor: cat.subcategories.length > 0 ? "pointer" : "default",
                        color: cat.subcategories.length > 0 ? "var(--purple-primary)" : "var(--text-muted)",
                        fontWeight: 500,
                      }}
                    >
                      {cat.subcategories.length}
                    </span>
                  </td>
                  <td>{cat._count.products}</td>
                  <td>
                    <div style={{ display: "flex", gap: "0.35rem" }}>
                      <button
                        className="btn-admin secondary sm"
                        onClick={() => openCreateSub(cat.id)}
                        title="Adicionar subcategoria"
                        style={{ fontSize: "0.7rem" }}
                      >
                        <Plus size={13} /> Sub
                      </button>
                      <button className="btn-admin secondary sm" onClick={() => openEdit(cat)}><Edit size={13} /></button>
                      <button className="btn-admin danger sm" onClick={() => setDeleteId(cat.id)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>

                {/* Subcategories accordion rows */}
                {expanded[cat.id] && cat.subcategories.map((sub) => (
                  <tr key={sub.id} style={{ background: "var(--bg-primary)" }}>
                    <td></td>
                    <td colSpan={2}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingLeft: "1.5rem" }}>
                        <div style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: "var(--purple-primary)", flexShrink: 0,
                        }} />
                        <span style={{ fontSize: "0.82rem", fontWeight: 500 }}>{sub.name}</span>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "monospace" }}>{sub.slug}</span>
                      </div>
                    </td>
                    <td colSpan={2}></td>
                    <td>
                      <div style={{ display: "flex", gap: "0.35rem" }}>
                        <button className="btn-admin secondary sm" onClick={() => openEditSub(sub, cat.id)}><Edit size={12} /></button>
                        <button className="btn-admin danger sm" onClick={() => setDeleteSubId(sub.id)}><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
            {!loading && categories.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>Nenhuma categoria encontrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Category Modal */}
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

      {/* Subcategory Modal */}
      <Modal open={showSubModal} onClose={() => { setShowSubModal(false); setSubError(""); setSubEditId(null); }} title={subEditId ? "Editar Subcategoria" : "Nova Subcategoria"}>
        <ModalError message={subError} />
        <ModalFormGroup label="Nome" required>
          <ModalInput placeholder="Ex: Contas com V4" value={subForm.name} onChange={(e) => handleSubNameChange(e.target.value)} />
        </ModalFormGroup>
        <ModalFormGroup label="Slug">
          <ModalInput
            placeholder="contas-com-v4"
            value={subForm.slug}
            onChange={(e) => setSubForm({ ...subForm, slug: e.target.value })}
            style={{ fontFamily: "monospace" }}
          />
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            Gerado automaticamente a partir do nome. Edite se necessário.
          </div>
        </ModalFormGroup>
        <ModalActions>
          <ModalBtnSecondary onClick={() => { setShowSubModal(false); setSubError(""); setSubEditId(null); }}>Cancelar</ModalBtnSecondary>
          <ModalBtnPrimary onClick={subEditId ? handleEditSub : handleCreateSub} disabled={subSaving}>
            {subSaving ? "Salvando..." : subEditId ? "Salvar Alterações" : "Criar Subcategoria"}
          </ModalBtnPrimary>
        </ModalActions>
      </Modal>

      {/* Category Delete Confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="Esta ação não pode ser desfeita. Todos os produtos dessa categoria ficarão sem categoria."
        loading={deleting}
      />

      {/* Subcategory Delete Confirm */}
      <ConfirmDialog
        open={!!deleteSubId}
        onCancel={() => setDeleteSubId(null)}
        onConfirm={handleDeleteSub}
        message="A subcategoria será excluída. Os produtos vinculados ficarão sem subcategoria."
        loading={deletingSub}
      />
    </>
  );
}
