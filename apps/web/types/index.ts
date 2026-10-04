export type Role = "CUSTOMER" | "ADMIN";
export type User = { id: string; name: string; email: string; role: Role; createdAt?: string; updatedAt?: string };
export type Product = { id: string; name: string; description: string; price: number | string; imageUrl: string; category: string };
export type CartItem = { productId: string; quantity: number };
export type Cart = { userId: string; items: CartItem[] };
export type OrderItem = { id?: string; productId: string; productName: string; price: number | string; quantity: number };
export type Order = { id: string; userId: string; status: string; totalAmount: number | string; paymentTransactionId?: string | null; createdAt: string; items: OrderItem[] };
