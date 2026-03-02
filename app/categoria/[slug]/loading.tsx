import React from "react";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { Search } from "lucide-react";

export default function CategoryLoading() {
  return (
    <div className="container-main">
      {/* Breadcrumb Skeleton */}
      <div className="breadcrumb" style={{ marginTop: "1rem" }}>
        <div className="skeleton" style={{ width: "200px", height: "16px", borderRadius: "4px" }} />
      </div>

      <div className="category-layout">
        {/* Sidebar Skeleton */}
        <aside className="sidebar">
          <div className="sidebar-search-wrapper">
            <Search className="search-icon" size={16} />
            <input type="text" placeholder="Buscar categoria..." disabled style={{ backgroundColor: "var(--bg-primary)" }} />
          </div>

          <div className="sidebar-menu">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ marginBottom: "1rem" }}>
                <div className="skeleton" style={{ width: "70%", height: "24px", borderRadius: "6px", marginBottom: "0.5rem" }} />
                <div className="skeleton" style={{ width: "50%", height: "18px", borderRadius: "4px", marginLeft: "1rem", marginBottom: "0.4rem" }} />
                <div className="skeleton" style={{ width: "60%", height: "18px", borderRadius: "4px", marginLeft: "1rem" }} />
              </div>
            ))}
          </div>
        </aside>

        <div style={{ flex: 1 }}>
          {/* Banner Skeleton */}
          <div className="skeleton" style={{ width: "100%", height: "180px", borderRadius: "12px", marginBottom: "2rem" }} />

          {/* Subcategory Group Skeleton */}
          <div className="subcategory-group">
            <div className="skeleton" style={{ width: "150px", height: "24px", borderRadius: "6px", marginBottom: "1.25rem" }} />
            <div className="products-grid">
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
