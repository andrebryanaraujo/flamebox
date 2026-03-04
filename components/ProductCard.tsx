import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/data";
import { ArrowRight } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    discount?: number | null;
    image: string;
    stock: number;
    cardBackground?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const bg = product.cardBackground?.trim() || "";

  // Detect if it's a URL (image) vs CSS value (color/gradient)
  const isImage = bg.startsWith("http") || bg.startsWith("/");

  const cardStyle: React.CSSProperties = bg
    ? isImage
      ? { backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" }
      : { background: bg }
    : {};

  const hasDiscount = product.discount != null && product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - (product.discount! / 100))
    : product.price;

  return (
    <Link href={`/produto/${product.id}`} className="product-card" style={cardStyle}>
      {/* Thumbnail */}
      <div className="product-card-thumb">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="120px"
          className="product-card-thumb-img"
        />
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="product-card-discount-badge">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Info */}
      <div className="product-card-info">
        <div className="product-card-name">{product.name}</div>
        <div className="product-card-pix">À vista no PIX</div>

        {/* Price row */}
        {hasDiscount ? (
          <div className="product-card-price-block">
            <span className="product-card-price-old">{formatPrice(product.price)}</span>
            <span className="btn-card">
              {formatPrice(discountedPrice)} <ArrowRight size={13} />
            </span>
          </div>
        ) : (
          <span className="btn-card">
            {formatPrice(product.price)} <ArrowRight size={13} />
          </span>
        )}
      </div>
    </Link>
  );
}
