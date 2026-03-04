import React from "react";

export default function CartLoading() {
  return (
    <div className="container-main">
      {/* Title */}
      <div
        className="skeleton"
        style={{ width: "200px", height: "32px", borderRadius: "8px", marginBottom: "1.5rem" }}
      />

      <div className="cart-layout">
        {/* Cart items */}
        <div className="cart-items">
          {[1, 2, 3].map((i) => (
            <div key={i} className="cart-item">
              {/* Thumbnail */}
              <div
                className="skeleton"
                style={{ width: "80px", height: "80px", borderRadius: "8px", flexShrink: 0 }}
              />
              {/* Info */}
              <div className="cart-item-info" style={{ flex: 1 }}>
                <div className="skeleton" style={{ width: "70%", height: "18px", borderRadius: "4px", marginBottom: "0.5rem" }} />
                <div className="skeleton" style={{ width: "40%", height: "14px", borderRadius: "4px" }} />
              </div>
              {/* Controls */}
              <div className="cart-item-controls">
                <div className="skeleton" style={{ width: "28px", height: "28px", borderRadius: "6px" }} />
                <div className="skeleton" style={{ width: "28px", height: "20px", borderRadius: "4px" }} />
                <div className="skeleton" style={{ width: "28px", height: "28px", borderRadius: "6px" }} />
              </div>
              {/* Remove btn */}
              <div className="skeleton" style={{ width: "32px", height: "32px", borderRadius: "6px" }} />
            </div>
          ))}
        </div>

        {/* Summary sidebar */}
        <div className="cart-summary">
          <div className="skeleton" style={{ width: "55%", height: "22px", borderRadius: "6px", marginBottom: "1.25rem" }} />

          {[1, 2].map((i) => (
            <div key={i} className="cart-summary-row" style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="skeleton" style={{ width: "40%", height: "14px", borderRadius: "4px" }} />
              <div className="skeleton" style={{ width: "25%", height: "14px", borderRadius: "4px" }} />
            </div>
          ))}

          <div className="cart-summary-total" style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border-color)", paddingTop: "1rem", marginTop: "0.5rem" }}>
            <div className="skeleton" style={{ width: "30%", height: "18px", borderRadius: "4px" }} />
            <div className="skeleton" style={{ width: "35%", height: "18px", borderRadius: "4px" }} />
          </div>

          <div className="skeleton" style={{ width: "100%", height: "48px", borderRadius: "10px", marginTop: "1.25rem" }} />
        </div>
      </div>
    </div>
  );
}
