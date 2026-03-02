"use client";

import { Save, Store, Palette, Bell, Shield, Check } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { useState, useEffect } from "react";

const presetColors = [
  { name: "Roxo", primary: "#7c3aed", secondary: "#6d28d9", accent: "#a78bfa" },
  { name: "Azul", primary: "#2563eb", secondary: "#1d4ed8", accent: "#60a5fa" },
  { name: "Verde", primary: "#059669", secondary: "#047857", accent: "#34d399" },
  { name: "Rosa", primary: "#db2777", secondary: "#be185d", accent: "#f472b6" },
  { name: "Vermelho", primary: "#dc2626", secondary: "#b91c1c", accent: "#f87171" },
  { name: "Laranja", primary: "#ea580c", secondary: "#c2410c", accent: "#fb923c" },
  { name: "Ciano", primary: "#0891b2", secondary: "#0e7490", accent: "#22d3ee" },
  { name: "Índigo", primary: "#4f46e5", secondary: "#4338ca", accent: "#818cf8" },
];

export default function AdminConfiguracoesPage() {
  const { settings, updateSettings, loading } = useSettings();

  const [form, setForm] = useState({
    storeName: "",
    storeDescription: "",
    logoIcon: "",
    primaryColor: "#7c3aed",
    secondaryColor: "#6d28d9",
    accentColor: "#a78bfa",
    contactEmail: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading) {
      setForm({
        storeName: settings.storeName || "",
        storeDescription: settings.storeDescription || "",
        logoIcon: settings.logoIcon || "",
        primaryColor: settings.primaryColor || "#7c3aed",
        secondaryColor: settings.secondaryColor || "#6d28d9",
        accentColor: settings.accentColor || "#a78bfa",
        contactEmail: settings.contactEmail || "",
      });
    }
  }, [loading, settings]);

  const handleSave = async () => {
    setSaving(true);
    await updateSettings(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const selectPreset = (preset: typeof presetColors[0]) => {
    setForm((prev) => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
    }));
  };

  if (loading) {
    return (
      <>
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Configurações</h1>
            <p className="admin-page-subtitle">Gerencie as configurações da sua loja</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", maxWidth: 700 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="admin-chart-card">
              <div className="skeleton" style={{ width: "200px", height: "24px", borderRadius: "4px", marginBottom: "1rem" }} />
              <div className="skeleton" style={{ width: "100%", height: "40px", borderRadius: "8px", marginBottom: "0.75rem" }} />
              <div className="skeleton" style={{ width: "100%", height: "40px", borderRadius: "8px" }} />
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Configurações</h1>
          <p className="admin-page-subtitle">Gerencie as configurações da sua loja</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Store Info */}
        <div className="admin-chart-card">
          <h3 className="admin-chart-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Store size={18} /> Informações da Loja
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Nome da Loja</label>
              <input
                className="form-input"
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Ícone / Logo (emoji ou letra)</label>
              <input
                className="form-input"
                value={form.logoIcon}
                onChange={(e) => setForm({ ...form, logoIcon: e.target.value })}
                maxLength={4}
                style={{ maxWidth: 100, textAlign: "center", fontSize: "1.2rem" }}
              />
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                Exibido no header da loja. Ex: N, 🎮, 🛒
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Descrição</label>
              <textarea
                className="form-input"
                rows={3}
                value={form.storeDescription}
                onChange={(e) => setForm({ ...form, storeDescription: e.target.value })}
                style={{ resize: "vertical" }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">E-mail de Contato</label>
              <input
                className="form-input"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Theme Colors */}
        <div className="admin-chart-card">
          <h3 className="admin-chart-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Palette size={18} /> Cores do Tema
          </h3>

          {/* Color Presets */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label className="form-label" style={{ marginBottom: "0.6rem" }}>Temas Prontos</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {presetColors.map((preset) => {
                const isActive = form.primaryColor === preset.primary;
                return (
                  <button
                    key={preset.name}
                    onClick={() => selectPreset(preset)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.4rem 0.75rem",
                      borderRadius: "8px",
                      border: isActive ? `2px solid ${preset.primary}` : "1px solid var(--border-color)",
                      background: isActive ? `${preset.primary}20` : "var(--bg-primary)",
                      color: isActive ? preset.primary : "var(--text-secondary)",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{
                      width: 14, height: 14, borderRadius: "50%",
                      background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`,
                    }} />
                    {preset.name}
                    {isActive && <Check size={12} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Colors */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Cor Primária</label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <input
                  type="color"
                  value={form.primaryColor}
                  onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                  style={{ width: 44, height: 36, border: "none", cursor: "pointer", borderRadius: 6, padding: 0 }}
                />
                <input
                  className="form-input"
                  value={form.primaryColor}
                  onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                  style={{ flex: 1, fontFamily: "monospace" }}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Cor Secundária</label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <input
                  type="color"
                  value={form.secondaryColor}
                  onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })}
                  style={{ width: 44, height: 36, border: "none", cursor: "pointer", borderRadius: 6, padding: 0 }}
                />
                <input
                  className="form-input"
                  value={form.secondaryColor}
                  onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })}
                  style={{ flex: 1, fontFamily: "monospace" }}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Cor de Destaque</label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <input
                  type="color"
                  value={form.accentColor}
                  onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                  style={{ width: 44, height: 36, border: "none", cursor: "pointer", borderRadius: 6, padding: 0 }}
                />
                <input
                  className="form-input"
                  value={form.accentColor}
                  onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                  style={{ flex: 1, fontFamily: "monospace" }}
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div style={{ marginTop: "1rem", padding: "1rem", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--bg-primary)" }}>
            <label className="form-label" style={{ marginBottom: "0.6rem" }}>Preview</label>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: `linear-gradient(135deg, ${form.primaryColor}, ${form.secondaryColor})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 800, fontSize: "1rem",
              }}>
                {form.logoIcon}
              </div>
              <span style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "0.03em", color: form.primaryColor }}>
                {form.storeName}
              </span>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
              <button style={{
                padding: "0.4rem 1rem", borderRadius: 6, border: "none",
                background: `linear-gradient(135deg, ${form.primaryColor}, ${form.secondaryColor})`,
                color: "white", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer",
              }}>
                Botão Primário
              </button>
              <button style={{
                padding: "0.4rem 1rem", borderRadius: 6,
                border: `1px solid ${form.accentColor}`,
                background: "transparent",
                color: form.accentColor, fontWeight: 600, fontSize: "0.8rem", cursor: "pointer",
              }}>
                Botão Secundário
              </button>
            </div>
          </div>
        </div>


        {/* Notifications */}
        <div className="admin-chart-card">
          <h3 className="admin-chart-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Bell size={18} /> Notificações
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              "Notificação de novo pedido",
              "Notificação de pagamento confirmado",
              "Alerta de estoque baixo",
              "Notificação de novo cliente",
            ].map((item) => (
              <label key={item} style={{ display: "flex", alignItems: "center", gap: "0.65rem", fontSize: "0.85rem", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked style={{ accentColor: form.primaryColor }} />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="admin-chart-card" style={{ gridColumn: "1 / -1" }}>
          <h3 className="admin-chart-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Shield size={18} /> Segurança
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Senha Atual</label>
              <input className="form-input" type="password" placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label className="form-label">Nova Senha</label>
              <input className="form-input" type="password" placeholder="••••••••" />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", gridColumn: "1 / -1" }}>
          <button
            className="btn-admin primary"
            style={{ padding: "0.65rem 1.5rem" }}
            onClick={handleSave}
            disabled={saving}
          >
            <Save size={16} />
            {saving ? "Salvando..." : "Salvar Configurações"}
          </button>
          {saved && (
            <span style={{ color: "var(--green-online)", fontSize: "0.85rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <Check size={16} /> Configurações salvas com sucesso!
            </span>
          )}
        </div>
      </div>
    </>
  );
}
