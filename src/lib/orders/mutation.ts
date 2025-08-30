/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderStatus } from "@prisma/client";
import { prisma } from "../prismaClient";
import { FormOrders } from "../type";
import { createOrderSchema, updateOrderStatusSchema } from "../zodSchema";

export async function createOrders({
  data,
  userId,
}: {
  data: FormOrders;
  userId: string;
}) {
  const { shippingAddress, cartItems, notes } = data;

  // Previous steps:
  // 1. Validate form fields
  const validationResult = createOrderSchema.safeParse(data);

  if (!validationResult.success) {
    const messages = validationResult.error.issues.reduce((acc, err) => {
      acc[err.path[0] as string] = err.message;
      return acc;
    }, {} as Record<string, string>);
    return {
      status: 400,
      errors: messages,
    };
  }
  // 2. Prepare data for insertion into database
  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExists) {
    return { status: 404, errors: "Pengguna tidak ditemukan." };
  }

  // pake transaction , jadi jika salah satu queri gagal semua di batalin contoh: create tabel order gagal
  //  maka yang delete batal
  const result = await prisma.$transaction(async (prismaTx) => {
    let totalAmount = 0;
    const orderItemsData = [];
    const productUpdates = [];

    // Loop melalui cartItems untuk menghitung total dan menyiapkan orderItems
    for (const item of cartItems) {
      const product = await prismaTx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new Error(`Produk dengan ID ${item.productId} tidak ditemukan.`);
      }
      if (product.stock < item.quantity) {
        throw new Error(
          `Stok produk "${product.name}" tidak mencukupi. Tersedia: ${product.stock}, Diminta: ${item.quantity}.`
        );
      }

      totalAmount += product.price * item.quantity; // Convert Decimal to Number for calculation
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        priceAtOrder: product.price, // Simpan harga saat ini
      });

      // Kurangi stok produk
      productUpdates.push(
        prismaTx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        })
      );
    }

    const shippingFee = 25000;

    // Buat entri di tabel orders
    const newOrder = await prismaTx.order.create({
      data: {
        userId,
        totalAmount: totalAmount + shippingFee, // Convert Number back to Decimal
        shippingAddress,
        paymentMethod: null,
        notes,
        status: "PENDING", // Status awal: pending pembayaran/proses
        orderItems: {
          createMany: {
            data: orderItemsData,
          },
        },
      },
    });

    // Update stok produk
    await Promise.all(productUpdates);

    // Hapus item dari keranjang belanja setelah berhasil checkout
    await prismaTx.cartItem.deleteMany({
      where: {
        userId,
        productId: { in: cartItems.map((item) => item.productId) },
      },
    });

    return newOrder;
  });
  if (!result) return { status: 500, errors: "Failed create order" };
  return { status: 201, data: result };
}

export async function updateOrderById({
  data,
  id,
}: {
  data: { status: OrderStatus };
  id: string;
}) {
  const validationResult = updateOrderStatusSchema.safeParse(data);

  // note: Perbaiki logic disini biar return nya sesuai errornya
  if (!validationResult.success) {
    const errorArray = JSON.parse(validationResult.error.message) as any[];
    const messages = errorArray.map((err) => err.message);
    console.log(messages);
    return {
      status: 400,
      errors: messages,
    };
  }
  const orderExists = await prisma.order.findUnique({ where: { id } });
  if (!orderExists) {
    return { status: 404, errors: "Pengguna tidak ditemukan." };
  }

  const product = await prisma.order.update({
    where: {
      id,
    },
    data: {
      status: data.status,
    },
  });

  if (!product) return { errors: "Change data failed", status: 500 };
  return { data: product, status: 200 };
}

// export async function deleteProduct(id: string) {
//   console.log(id);
//   const product = await prisma.product.delete({
//     where: {
//       id,
//     },
//   });

//   if (!product) return { errors: "Delete data failed", status: 500 };
//   return { data: product, status: 200 };
// }

// export async function updateUser({id, data}) {
//   // Previous steps:
//   // 1. Validate form fields

//   const existingCustomer = await prisma.user.findUnique({
//     where: { username },
//   });

//   if (existingCustomer)
//     return { status: 400, errors: "Username sudah dipakai" };

//   const existingEmail = await prisma.user.findUnique({
//     where: { email },
//   });
//   if (existingEmail) return { status: 400, errors: "Email sudah dipakai" };

//   // 2. Prepare data for insertion into database
//   const hashedPassword = await bcrypt.hash(password, 10);

//   // 3. Insert the user into the database or call an Library API
//   const user = await prisma.user.create({
//     data: {
//       username,
//       email,
//       passwordHash: hashedPassword,
//       nomorTelepon: nomorTelepon,
//     },
//   });
//   if (!user) return { status: 500, errors: "Failed create account" };
//   return { status: 201, data };

// }
