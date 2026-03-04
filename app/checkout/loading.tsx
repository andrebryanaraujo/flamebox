import React from "react";

export default function CheckoutLoading() {
  return (
    <div className="container-main">
      <div className="checkout-layout">
        <div className="checkout-card">
          {/* Title */}
          <div
            className="skeleton"
            style={{ width: "55%", height: "28px", borderRadius: "8px", marginBottom: "1rem" }}
          />
          {/* Subtitle */}
          <div
            className="skeleton"
            style={{ width: "75%", height: "14px", borderRadius: "4px", marginBottom: "1.75rem" }}
          />

          {/* Form fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
            <div>
              <div className="skeleton" style={{ width: "140px", height: "12px", borderRadius: "4px", marginBottom: "0.5rem" }} />
              <div className="skeleton" style={{ width: "100%", height: "42px", borderRadius: "8px" }} />
            </div>
            <div>
              <div className="skeleton" style={{ width: "60px", height: "12px", borderRadius: "4px", marginBottom: "0.5rem" }} />
              <div className="skeleton" style={{ width: "100%", height: "42px", borderRadius: "8px" }} />
            </div>
          </div>

          {/* Order summary box */}
          <div
            style={{
              border: "1px solid var(--border-color)",
              borderRadius: "10px",
              padding: "1rem",
              marginBottom: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
            }}
          >
            <div className="skeleton" style={{ width: "120px", height: "12px", borderRadius: "4px" }} />
            {[1, 2].map((i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="skeleton" style={{ width: "55%", height: "13px", borderRadius: "4px" }} />
                <div className="skeleton" style={{ width: "20%", height: "13px", borderRadius: "4px" }} />
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: "1px solid var(--border-color)",
                paddingTop: "0.5rem",
              }}
            >
              <div className="skeleton" style={{ width: "30%", height: "16px", borderRadius: "4px" }} />
              <div className="skeleton" style={{ width: "25%", height: "16px", borderRadius: "4px" }} />
            </div>
          </div>

          {/* Submit button */}
          <div className="skeleton" style={{ width: "100%", height: "48px", borderRadius: "10px" }} />
        </div>
      </div>
    </div>
  );
}
