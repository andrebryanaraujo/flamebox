import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CategorySidebar from "@/components/CategorySidebar";
import SubcategoryFilterPanel from "@/components/SubcategoryFilterPanel";

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

  const allProducts = await prisma.product.findMany({
    where: { categoryId: category.id },
    include: { subcategory: true },
    orderBy: { createdAt: "desc" },
  });

  // Serialize products for client component (strip Date objects)
  const serializeProduct = (p: typeof allProducts[number]) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    stock: p.stock,
    description: p.description,
    image: p.image,
    categorySlug: p.categorySlug,
    categoryId: p.categoryId,
    subcategoryId: p.subcategoryId,
  });

  // Group products by subcategory
  const groups = category.subcategories.map((subcat) => ({
    id: subcat.id,
    slug: subcat.slug,
    name: subcat.name,
    products: allProducts
      .filter((p) => p.subcategoryId === subcat.id)
      .map(serializeProduct),
  }));

  // Products without subcategory
  const ungrouped = allProducts
    .filter((p) => !p.subcategoryId)
    .map(serializeProduct);

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

          {/* Filter Panel + Products */}
          <SubcategoryFilterPanel
            subcategories={category.subcategories.map((s) => ({ id: s.id, slug: s.slug, name: s.name }))}
            groups={groups}
            ungrouped={ungrouped}
          />
        </div>
      </div>
    </div>
  );
}
