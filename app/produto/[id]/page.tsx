"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, CreditCard } from "lucide-react";
import { formatPrice } from "@/lib/data";
import { useCart } from "@/lib/cart-context";
import { use, useState, useEffect } from "react";
import ProductVariations from "@/components/ProductVariations";

interface Props {
  params: Promise<{ id: string }>;
}

interface ProductData {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  categorySlug: string;
  categoryId: string;
  subcategoryId: string | null;
  subcategory?: { id: string; name: string; slug: string } | null;
}

export default function ProductPage({ params }: Props) {
  const { id } = use(params);
  const { addItem } = useCart();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [allVariants, setAllVariants] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);

        // Fetch all products from same subcategory (if exists)
        if (data.subcategoryId) {
          fetch(`/api/products?subcategoryId=${data.subcategoryId}`)
            .then((res) => res.json())
            .then((products: ProductData[]) => {
              setAllVariants(products);
            });
        }
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container-main">
        <div className="breadcrumb" style={{ marginTop: "1rem" }}>
          <div className="skeleton" style={{ width: "200px", height: "16px", borderRadius: "4px" }} />
        </div>
        <div className="product-detail">
          <div className="skeleton" style={{ width: "100%", height: "450px", borderRadius: "12px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="skeleton" style={{ width: "80%", height: "32px", borderRadius: "6px" }} />
            <div className="skeleton" style={{ width: "30%", height: "24px", borderRadius: "4px" }} />
            <div className="skeleton" style={{ width: "150px", height: "18px", borderRadius: "4px" }} />
            <div style={{ marginTop: "1rem" }}>
              <div className="skeleton" style={{ width: "100%", height: "16px", borderRadius: "4px", marginBottom: "0.5rem" }} />
              <div className="skeleton" style={{ width: "90%", height: "16px", borderRadius: "4px", marginBottom: "0.5rem" }} />
              <div className="skeleton" style={{ width: "95%", height: "16px", borderRadius: "4px" }} />
            </div>
            <div className="skeleton" style={{ width: "200px", height: "44px", borderRadius: "8px", marginTop: "1rem" }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-main" style={{ textAlign: "center", padding: "4rem 0" }}>
        <h2>Produto não encontrado</h2>
        <Link href="/" className="btn-back-home" style={{ marginTop: "1rem" }}>Voltar ao início</Link>
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <div className="container-main">
      <div className="breadcrumb" style={{ marginTop: "1rem" }}>
        <Link href="/">Início</Link>
        <span>›</span>
        <Link href={`/categoria/${product.categorySlug}`}>Categoria</Link>
        <span>›</span>
        <span className="current">{product.name}</span>
      </div>

      <div className="product-detail">
        <Image
          src={product.image}
          alt={product.name}
          width={600}
          height={450}
          className="product-detail-image"
        />

        <div className="product-detail-info">
          <h1 className="product-detail-name">{product.name}</h1>

          <div className="product-detail-price">{formatPrice(product.price)}</div>
          <div className="product-detail-pix">À vista no PIX</div>

          <div className="product-detail-stock">
            <span className={`dot ${inStock ? "in" : "out"}`} />
            {inStock
              ? <span style={{ color: "var(--green-online)" }}>{product.stock} em estoque</span>
              : <span style={{ color: "#ef4444" }}>Esgotado</span>
            }
          </div>

          <p className="product-detail-desc">{product.description}</p>

          {/* Variations Panel */}
          {product.subcategoryId && allVariants.length > 0 && (
            <ProductVariations
              currentProductId={product.id}
              variants={allVariants}
              title={product.subcategory?.name || "Variações"}
            />
          )}

          <button
            className="btn-add-cart"
            disabled={!inStock}
            onClick={() => addItem(product)}
          >
            <ShoppingCart size={18} />
            Adicionar ao Carrinho
          </button>

          <div className="pix-info">
            <div className="pix-info-title">
              <CreditCard size={16} /> Pagamento via PIX
            </div>
            <p className="pix-info-text">
              Pague via PIX e receba sua conta instantaneamente após a confirmação do pagamento.
              O PIX é processado em segundos e é a forma mais rápida de pagamento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
