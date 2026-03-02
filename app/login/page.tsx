"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { useSettings } from "@/lib/settings-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { settings } = useSettings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Login simulado! Em breve esta funcionalidade estará disponível.");
  };

  return (
    <div className="container-main">
      <div className="login-layout">
        <div className="login-card">
          <h1 className="login-title">Entrar na {settings.storeName || "Loja"}</h1>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-login">
              <LogIn size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />
              Entrar
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Não tem uma conta?{" "}
            <Link href="#" style={{ color: "var(--purple-light)" }}>Criar conta</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
