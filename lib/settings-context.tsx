"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface SiteSettings {
  storeName: string;
  storeDescription: string;
  logoIcon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  contactEmail: string;
  pixKey: string;
  pixBeneficiary: string;
  backgroundImage: string;
  bannerUrl: string;
  logoUrl: string;
  faviconUrl: string;
  ogImageUrl: string;
}

const defaultSettings: SiteSettings = {
  storeName: "",
  storeDescription: "",
  logoIcon: "",
  primaryColor: "#7c3aed",
  secondaryColor: "#6d28d9",
  accentColor: "#a78bfa",
  contactEmail: "",
  pixKey: "",
  pixBeneficiary: "",
  backgroundImage: "",
  bannerUrl: "",
  logoUrl: "",
  faviconUrl: "",
  ogImageUrl: "",
};

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: async () => { },
  loading: true,
});

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = hex.replace("#", "").match(/.{2}/g);
  if (!match) return null;
  return { r: parseInt(match[0], 16), g: parseInt(match[1], 16), b: parseInt(match[2], 16) };
}

function applyThemeColors(settings: SiteSettings) {
  const root = document.documentElement;
  root.style.setProperty("--purple-primary", settings.primaryColor);
  root.style.setProperty("--purple-secondary", settings.secondaryColor);
  root.style.setProperty("--purple-light", settings.accentColor);

  const rgb = hexToRgb(settings.primaryColor);
  if (rgb) {
    const rgbStr = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
    root.style.setProperty("--purple-rgb", rgbStr);
    root.style.setProperty("--purple-glow", `rgba(${rgbStr}, 0.3)`);
    root.style.setProperty("--purple-border", `rgba(${rgbStr}, 0.4)`);
    root.style.setProperty("--border-color", `rgba(${rgbStr}, 0.2)`);
  }

  // Update page title
  if (settings.storeName) {
    document.title = `${settings.storeName} — Contas de Jogos`;
  }

  // Apply background image with high quality rendering
  if (settings.backgroundImage) {
    document.body.style.backgroundImage = `url(${settings.backgroundImage})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center center";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.minHeight = "100vh";
    (document.body.style as any).imageRendering = "high-quality";
    (document.body.style as any).imageRendering = "-webkit-optimize-contrast";
  } else {
    document.body.style.backgroundImage = "";
    document.body.style.minHeight = "";
    (document.body.style as any).imageRendering = "";
  }

  // Apply dynamic favicon
  if (settings.faviconUrl) {
    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = settings.faviconUrl;
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        applyThemeColors(data);
        setLoading(false);
        setReady(true);
      })
      .catch(() => {
        setLoading(false);
        setReady(true);
      });
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    applyThemeColors(merged);

    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(merged),
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {/* Hide content until theme is loaded to prevent color flash */}
      <div
        style={{
          opacity: ready ? 1 : 0,
          transition: "opacity 0.15s ease",
        }}
      >
        {children}
      </div>
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
