import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  category: {
    slug: string;
    name: string;
    emoji: string | null;
    image: string;
    banner: string;
  };
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categoria/${category.slug}`} className="category-card">
      <Image
        src={category.image}
        alt={category.name}
        fill
        sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
        className="category-card-bg"
      />
      <div className="category-card-overlay">
        <div className="category-card-name">
          {category.emoji} {category.name}
        </div>
        <div className="category-card-desc">Visualizar produtos da categoria</div>
        <span className="btn-card">
          Ver produtos <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}
