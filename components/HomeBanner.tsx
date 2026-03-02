"use client";

import { useSettings } from "@/lib/settings-context";

export default function HomeBanner() {
  const { settings } = useSettings();

  if (!settings.bannerUrl) return null;

  return (
    <div
      style={{
        width: "100%",
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: "1.5rem",
        border: "1px solid var(--border-color)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
      }}
    >
      <img
        src={settings.bannerUrl}
        alt={`${settings.storeName} banner`}
        style={{
          width: "100%",
          height: "auto",
          maxHeight: 340,
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}
