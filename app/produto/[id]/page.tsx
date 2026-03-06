"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Zap, CreditCard, Minus, Plus } from "lucide-react";
import { formatPrice } from "@/lib/data";
import { useCart } from "@/lib/cart-context";
import { use, useState, useEffect } from "react";
import ProductVariations from "@/components/ProductVariations";
import ProductImageCarousel from "@/components/ProductImageCarousel";

interface Props {
  params: Promise<{ id: string }>;
}

interface ProductData {
  id: string;
  name: string;
  price: number;
  discount?: number | null;
  stock: number;
  description: string;
  image: string;
  images: string[];
  categorySlug: string;
  categoryId: string;
  subcategoryId: string | null;
  variantGroupId: string | null;
  subcategory?: { id: string; name: string; slug: string } | null;
}

export default function ProductPage({ params }: Props) {
  const { id } = use(params);
  const { addItem } = useCart();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [allVariants, setAllVariants] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);

        if (data.variantGroupId) {
          fetch(`/api/products?variantGroupId=${data.variantGroupId}`)
            .then((res) => res.json())
            .then((products: ProductData[]) => {
              setAllVariants(products);
            });
        }
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
  }, [id]);

  if (loading) {
    return (
      <div className="container-main">
        <div className="breadcrumb" style={{ marginTop: "1rem" }}>
          <div className="skeleton" style={{ width: "200px", height: "16px", borderRadius: "4px" }} />
        </div>
        <div className="product-detail">
          <div className="skeleton" style={{ width: "100%", height: "400px", borderRadius: "12px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="skeleton" style={{ width: "80%", height: "32px", borderRadius: "6px" }} />
            <div className="skeleton" style={{ width: "40%", height: "28px", borderRadius: "4px" }} />
            <div className="skeleton" style={{ width: "150px", height: "30px", borderRadius: "20px" }} />
            <div className="skeleton" style={{ width: "100%", height: "200px", borderRadius: "12px" }} />
          </div>
          <div className="skeleton" style={{ width: "100%", height: "350px", borderRadius: "12px" }} />
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
  const maxQty = Math.min(product.stock, 99);

  const hasDiscount = product.discount != null && product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - product.discount! / 100)
    : product.price;

  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));
  const handleIncrement = () => setQuantity((q) => Math.min(maxQty, q + 1));

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  };

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
        {/* Column 1: Product Image Carousel */}
        <ProductImageCarousel
          images={[product.image, ...(product.images ?? [])].filter(Boolean)}
          alt={product.name}
        />

        {/* Column 2: Product Info + Variations */}
        <div className="product-detail-info">
          <h1 className="product-detail-name">{product.name}</h1>

          <div className="product-detail-price-row">
            {hasDiscount ? (
              <>
                <span className="product-detail-price-old">{formatPrice(product.price)}</span>
                <span className="product-detail-price">{formatPrice(discountedPrice)}</span>
                <span className="product-detail-discount-badge">-{product.discount}%</span>
              </>
            ) : (
              <span className="product-detail-price">{formatPrice(product.price)}</span>
            )}
          </div>

          <div className="delivery-badge">
            <Zap size={14} />
            Entrega Automática
          </div>

          {product.description && (
            <p className="product-detail-desc">{product.description}</p>
          )}

          {/* Variations Panel */}
          {product.variantGroupId && allVariants.length > 0 && (
            <ProductVariations
              currentProductId={product.id}
              variants={allVariants}
              title="Variações"
            />
          )}
        </div>

        {/* Column 3: Purchase Sidebar */}
        <div className="product-detail-sidebar">
          <div className="sidebar-stock-section">
            <div className="sidebar-stock-label">
              {inStock ? "Estoque disponível" : "Esgotado"}
            </div>
            <div className="sidebar-stock-price">{formatPrice(discountedPrice)}</div>
            {hasDiscount && (
              <div className="sidebar-stock-price-old">{formatPrice(product.price)}</div>
            )}
            <div className="sidebar-stock-count">
              <span className={`dot ${inStock ? "in" : "out"}`} />
              {inStock ? (
                <span>{product.stock} Disponível</span>
              ) : (
                <span style={{ color: "#ef4444" }}>Indisponível</span>
              )}
            </div>
          </div>

          {inStock && (
            <div className="qty-selector">
              <button
                className="qty-selector-btn"
                onClick={handleDecrement}
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="qty-selector-value">{quantity}</span>
              <button
                className="qty-selector-btn"
                onClick={handleIncrement}
                disabled={quantity >= maxQty}
              >
                <Plus size={16} />
              </button>
            </div>
          )}

          <div className="sidebar-actions">
            <button
              className="btn-buy-now"
              disabled={!inStock}
              onClick={handleAddToCart}
            >
              Comprar agora
            </button>
            <button
              className="btn-add-cart"
              disabled={!inStock}
              onClick={handleAddToCart}
            >
              <ShoppingCart size={16} />
              Adicionar ao carrinho
            </button>
          </div>

          <div className="sidebar-payment-methods">
            <div className="sidebar-payment-title">Meios de pagamentos</div>
            <div className="sidebar-payment-options">
              <div className="sidebar-payment-option">
                <span>À vista</span>
                <CreditCard size={18} className="pix-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
