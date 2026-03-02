import React from "react";

export default function ProductCardSkeleton() {
  return (
    <div className="product-card" style={{ borderColor: "var(--border-color)" }}>
      <div className="skeleton" style={{ width: "100%", height: "200px" }} />
      <div className="product-card-body" style={{ gap: "0.5rem", display: "flex", flexDirection: "column" }}>
        <div className="skeleton" style={{ height: "20px", width: "80%", borderRadius: "4px" }} />
        <div className="skeleton" style={{ height: "14px", width: "50%", borderRadius: "4px", marginTop: "0.25rem" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
          <div className="skeleton" style={{ height: "28px", width: "45%", borderRadius: "4px" }} />
          <div className="skeleton" style={{ height: "12px", width: "12px", borderRadius: "50%" }} />
        </div>

        <div className="skeleton" style={{ height: "14px", width: "40%", borderRadius: "4px" }} />
        <div className="skeleton" style={{ height: "38px", width: "100%", borderRadius: "8px", marginTop: "0.5rem" }} />
      </div>
    </div>
  );
}
