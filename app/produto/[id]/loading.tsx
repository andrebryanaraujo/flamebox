import React from "react";

export default function ProductLoading() {
  return (
    <div className="container-main">
      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ marginTop: "1rem" }}>
        <div className="skeleton" style={{ width: "220px", height: "16px", borderRadius: "4px" }} />
      </div>

      <div className="product-detail">
        {/* Column 1: Image Carousel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div
            className="skeleton"
            style={{ width: "100%", height: "380px", borderRadius: "12px" }}
          />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="skeleton"
                style={{ width: "68px", height: "68px", borderRadius: "8px", flexShrink: 0 }}
              />
            ))}
          </div>
        </div>

        {/* Column 2: Info */}
        <div className="product-detail-info" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Title */}
          <div className="skeleton" style={{ width: "85%", height: "32px", borderRadius: "6px" }} />
          {/* Price */}
          <div className="skeleton" style={{ width: "45%", height: "28px", borderRadius: "4px" }} />
          {/* Badge */}
          <div className="skeleton" style={{ width: "160px", height: "30px", borderRadius: "20px" }} />
          {/* Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div className="skeleton" style={{ width: "100%", height: "14px", borderRadius: "4px" }} />
            <div className="skeleton" style={{ width: "90%", height: "14px", borderRadius: "4px" }} />
            <div className="skeleton" style={{ width: "75%", height: "14px", borderRadius: "4px" }} />
          </div>
          {/* Variations placeholder */}
          <div className="skeleton" style={{ width: "100%", height: "120px", borderRadius: "12px" }} />
        </div>

        {/* Column 3: Sidebar */}
        <div className="product-detail-sidebar">
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="skeleton" style={{ width: "60%", height: "16px", borderRadius: "4px" }} />
            <div className="skeleton" style={{ width: "50%", height: "32px", borderRadius: "6px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div className="skeleton" style={{ width: "10px", height: "10px", borderRadius: "50%" }} />
              <div className="skeleton" style={{ width: "80px", height: "14px", borderRadius: "4px" }} />
            </div>
            {/* Qty + buttons */}
            <div className="skeleton" style={{ width: "100%", height: "44px", borderRadius: "8px" }} />
            <div className="skeleton" style={{ width: "100%", height: "44px", borderRadius: "8px" }} />
            <div className="skeleton" style={{ width: "100%", height: "44px", borderRadius: "8px" }} />
            {/* Payment section */}
            <div className="skeleton" style={{ width: "40%", height: "14px", borderRadius: "4px", marginTop: "0.5rem" }} />
            <div className="skeleton" style={{ width: "100%", height: "50px", borderRadius: "8px" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
