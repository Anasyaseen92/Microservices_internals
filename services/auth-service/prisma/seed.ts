import { PrismaClient, Role } from "./generated/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
// Demo password for both seeded accounts: DemoPass123!
async function main() {
  const passwordHash = await bcrypt.hash("DemoPass123!", 10);
  await prisma.user.upsert({ where: { email: "customer@example.com" }, update: {}, create: { name: "Demo Customer", email: "customer@example.com", passwordHash, role: Role.CUSTOMER } });
  await prisma.user.upsert({ where: { email: "admin@example.com" }, update: {}, create: { name: "Demo Admin", email: "admin@example.com", passwordHash, role: Role.ADMIN } });
}

main().finally(() => prisma.$disconnect());
