import { z } from "zod/v4";

export const categorySchema = z.object({
  slug: z.string().min(2, "O slug deve ter pelo menos 2 caracteres").max(50),
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres").max(100),
  emoji: z.string().optional(),
  image: z.string().min(1, "A imagem é obrigatória"),
  banner: z.string().min(1, "O banner é obrigatório"),
});

export const subcategorySchema = z.object({
  slug: z.string().min(2).max(50),
  name: z.string().min(2).max(100),
  categoryId: z.string().min(1, "ID de categoria inválido"),
});

export const productSchema = z.object({
  name: z.string().min(3, "O nome do produto é muito curto").max(100),
  price: z.number().positive("O preço deve ser maior que zero"),
  discount: z.number().min(0).max(100).optional().nullable(),
  stock: z.number().int().nonnegative("O estoque não pode ser negativo"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  image: z.string().min(1, "A imagem é obrigatória"),
  cardBackground: z.string().optional(),
  categorySlug: z.string().min(1, "Categoria é obrigatória"),
  categoryId: z.string().min(1, "ID de categoria inválido"),
  subcategoryId: z.string().min(1).optional().nullable(),
  variantGroupId: z.string().optional().nullable(),
  images: z.array(z.string()).optional(),
});

export const orderItemSchema = z.object({
  productId: z.string().min(1, "ID do produto inválido"),
  quantity: z.number().int().positive("A quantidade deve ser maior que zero"),
  price: z.number().positive("Preço inválido"),
  productName: z.string(),
});

export const orderSchema = z.object({
  customerName: z.string().min(2, "Nome é obrigatório"),
  customerEmail: z.string().email("E-mail inválido"),
  total: z.number().positive("Total inválido"),
  paymentMethod: z.string().default("PIX"),
  transactionId: z.string().optional(),
  items: z.array(orderItemSchema).min(1, "O pedido deve ter pelo menos 1 item"),
});
