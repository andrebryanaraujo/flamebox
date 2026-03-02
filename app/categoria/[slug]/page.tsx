import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CategorySidebar from "@/components/CategorySidebar";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sub?: string }>;
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { sub } = await searchParams;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: { subcategories: true },
  });

  if (!category) notFound();

  const productWhere: Record<string, unknown> = { categoryId: category.id };
  if (sub) {
    const subcat = category.subcategories.find((s) => s.slug === sub);
    if (subcat) productWhere.subcategoryId = subcat.id;
  }

  const allProducts = await prisma.product.findMany({
    where: { categoryId: category.id },
    include: { subcategory: true },
    orderBy: { createdAt: "desc" },
  });

  // Group products by subcategory
  const grouped = category.subcategories.map((subcat) => ({
    ...subcat,
    products: allProducts.filter((p) => p.subcategoryId === subcat.id),
  }));

  // Products without subcategory
  const ungrouped = allProducts.filter((p) => !p.subcategoryId);

  // If sub filter is active, show only that subcategory
  const displayed = sub
    ? grouped.filter((g) => g.slug === sub)
    : grouped;

  return (
    <div className="container-main">
      {/* Breadcrumb */}
      <div className="breadcrumb" style={{ marginTop: "1rem" }}>
        <Link href="/">Início</Link>
        <span>›</span>
        <span>Categorias</span>
        <span>›</span>
        <span className="current">{category.emoji} {category.name}</span>
      </div>

      <div className="category-layout">
        <CategorySidebar activeCategorySlug={slug} activeSubcategory={sub} />

        <div style={{ flex: 1 }}>
          {/* Banner */}
          <div className="category-banner">
            <Image
              src={category.banner}
              alt={category.name}
              fill
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
            <div className="category-banner-overlay">
              <h1 className="category-banner-title">{category.name}</h1>
            </div>
          </div>

          {/* Products without subcategory */}
          {!sub && ungrouped.length > 0 && (
            <div className="subcategory-group">
              <div className="subcategory-heading">Todos os Produtos</div>
              <div className="products-grid">
                {ungrouped.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* Product sections by subcategory */}
          {displayed.map((group) => (
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
        </div>
      </div>
    </div>
  );
}
