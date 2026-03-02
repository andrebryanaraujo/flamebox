"use client";

import Link from "next/link";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

interface SidebarCategory {
  slug: string;
  name: string;
  emoji: string | null;
  subcategories: { slug: string; name: string }[];
}

interface Props {
  activeCategorySlug: string;
  activeSubcategory?: string;
}

export default function CategorySidebar({ activeCategorySlug, activeSubcategory }: Props) {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<SidebarCategory[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: SidebarCategory[]) => {
        setCategories(data);
        setExpanded(
          Object.fromEntries(data.map((c) => [c.slug, c.slug === activeCategorySlug]))
        );
      });
  }, [activeCategorySlug]);

  const filtered = categories.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (slug: string) => {
    setExpanded((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-title">Categorias</div>
      <div className="sidebar-subtitle">Encontre sua categoria favorita</div>

      <div className="sidebar-search-wrapper">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Pesquisar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.map((cat) => (
        <div key={cat.slug}>
          <div
            className={`sidebar-cat-item ${cat.slug === activeCategorySlug ? "active" : ""}`}
            onClick={() => toggle(cat.slug)}
          >
            <span>{cat.emoji} {cat.name}</span>
            {expanded[cat.slug] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>

          {expanded[cat.slug] && cat.subcategories.map((sub) => (
            <Link
              key={sub.slug}
              href={`/categoria/${cat.slug}?sub=${sub.slug}`}
              className={`sidebar-sub-item ${activeSubcategory === sub.slug ? "active" : ""}`}
            >
              {sub.name}
            </Link>
          ))}
        </div>
      ))}
    </aside>
  );
}
