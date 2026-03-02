"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  loading?: boolean;
}

export default function ConfirmDialog({
  open, onConfirm, onCancel, title = "Confirmar exclusão", message, confirmText = "Excluir", loading = false,
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);
  const portalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = document.createElement("div");
    el.id = "confirm-portal";
    document.body.appendChild(el);
    portalRef.current = el;
    setMounted(true);
    return () => { document.body.removeChild(el); };
  }, []);

  useEffect(() => {
    if (open) {
      const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [open, onCancel]);

  if (!open || !mounted || !portalRef.current) return null;

  return createPortal(
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#111118",
          border: "1px solid rgba(239, 68, 68, 0.25)",
          borderRadius: 16,
          width: "100%",
          maxWidth: 400,
          padding: "1.75rem",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 30px rgba(239, 68, 68, 0.08)",
          animation: "modalSlideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          textAlign: "center",
        }}
      >
        {/* Icon */}
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: "rgba(239, 68, 68, 0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1rem",
        }}>
          <AlertTriangle size={24} color="#ef4444" />
        </div>

        {/* Title */}
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#f1f1f6", margin: "0 0 0.5rem" }}>
          {title}
        </h3>

        {/* Message */}
        <p style={{ fontSize: "0.85rem", color: "#9ca3af", margin: "0 0 1.5rem", lineHeight: 1.5 }}>
          {message}
        </p>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.65rem", justifyContent: "center" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "0.55rem 1.25rem",
              background: "transparent",
              border: "1px solid rgba(124, 58, 237, 0.25)",
              borderRadius: 8,
              color: "#9ca3af",
              fontSize: "0.82rem",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: "0.55rem 1.25rem",
              background: "linear-gradient(135deg, #dc2626, #b91c1c)",
              border: "none",
              borderRadius: 8,
              color: "white",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            {loading ? "Excluindo..." : confirmText}
          </button>
        </div>
      </div>
    </div>,
    portalRef.current
  );
}
