import { prisma } from "@/lib/prisma";
import CategoryCard from "@/components/CategoryCard";
import HomeBanner from "@/components/HomeBanner";
import ReferencesCarousel from "@/components/ReferencesCarousel";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    include: {
      subcategories: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="container-main">
      <HomeBanner />
      <h1 className="section-title">Escolha o Jogo</h1>
      <div className="categories-grid">
        {categories.map((cat) => (
          <CategoryCard key={cat.slug} category={cat} />
        ))}
      </div>
      <ReferencesCarousel />
    </div>
  );
}