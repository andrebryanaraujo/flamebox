export interface Subcategory {
  slug: string;
  name: string;
}

export interface Category {
  slug: string;
  name: string;
  emoji: string;
  image: string;
  banner: string;
  subcategories: Subcategory[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  categorySlug: string;
  subcategory: string;
  image: string;
  stock: number;
  description: string;
}

export const categories: Category[] = [
  {
    slug: "contas-blox-fruits",
    name: "Contas Blox Fruits",
    emoji: "🍎",
    image: "/images/categories/blox-fruits.png",
    banner: "/images/banners/blox-fruits.png",
    subcategories: [
      { slug: "fruta-no-inventario", name: "Fruta no Inventário" },
      { slug: "contas-com-v4", name: "Contas com V4" },
      { slug: "conta-aleatoria", name: "Conta Aleatória" },
    ],
  },
  {
    slug: "escape-tsunami-brainrot",
    name: "ESCAPE TSUNAMI BRAINROT",
    emoji: "🌊",
    image: "/images/categories/escape-tsunami.png",
    banner: "/images/categories/escape-tsunami.png",
    subcategories: [
      { slug: "contas-escape", name: "Contas Escape" },
    ],
  },
  {
    slug: "steal-a-brainrot",
    name: "Steal a Brainrot",
    emoji: "🧠",
    image: "/images/categories/steal-brainrot.png",
    banner: "/images/categories/steal-brainrot.png",
    subcategories: [
      { slug: "contas-steal", name: "Contas Steal" },
    ],
  },
  {
    slug: "99-noites",
    name: "99 Noites",
    emoji: "🌙",
    image: "/images/categories/99-noites.png",
    banner: "/images/categories/99-noites.png",
    subcategories: [
      { slug: "contas-99", name: "Contas 99 Noites" },
    ],
  },
  {
    slug: "munder-mystery-2",
    name: "MUNDER MYSTERY 2",
    emoji: "🔪",
    image: "/images/categories/murder-mystery.png",
    banner: "/images/categories/murder-mystery.png",
    subcategories: [
      { slug: "contas-mm2", name: "Contas MM2" },
    ],
  },
  {
    slug: "game-pass",
    name: "GAME PASS",
    emoji: "🎮",
    image: "/images/categories/game-pass.png",
    banner: "/images/categories/game-pass.png",
    subcategories: [
      { slug: "passes", name: "Game Passes" },
    ],
  },
];

export const products: Product[] = [
  // Blox Fruits - Fruta no Inventário
  {
    id: "bf-frutas-1",
    name: "🍇 CONTAS COM FRUTAS GARANTIDAS 🍇",
    price: 7.99,
    categorySlug: "contas-blox-fruits",
    subcategory: "fruta-no-inventario",
    image: "/images/products/frutas-account.png",
    stock: 15,
    description: "Conta Blox Fruits com frutas raras garantidas no inventário! Você receberá uma conta com pelo menos 2 frutas lendárias. Entrega automática após confirmação do pagamento.",
  },
  {
    id: "bf-frutas-2",
    name: "❓ CONTA COM MYTHICAL ALEATÓRIA 🍇",
    price: 8.90,
    categorySlug: "contas-blox-fruits",
    subcategory: "fruta-no-inventario",
    image: "/images/products/random-account.png",
    stock: 8,
    description: "Conta Blox Fruits com uma fruta Mythical aleatória no inventário. Pode ser qualquer fruta mythical do jogo! Sorte é tudo.",
  },
  // Blox Fruits - Contas com V4
  {
    id: "bf-v4-1",
    name: "🐉 CONTAS COM DRACO V4 FULL 🐉",
    price: 44.99,
    categorySlug: "contas-blox-fruits",
    subcategory: "contas-com-v4",
    image: "/images/products/v4-account.png",
    stock: 5,
    description: "Conta Blox Fruits com V4 Dragon completo! Nível máximo, todas as habilidades V4 desbloqueadas. Conta pronta para dominar o jogo.",
  },
  {
    id: "bf-v4-2",
    name: "🍇 CONTAS COM V4 🍇",
    price: 27.90,
    categorySlug: "contas-blox-fruits",
    subcategory: "contas-com-v4",
    image: "/images/products/v4-account.png",
    stock: 10,
    description: "Conta Blox Fruits com V4 ativado. Raça aleatória com V4. Conta de alto nível pronta para uso imediato.",
  },
  {
    id: "bf-v4-3",
    name: "🍇 CONTAS COM V4 + SANGUINE ART 🔴",
    price: 45.90,
    categorySlug: "contas-blox-fruits",
    subcategory: "contas-com-v4",
    image: "/images/products/v4-account.png",
    stock: 3,
    description: "Conta premium Blox Fruits com V4 e Sanguine Art! A combinação mais poderosa do jogo. Conta completa e pronta.",
  },
  // Blox Fruits - Conta Aleatória
  {
    id: "bf-rand-1",
    name: "🐉 CONTAS COM GOD HUMAN 🐉",
    price: 6.90,
    categorySlug: "contas-blox-fruits",
    subcategory: "conta-aleatoria",
    image: "/images/products/random-account.png",
    stock: 20,
    description: "Conta Blox Fruits aleatória com God Human! Estilo de luta supremo desbloqueado. Conta com nível avançado.",
  },
  {
    id: "bf-rand-2",
    name: "🦈 CONTAS COM SHARK ANCHOR 🦈",
    price: 19.90,
    categorySlug: "contas-blox-fruits",
    subcategory: "conta-aleatoria",
    image: "/images/products/random-account.png",
    stock: 12,
    description: "Conta Blox Fruits com Shark Anchor. Arma lendária do Sea Beast! Item raro e muito procurado.",
  },
  {
    id: "bf-rand-3",
    name: "🍇 CONTAS COM SANGUINE ART 🔴",
    price: 17.90,
    categorySlug: "contas-blox-fruits",
    subcategory: "conta-aleatoria",
    image: "/images/products/frutas-account.png",
    stock: 7,
    description: "Conta Blox Fruits com Sanguine Art desbloqueado. Habilidade de combate exclusiva do 3º mar.",
  },
  {
    id: "bf-rand-4",
    name: "🍇 CONTAS COM DOUGH V? 🍇",
    price: 21.90,
    categorySlug: "contas-blox-fruits",
    subcategory: "conta-aleatoria",
    image: "/images/products/frutas-account.png",
    stock: 9,
    description: "Conta Blox Fruits com Dough awakened! Uma das frutas mais fortes do jogo. Conta com progresso avançado.",
  },
  {
    id: "bf-rand-5",
    name: "⚔️ CONTAS COM TRUE TRIPLE KATANA ⚔️",
    price: 24.90,
    categorySlug: "contas-blox-fruits",
    subcategory: "conta-aleatoria",
    image: "/images/products/v4-account.png",
    stock: 6,
    description: "Conta Blox Fruits com True Triple Katana! A espada lendária mais poderosa. Conta de alto nível.",
  },
  // Escape Tsunami
  {
    id: "et-1",
    name: "🌊 CONTA ESCAPE TSUNAMI PREMIUM",
    price: 12.90,
    categorySlug: "escape-tsunami-brainrot",
    subcategory: "contas-escape",
    image: "/images/categories/escape-tsunami.png",
    stock: 14,
    description: "Conta Escape Tsunami Brainrot com todos os mapas desbloqueados e skins exclusivas!",
  },
  {
    id: "et-2",
    name: "🌊 CONTA ESCAPE COM SKINS RARAS",
    price: 18.90,
    categorySlug: "escape-tsunami-brainrot",
    subcategory: "contas-escape",
    image: "/images/categories/escape-tsunami.png",
    stock: 6,
    description: "Conta com skins ultra raras e items limitados do Escape Tsunami Brainrot.",
  },
  // Steal a Brainrot
  {
    id: "sb-1",
    name: "🧠 CONTA STEAL BRAINROT VIP",
    price: 9.90,
    categorySlug: "steal-a-brainrot",
    subcategory: "contas-steal",
    image: "/images/categories/steal-brainrot.png",
    stock: 18,
    description: "Conta Steal a Brainrot com status VIP e items exclusivos desbloqueados.",
  },
  // 99 Noites
  {
    id: "nn-1",
    name: "🌙 CONTA 99 NOITES AVANÇADA",
    price: 14.90,
    categorySlug: "99-noites",
    subcategory: "contas-99",
    image: "/images/categories/99-noites.png",
    stock: 10,
    description: "Conta 99 Noites na Floresta com progresso avançado. Pets raros, épocas secretas e eventos ativos.",
  },
  // Munder Mystery 2
  {
    id: "mm-1",
    name: "🔪 CONTA MM2 COM GODLYS",
    price: 22.90,
    categorySlug: "munder-mystery-2",
    subcategory: "contas-mm2",
    image: "/images/categories/murder-mystery.png",
    stock: 8,
    description: "Conta Murder Mystery 2 com múltiplas facas e armas Godly! Inventário valioso.",
  },
  // Game Pass
  {
    id: "gp-1",
    name: "🎮 GAME PASS PREMIUM BUNDLE",
    price: 29.90,
    categorySlug: "game-pass",
    subcategory: "passes",
    image: "/images/categories/game-pass.png",
    stock: 25,
    description: "Bundle de Game Pass Premium com acesso a múltiplos jogos e benefícios exclusivos!",
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getProductsBySubcategory(categorySlug: string, subcategory: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug && p.subcategory === subcategory);
}

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function formatPrice(price: number | string | null | undefined): string {
  const n = Number(price ?? 0);
  return `R$ ${(isNaN(n) ? 0 : n).toFixed(2).replace(".", ",")}`;
}
