"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { formatPrice } from "@/lib/data";

interface VariantProduct {
  id: string;
  name: string;
  price: number;
  discount?: number | null;
  stock: number;
  image: string;
}

interface Props {
  currentProductId: string;
  variants: VariantProduct[];
  title: string;
}

function VariationPriceDisplay({ price, discount }: { price: number; discount?: number | null }) {
  const hasDiscount = discount != null && discount > 0;
  const discountedPrice = hasDiscount ? price * (1 - discount / 100) : price;

  return (
    <div className="variation-pricing">
      {hasDiscount && (
        <>
          <div className="variation-price-old">{formatPrice(price)}</div>
          <span className="variation-discount">-{discount}%</span>
        </>
      )}
      <div className="variation-price">{formatPrice(discountedPrice)}</div>
    </div>
  );
}

export default function ProductVariations({ currentProductId, variants, title }: Props) {
  const [search, setSearch] = useState("");

  if (variants.length === 0) return null;

  const current = variants.find((v) => v.id === currentProductId);
  const others = variants.filter((v) => v.id !== currentProductId);

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
            <VariationPriceDisplay price={current.price} discount={current.discount} />
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
                <VariationPriceDisplay price={variant.price} discount={variant.discount} />
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
