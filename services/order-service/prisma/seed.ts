// Orders are created by the future checkout flow, so this seed intentionally adds no rows.
import { PrismaClient } from "./generated/client";
const prisma = new PrismaClient();
async function main() { console.log("Order database seed complete: no demo orders created."); }
main().finally(() => prisma.$disconnect());
