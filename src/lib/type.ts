type JWTPayload = {
  id: string;
  role: string;
  expiresAt: Date;
};

type Admin = {
  id: number;
  email: string;
  nomorTelepon: string;
  fullname: string;
  username: string;
  passwordHash: string;
  level: string;
  createdAt: Date;
  updatedAt: Date;
};

type Category = {
  id: number;
  name: string;
  description: string | null;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  categoryId: number | null;
  createdAt: Date;
  updatedAt: Date;
  status: string;
};

type FormCategories = {
  name: string;
  description: string | null;
};

type FormCartItem = {
  productId: string;
  quantity: number;
};

type FormOrders = {
  cartItems: FormCartItem[];
  shippingAddress: string;
  notes?: string;
};

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: Pick<Product, "id" | "name" | "price" | "imageUrl" | "description">;
}

// Definisikan tipe untuk Produk
// export interface ProductDetails {
//   id: string;
//   name: string;
//   price: number;
//   imageUrl: string | null;
// }

// Definisikan tipe untuk OrderItem dengan detail Produk
export interface OrderItemDetails {
  id: string;
  orderId: string;
  productId: string;
  priceAtOrder: number;
  quantity: number;
  product: Pick<Product, "id" | "price" | "imageUrl" | "name">;
}

// Definisikan tipe untuk Instruksi Pembayaran (jika ada)
export interface PaymentInstructions {
  bankName: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  deadline: string; // Format ISO string
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  address: string | null;
  nomorTelepon: string;
  orderCount: number;
}

export interface FullOrderDetails {
  id: string;
  user: Pick<User, "username">;
  userId: string;
  orderDate: Date;
  totalAmount: number;
  status: string; // Sesuaikan status Anda
  shippingAddress: string;
  notes: string | null;
  paymentMethod: string | null;
  createdAt: Date; // ISO string
  updatedAt: Date;
  orderItems: OrderItemDetails[];
  paymentInstructions?: PaymentInstructions; // Properti opsional ini yang menyebabkan error
}

export type {
  JWTPayload,
  Admin,
  Category,
  Product,
  FormCategories,
  FormCartItem,
  FormOrders,
};
