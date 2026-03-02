import { prisma } from "../lib/prisma";

// Instead of rewriting all data, we will import it from our static file
// Note: We need to use tsc or just tsx to run this, so we'll use ts-node or tsx via package.json
// But to keep it simple, I'll write the raw data here for the seed to avoid module resolution issues
// with Next.js path aliases in plain Node.

const categories = [
  {
    slug: "blox-fruits",
    name: "Blox Fruits",
    emoji: "🏴‍☠️",
    image: "/images/categories/blox_fruits.png",
    banner: "/images/banners/blox_fruits_banner.png",
    subcategories: [
      { slug: "fruta-no-inventario", name: "Fruta no Inventário (Garantida)" },
      { slug: "contas-v4", name: "Contas com V4 (Full/Tier 1)" },
      { slug: "contas-god-human", name: "Contas com God Human" },
    ]
  },
  {
    slug: "escape-tsunami",
    name: "Escape Tsunami",
    emoji: "🌊",
    image: "/images/categories/escape_tsunami.png",
    banner: "/images/banners/escape_tsunami_banner.png",
    subcategories: [
      { slug: "brainrot-premium", name: "Brainrot Premium" },
      { slug: "contas-iniciantes", name: "Contas Iniciantes" },
    ]
  }
];

const products = [
  {
    name: "CONTAS COM FRUTAS GARANTIDAS",
    price: 7.99,
    categorySlug: "blox-fruits",
    subcategory: "fruta-no-inventario",
    image: "/images/products/product_frutas.png",
    stock: 15,
    description: "Conta de Blox Fruits nível máximo com pelo menos 1 fruta mítica ou lendária garantida no inventário físico. Entrega automática após o pagamento via PIX."
  },
  {
    name: "CONTAS COM DRACO V4 FULL",
    price: 44.99,
    categorySlug: "blox-fruits",
    subcategory: "contas-v4",
    image: "/images/products/product_v4.png",
    stock: 3,
    description: "Conta premium com raça Dragon V4 maximizada (Full Gear). Inclui também espadas míticas aleatórias e dinheiro in-game."
  },
  {
    name: "CONTAS COM GOD HUMAN",
    price: 18.90,
    categorySlug: "blox-fruits",
    subcategory: "contas-god-human",
    image: "/images/products/product_random.png",
    stock: 0,
    description: "Conta nível máximo equipada com o estilo de luta God Human (Max Mastery). Pode conter itens bônus."
  },
  {
    name: "CONTA ESCAPE TSUNAMI PREMIUM",
    price: 12.90,
    categorySlug: "escape-tsunami",
    subcategory: "brainrot-premium",
    image: "/images/categories/escape_tsunami.png",
    stock: 5,
    description: "Conta com todos os passes premium do Escape Tsunami, incluindo multiplicadores de velocidade e itens cosméticos raros."
  }
];

async function main() {
  console.log("Start seeding...");

  for (const cat of categories) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        slug: cat.slug,
        name: cat.name,
        emoji: cat.emoji,
        image: cat.image,
        banner: cat.banner,
        subcategories: {
          create: cat.subcategories.map(sub => ({
            slug: sub.slug,
            name: sub.name
          }))
        }
      }
    });

    console.log(`Created category with id: ${createdCat.id}`);

    // Create products for this category
    const catProducts = products.filter(p => p.categorySlug === cat.slug);

    for (const prod of catProducts) {
      // Find subcategory ID
      const sub = await prisma.subcategory.findFirst({
        where: { slug: prod.subcategory, categoryId: createdCat.id }
      });

      await prisma.product.create({
        data: {
          name: prod.name,
          price: prod.price,
          stock: prod.stock,
          description: prod.description,
          image: prod.image,
          categorySlug: cat.slug,
          categoryId: createdCat.id,
          subcategoryId: sub?.id,
        }
      });
    }
  }

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
