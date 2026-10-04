import { PrismaClient } from "./generated/client";
const prisma = new PrismaClient();

const products = [
  ["Aurora Wireless Headphones", "Noise-cancelling over-ear headphones with 30-hour battery life.", 129.99, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e", "Electronics"],
  ["Orbit Smart Watch", "Fitness tracking, notifications, and a bright AMOLED display.", 179.0, "https://images.unsplash.com/photo-1523275335684-37898b6baf30", "Electronics"],
  ["Ember Mechanical Keyboard", "Compact mechanical keyboard with tactile switches and RGB lighting.", 89.5, "https://images.unsplash.com/photo-1587829741301-dc798b83add3", "Electronics"],
  ["Nomad Canvas Backpack", "Durable everyday backpack with a padded laptop compartment.", 64.99, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62", "Accessories"],
  ["Harbor Leather Wallet", "Slim full-grain leather wallet with six card slots.", 39.95, "https://images.unsplash.com/photo-1627123424574-724758594e93", "Accessories"],
  ["Summit Running Shoes", "Lightweight cushioned running shoes for daily training.", 109.99, "https://images.unsplash.com/photo-1542291026-7eec264c27ff", "Footwear"],
  ["Terra Ceramic Mug", "Hand-finished ceramic mug for coffee, tea, or cocoa.", 18.0, "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d", "Home"],
  ["Linen Throw Blanket", "Soft woven cotton and linen blanket for cool evenings.", 55.0, "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2", "Home"],
  ["Nordic Desk Lamp", "Minimal adjustable lamp with warm LED illumination.", 44.75, "https://images.unsplash.com/photo-1507473885765-e6ed057f782c", "Home"],
  ["Cedar Trail Jacket", "Water-resistant lightweight jacket for changing weather.", 139.0, "https://images.unsplash.com/photo-1551028719-00167b16eac5", "Clothing"],
  ["Everyday Cotton T-Shirt", "Breathable heavyweight cotton t-shirt with a relaxed fit.", 24.99, "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab", "Clothing"],
  ["Monarch Sunglasses", "Polarized sunglasses with UV400 protection and a classic frame.", 49.99, "https://images.unsplash.com/photo-1511499767150-a48a237f0083", "Accessories"]
];

async function main() {
  for (const [index, [name, description, price, imageUrl, category]] of products.entries()) {
    await prisma.product.upsert({ where: { id: `product-${String(index + 1).padStart(3, "0")}` }, update: { name, description, price, imageUrl, category }, create: { id: `product-${String(index + 1).padStart(3, "0")}`, name, description, price, imageUrl, category } });
  }
}
main().finally(() => prisma.$disconnect());
