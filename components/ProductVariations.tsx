"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { formatPrice } from "@/lib/data";

interface VariantProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
}

interface Props {
  currentProductId: string;
  variants: VariantProduct[];
  title: string;
}

function VariationPriceDisplay({ price, maxPrice }: { price: number; maxPrice: number }) {
  const hasDiscount = maxPrice > price;
  const discountPct = hasDiscount ? Math.round(((maxPrice - price) / maxPrice) * 100) : 0;

  return (
    <div className="variation-pricing">
      {hasDiscount && (
        <>
          <div className="variation-price-old">{formatPrice(maxPrice)}</div>
          <span className="variation-discount">-{discountPct}%</span>
        </>
      )}
      <div className="variation-price">{formatPrice(price)}</div>
    </div>
  );
}

export default function ProductVariations({ currentProductId, variants, title }: Props) {
  const [search, setSearch] = useState("");

  if (variants.length === 0) return null;

  const current = variants.find((v) => v.id === currentProductId);
  const others = variants.filter((v) => v.id !== currentProductId);

  // Calculate the max price among all variants for discount display
  const maxPrice = useMemo(
    () => Math.max(...variants.map((v) => v.price)),
    [variants]
  );

  const filtered = others.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="variations-panel">
      <div className="variations-header">
        <h3 className="variations-title">Variações</h3>
        <p className="variations-subtitle">Selecione o produto desejado abaixo.</p>
      </div>

      {/* Currently selected — separate card */}
      {current && (
        <div className="variation-item selected">
          <div className="variation-selected-badge">Selecionado</div>
          <div className="variation-content">
            <Image
              src={current.image}
              alt={current.name}
              width={48}
              height={48}
              className="variation-image"
            />
            <div className="variation-info">
              <div className="variation-name">{current.name}</div>
              <div className="variation-stock">
                Disponível ( {current.stock} )
              </div>
            </div>
            <VariationPriceDisplay price={current.price} maxPrice={maxPrice} />
          </div>
        </div>
      )}

      {/* Search — between selected and list */}
      {others.length > 2 && (
        <div className="variations-search">
          <Search size={15} className="variations-search-icon" />
          <input
            type="text"
            placeholder="Pesquisar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Other variants — grouped in single container */}
      {filtered.length > 0 && (
        <div
          className="variations-group"
          style={others.length > 2 ? { maxHeight: 176 } : undefined}
        >
          {filtered.map((variant) => (
            <Link
              key={variant.id}
              href={`/produto/${variant.id}`}
              className="variation-item"
            >
              <div className="variation-content">
                <Image
                  src={variant.image}
                  alt={variant.name}
                  width={48}
                  height={48}
                  className="variation-image"
                />
                <div className="variation-info">
                  <div className="variation-name">{variant.name}</div>
                  <div className="variation-stock">
                    Disponível ( {variant.stock} )
                  </div>
                </div>
                <VariationPriceDisplay price={variant.price} maxPrice={maxPrice} />
              </div>
            </Link>
          ))}
        </div>
      )}
      {filtered.length === 0 && search && (
        <div style={{ padding: "1rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.82rem" }}>
          Nenhuma variação encontrada.
        </div>
      )}
    </div>
  );
}
