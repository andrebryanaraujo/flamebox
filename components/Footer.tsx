"use client";

import { Instagram } from "lucide-react";
import { useSettings } from "@/lib/settings-context";

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Left: Description */}
        <div>
          <div className="footer-logo">
            <div className="logo-icon" style={{ width: 28, height: 28, fontSize: "0.8rem", borderRadius: 6 }}>{settings.logoIcon}</div>
            {settings.storeName}
          </div>
          <p className="footer-desc">
            {settings.storeDescription}
          </p>
        </div>

        {/* Center: Policies */}
        <div>
          <h4 className="footer-heading">Políticas</h4>
          <a href="#" className="footer-link">Termos de serviço</a>
          <a href="#" className="footer-link">Política de Cookies</a>
        </div>

        {/* Right: Socials */}
        <div>
          <h4 className="footer-heading">Confira nossas redes sociais</h4>
          <div className="footer-socials">
            <a href="#" className="footer-social" aria-label="Instagram" title="Instagram">
              <Instagram size={18} />
            </a>
            <a href="#" className="footer-social" aria-label="WhatsApp" title="WhatsApp">
              <WhatsAppIcon size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 {settings.storeName}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
