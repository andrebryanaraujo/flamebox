"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";

interface Subcategory {
  id: string;
  slug: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  discount?: number | null;
  stock: number;
  description: string;
  image: string;
  categorySlug: string;
  categoryId: string;
  subcategoryId: string | null;
}

interface SubcategoryGroup {
  id: string;
  slug: string;
  name: string;
  products: Product[];
}

interface Props {
  subcategories: Subcategory[];
  groups: SubcategoryGroup[];
  ungrouped: Product[];
}

export default function SubcategoryFilterPanel({ subcategories, groups, ungrouped }: Props) {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // Filter products based on active tab
  const displayedGroups = activeTab
    ? groups.filter((g) => g.slug === activeTab)
    : groups;

  const showUngrouped = !activeTab && ungrouped.length > 0;

  return (
    <>
      {/* Filter Tabs */}
      {subcategories.length > 0 && (
        <div className="filter-panel">
          <button
            className={`filter-tab ${activeTab === null ? "active" : ""}`}
            onClick={() => setActiveTab(null)}
          >
            Todos
          </button>
          {subcategories.map((sub) => (
            <button
              key={sub.slug}
              className={`filter-tab ${activeTab === sub.slug ? "active" : ""}`}
              onClick={() => setActiveTab(activeTab === sub.slug ? null : sub.slug)}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      {/* Ungrouped products */}
      {showUngrouped && (
        <div className="subcategory-group">
          <div className="subcategory-heading">Todos os Produtos</div>
          <div className="products-grid">
            {ungrouped.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Subcategory groups */}
      {displayedGroups.map((group) => (
        <div key={group.slug} className="subcategory-group">
          <div className="subcategory-heading">{group.name}</div>
          {group.products.length > 0 ? (
            <div className="products-grid">
              {group.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", padding: "1rem 0" }}>
              Nenhum produto disponível nesta subcategoria.
            </p>
          )}
        </div>
      ))}

      {/* Empty state */}
      {!showUngrouped && displayedGroups.length === 0 && (
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", textAlign: "center", padding: "2rem 0" }}>
          Nenhum produto encontrado.
        </p>
      )}
    </>
  );
}
