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

function DiscordIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <circle cx="12" cy="12" r="10" />
      <path d="M8.5 17c0 0 1.5-2 3.5-2s3.5 2 3.5 2" />
      <circle cx="9" cy="10" r="0.5" fill="currentColor" />
      <circle cx="15" cy="10" r="0.5" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

export default function Footer() {
  const { settings } = useSettings();

  const socials = [
    { url: settings.instagramUrl, label: "Instagram", icon: <Instagram size={18} /> },
    { url: settings.whatsappUrl, label: "WhatsApp", icon: <WhatsAppIcon size={18} /> },
    { url: settings.discordUrl, label: "Discord", icon: <DiscordIcon size={18} /> },
    { url: settings.tiktokUrl, label: "TikTok", icon: <TikTokIcon size={18} /> },
  ].filter((s) => s.url);

  return (
    <footer
      className="footer"
      style={{
        ...(settings.footerBgColor ? { background: settings.footerBgColor } : {}),
        ...(settings.footerTextColor ? {
          color: settings.footerTextColor,
          ["--footer-text" as string]: settings.footerTextColor,
        } : {}),
      }}
    >
      <div className="footer-inner">
        {/* Left: Description */}
        <div>
          <div className="footer-logo">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.storeName} style={{ width: 28, height: 28, borderRadius: 6, objectFit: "cover" }} />
            ) : (
              <div className="logo-icon" style={{ width: 28, height: 28, fontSize: "0.8rem", borderRadius: 6 }}>{settings.logoIcon}</div>
            )}
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
        {socials.length > 0 && (
          <div>
            <h4 className="footer-heading">Confira nossas redes sociais</h4>
            <div className="footer-socials">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  className="footer-social"
                  aria-label={social.label}
                  title={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="footer-bottom">
        © 2026 {settings.storeName}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
