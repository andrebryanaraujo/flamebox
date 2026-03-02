import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/data";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="product-card">
      <Image
        src={product.image}
        alt={product.name}
        width={400}
        height={300}
        className="product-card-image"
      />
      <div className="product-card-body">
        <div className="product-card-name">{product.name}</div>
        <div className="product-card-price-row">
          <span className="product-card-price">{formatPrice(product.price)} +</span>
          <span className={`product-card-stock ${product.stock <= 0 ? "out" : ""}`} title={product.stock > 0 ? "Em estoque" : "Esgotado"} />
        </div>
        <div className="product-card-pix">À vista no PIX</div>
        <Link href={`/produto/${product.id}`} className="btn-details">
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
}
