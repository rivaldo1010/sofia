import 'dotenv/config';
import bcrypt from "bcryptjs";
import { prisma } from '../src/lib/prisma.js';

async function main() {
  const [email, password, name] = process.argv.slice(2);

  if (!email || !password) {
    console.error('Uso: pnpm admin:create <email> <password> [nombre]');
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hash, role: 'ADMIN' },
    create: {
      email,
      password: hash,
      name: name || 'Admin',
      role: 'ADMIN',
    },
  });

  console.log(`✅ Admin creado/actualizado: ${user.email} (rol: ${user.role})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());