"use client";

import { X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const portalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = document.createElement("div");
    el.id = "modal-portal";
    document.body.appendChild(el);
    portalRef.current = el;
    setMounted(true);
    return () => { document.body.removeChild(el); };
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", handleEsc);
      return () => { window.removeEventListener("keydown", handleEsc); document.body.style.overflow = ""; };
    } else {
      document.body.style.overflow = "";
    }
  }, [open, onClose]);

  if (!open || !mounted || !portalRef.current) return null;

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        animation: "fadeIn 0.15s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#111118",
          border: "1px solid rgba(124, 58, 237, 0.2)",
          borderRadius: 16,
          width: "100%",
          maxWidth: 520,
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(124,58,237,0.1)",
          animation: "modalSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.15rem 1.5rem",
          borderBottom: "1px solid rgba(124, 58, 237, 0.15)",
        }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f1f1f6", margin: 0 }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(124, 58, 237, 0.1)",
              border: "1px solid rgba(124, 58, 237, 0.2)",
              borderRadius: 8,
              color: "#9ca3af",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#f1f1f6"; e.currentTarget.style.background = "rgba(124, 58, 237, 0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#9ca3af"; e.currentTarget.style.background = "rgba(124, 58, 237, 0.1)"; }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "1.5rem" }}>
          {children}
        </div>
      </div>
    </div>,
    portalRef.current
  );
}

/* ===== Reusable sub-components for modal forms ===== */

export function ModalFormGroup({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#9ca3af", marginBottom: "0.4rem" }}>
        {label}{required && <span style={{ color: "#a78bfa" }}> *</span>}
      </label>
      {children}
    </div>
  );
}

export function ModalInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: "0.6rem 0.85rem",
        background: "#0a0a0f",
        border: "1px solid rgba(124, 58, 237, 0.2)",
        borderRadius: 8,
        color: "#f1f1f6",
        fontSize: "0.85rem",
        outline: "none",
        transition: "border-color 0.2s",
        boxSizing: "border-box",
        ...props.style,
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(124, 58, 237, 0.5)"; props.onFocus?.(e); }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(124, 58, 237, 0.2)"; props.onBlur?.(e); }}
    />
  );
}

export function ModalSelect(props: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      {...props}
      style={{
        width: "100%",
        padding: "0.6rem 0.85rem",
        background: "#0a0a0f",
        border: "1px solid rgba(124, 58, 237, 0.2)",
        borderRadius: 8,
        color: "#f1f1f6",
        fontSize: "0.85rem",
        outline: "none",
        cursor: "pointer",
        boxSizing: "border-box",
        ...props.style,
      }}
    >
      {props.children}
    </select>
  );
}

export function ModalTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      style={{
        width: "100%",
        padding: "0.6rem 0.85rem",
        background: "#0a0a0f",
        border: "1px solid rgba(124, 58, 237, 0.2)",
        borderRadius: 8,
        color: "#f1f1f6",
        fontSize: "0.85rem",
        outline: "none",
        resize: "vertical",
        minHeight: 80,
        boxSizing: "border-box",
        ...props.style,
      }}
    />
  );
}

export function ModalRow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
      {children}
    </div>
  );
}

export function ModalActions({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "flex-end",
      gap: "0.65rem",
      marginTop: "0.75rem",
      paddingTop: "1rem",
      borderTop: "1px solid rgba(124, 58, 237, 0.12)",
    }}>
      {children}
    </div>
  );
}

export function ModalBtnPrimary({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      style={{
        padding: "0.55rem 1.25rem",
        background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
        border: "none",
        borderRadius: 8,
        color: "white",
        fontSize: "0.82rem",
        fontWeight: 600,
        cursor: props.disabled ? "not-allowed" : "pointer",
        opacity: props.disabled ? 0.6 : 1,
        transition: "all 0.2s",
        fontFamily: "'Inter', system-ui, sans-serif",
        ...props.style,
      }}
    >
      {children}
    </button>
  );
}

export function ModalBtnSecondary({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      style={{
        padding: "0.55rem 1.25rem",
        background: "transparent",
        border: "1px solid rgba(124, 58, 237, 0.25)",
        borderRadius: 8,
        color: "#9ca3af",
        fontSize: "0.82rem",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.2s",
        fontFamily: "'Inter', system-ui, sans-serif",
        ...props.style,
      }}
    >
      {children}
    </button>
  );
}

export function ModalError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div style={{
      background: "rgba(239, 68, 68, 0.1)",
      border: "1px solid rgba(239, 68, 68, 0.3)",
      color: "#ef4444",
      padding: "0.55rem 0.85rem",
      borderRadius: 8,
      fontSize: "0.8rem",
      fontWeight: 500,
      marginBottom: "0.5rem",
    }}>
      {message}
    </div>
  );
}
