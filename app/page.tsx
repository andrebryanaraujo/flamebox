import { prisma } from "@/lib/prisma";
import CategoryCard from "@/components/CategoryCard";

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
      <h1 className="section-title">Escolha o Jogo</h1>
      <div className="categories-grid">
        {categories.map((cat) => (
          <CategoryCard key={cat.slug} category={cat} />
        ))}
      </div>
    </div>
  );
}