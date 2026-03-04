import { prisma } from '@/lib/prisma';

async function main() {
  const id = 'cmm6t3aoh0000z8vrfvrqrafq';

  const items = await prisma.orderItem.deleteMany({ where: { productId: id } });
  console.log('OrderItems deletados:', items.count);

  const product = await prisma.product.delete({ where: { id } });
  console.log('Produto deletado:', product.name);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
