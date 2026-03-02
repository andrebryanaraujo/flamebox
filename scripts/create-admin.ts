import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { hashPassword } from "../lib/password";
import * as readline from "readline";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q: string): Promise<string> =>
  new Promise((resolve) => rl.question(q, resolve));

async function main() {
  console.log("\n🔐 Criar Administrador\n");

  const email = (await ask("E-mail: ")).trim().toLowerCase();
  if (!email) {
    console.error("❌ E-mail é obrigatório.");
    process.exit(1);
  }

  const name = (await ask("Nome: ")).trim();
  if (!name) {
    console.error("❌ Nome é obrigatório.");
    process.exit(1);
  }

  const password = (await ask("Senha: ")).trim();
  if (password.length < 6) {
    console.error("❌ A senha deve ter no mínimo 6 caracteres.");
    process.exit(1);
  }

  rl.close();

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (existing) {
      console.error(`❌ Já existe um admin com o e-mail "${email}".`);
      process.exit(1);
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.adminUser.create({
      data: { email, name, passwordHash },
    });

    console.log(`\n✅ Admin criado com sucesso!`);
    console.log(`   ID:    ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Nome:  ${user.name}\n`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("❌ Erro:", err.message);
  process.exit(1);
});
