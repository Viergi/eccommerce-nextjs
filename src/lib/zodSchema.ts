import { OrderStatus } from "@prisma/client";
import z from "zod";

export const userRegisterSchema = z.object({
  username: z
    .string()
    .nonempty({ message: "Username tidak boleh kosong." })
    .min(8, { message: "Username minimal 8 karakter." })
    .max(50, { message: "Username maksimal 50 karakter." }),

  password: z
    .string()
    .nonempty({ message: "Password tidak boleh kosong." })
    .min(8, { message: "Password minimal 8 karakter." })
    .regex(/[A-Z]/, { message: "Password harus mengandung huruf kapital." })
    .regex(/[a-z]/, { message: "Password harus mengandung huruf kecil." })
    .regex(/[0-9]/, { message: "Password harus mengandung angka." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password harus mengandung karakter spesial.",
    })
    .regex(/^\S*$/, { message: "Password tidak boleh mengandung spasi" }),

  email: z
    .string()
    .nonempty({ message: "Email tidak boleh kosong." })
    .email({ message: "Format email tidak valid." })
    .min(12, { message: "Email tidak boleh kosong." }),

  nomorTelepon: z
    .string()
    .nonempty({ message: "Nomor telepon tidak boleh kosong." })
    .min(10, { message: "Nomor telepon minimal 10 digit." })
    .max(15, { message: "Nomor telepon maksimal 15 digit." })
    .regex(/^\+?[0-9]{10,15}$/, {
      message: "Format nomor telepon tidak valid.",
    }),
});

export const editUserSchema = userRegisterSchema
  .extend({
    id: z.uuid(),

    address: z
      .string()
      .min(10, "Alamat pengiriman minimal 10 karakter.")
      .nullable(),
  })
  .partial();

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "Email tidak boleh kosong." })
    .email({ message: "Format email tidak valid." })
    .min(12, { message: "Email tidak boleh kosong." }),

  password: z
    .string()
    .nonempty({ message: "Password tidak boleh kosong" })
    .min(8, { message: "Password minimal 8 karakter." })
    .regex(/[A-Z]/, { message: "Password harus mengandung huruf kapital." })
    .regex(/[a-z]/, { message: "Password harus mengandung huruf kecil." })
    .regex(/[0-9]/, { message: "Password harus mengandung angka." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password harus mengandung karakter spesial.",
    }),
});

export const adminRegisterSchema = z.object({
  username: z
    .string()
    .nonempty({ message: "Username tidak boleh kosong." })
    .min(8, { message: "Username minimal 8 karakter." })
    .max(50, { message: "Username maksimal 50 karakter." }),

  password: z
    .string()
    .nonempty({ message: "Password tidak boleh kosong." })
    .min(8, { message: "Password minimal 8 karakter." })
    .regex(/[A-Z]/, { message: "Password harus mengandung huruf kapital." })
    .regex(/[a-z]/, { message: "Password harus mengandung huruf kecil." })
    .regex(/[0-9]/, { message: "Password harus mengandung angka." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password harus mengandung karakter spesial.",
    })
    .regex(/^\S*$/, { message: "Password tidak boleh mengandung spasi" }),

  email: z
    .string()
    .nonempty({ message: "Email tidak boleh kosong." })
    .email({ message: "Format email tidak valid." })
    .min(12, { message: "Email tidak boleh kosong." }),

  nomorTelepon: z
    .string()
    .nonempty({ message: "Nomor telepon tidak boleh kosong." })
    .min(10, { message: "Nomor telepon minimal 10 digit." })
    .max(15, { message: "Nomor telepon maksimal 15 digit." })
    .regex(/^\+?[0-9]{10,15}$/, {
      message: "Format nomor telepon tidak valid.",
    }),

  fullname: z
    .string()
    .nonempty({ message: "Nama lengkap tidak boleh kosong." })
    .min(1, { message: "Nama lengkap 1 minimal karakter." })
    .max(50, { message: "Nama lengkap maksimal 50 karakter." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Nama lengkap hanya boleh huruf dan spasi.",
    }),
});

export const editAdminSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "Email tidak boleh kosong." })
    .email({ message: "Format email tidak valid." })
    .min(12, { message: "Email tidak boleh kosong." }),

  nomorTelepon: z
    .string()
    .nonempty({ message: "Nomor telepon tidak boleh kosong." })
    .min(10, { message: "Nomor telepon minimal 10 digit." })
    .max(15, { message: "Nomor telepon maksimal 15 digit." })
    .regex(/^\+?[0-9]{10,15}$/, {
      message: "Format nomor telepon tidak valid.",
    }),

  fullname: z
    .string()
    .nonempty({ message: "Nama lengkap tidak boleh kosong." })
    .min(1, { message: "Nama lengkap 1 minimal karakter." })
    .max(50, { message: "Nama lengkap maksimal 50 karakter." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Nama lengkap hanya boleh huruf dan spasi.",
    }),
  // level: z.enum(["SuperAdmin", "Admin", "None"], {
  //   message: "Level harus diisi",
  // }),
  level: z.string(),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB dalam bytes
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_FILE_COUNT = 3;

export const baseProductSchema = z.object({
  name: z
    .string({ message: "Product name is required" })
    .min(1, { message: "Product name is required" }),

  description: z.string({ message: "Product description is required" }),

  price: z
    .number({ error: "Price must be a number" })
    .int({ message: "Price exceeds Max" })
    .nonnegative({ message: "Price cannot be negative" }),

  stock: z
    .number({ error: "Stock must be a number" })
    .int({ message: "Stock exceeds Max" })
    .nonnegative({ message: "Stock cannot be negative" }),

  category: z
    .number()
    .nonnegative({ message: "Category cannot be negative" })
    .int({ message: "Category must a be integer" }),

  status: z.enum(["publish", "draft"], {
    error: () => ({ message: "Status must be either 'publish' or 'draft'" }),
  }),
});

export const frontendProductSchema = baseProductSchema.extend({
  image: z
    .any()
    .refine((file) => file?.length > 0, {
      error: "Gambar produk wajib diunggah.",
    })
    .refine((file) => file?.[0]?.size <= MAX_FILE_SIZE, {
      message: "Ukuran file maksimal 5 MB.",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type), {
      error: "Hanya format .jpg, .jpeg, .png, dan .webp yang didukung.",
    }),
});

export const backendProductSchema = baseProductSchema.extend({
  image: z.url({
    message: "URL not valid",
  }),
});

export const backendEditProductSchema = baseProductSchema
  .extend({
    image: z.url({
      message: "URL not valid",
    }),
  })
  .partial();

export const frontendEditProductSchema = baseProductSchema
  .extend({
    image: z
      .any()
      .refine((file) => file?.length > 0, {
        error: "Gambar produk wajib diunggah.",
      })
      .refine((file) => file?.[0]?.size <= MAX_FILE_SIZE, {
        message: "Ukuran file maksimal 5 MB.",
      })
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type), {
        error: "Hanya format .jpg, .jpeg, .png, dan .webp yang didukung.",
      })
      .optional(),
  })
  .partial();

export const categorySchema = z.object({
  name: z.string().min(3, { message: "Name category is required" }),
  description: z
    .string()
    // .max(200, { message: "Description minimal 200 karakter" })
    // .nullable()
    .optional(),
});

export const cartSchema = z.object({
  productId: z.uuid(),
  quantity: z
    .number({ error: "Quantity must be a number" })
    .nonnegative({ message: "Quantity cannot be negative" }),
});

export const createOrderSchema = z.object({
  cartItems: z
    .array(
      z.object({
        productId: z.string().uuid("ID produk tidak valid."),
        quantity: z.number().int().min(1, "Kuantitas minimal 1."),
      })
    )
    .min(1, "Keranjang belanja tidak boleh kosong."),
  shippingAddress: z.string().min(10, "Alamat pengiriman minimal 10 karakter."),
  // paymentMethod: z.union(
  //   [z.literal("bankTransfer"), z.literal("eWallet"), z.literal("cod")],
  //   {
  //     error: () => ({ message: "Invalid Method cuy" }),
  //   }
  // ),
});

// 1. Definisikan skema validasi menggunakan Zod
export const checkoutFormSchema = z.object({
  name: z.string().min(3, { message: "Name harus diisi" }),
  address: z.string().min(10, {
    message: "Alamat harus diisi minimal 10 karakter.",
  }),
  notes: z.string().optional(),
  // cartItems: z.array
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(OrderStatus, { error: () => ({ message: "Invalid status" }) }),
  // status: z.enum(["PENDING", "CANCELLED", "PAID", "SHIPPED", "DELIVERED"], {
  //   error: () => ({ message: "Invalid status" }),
  // }),
});

export const baseReviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, { message: "Rating minimal 1 bintang." })
    .max(5, { message: "Rating maksimal 5 bintang." }),
  comment: z.string().max(500, { message: "Ulasan maksimal 500 karakter." }),
});

const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, `Ukuran gambar maksimal 5MB.`)
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Hanya format .jpg, .jpeg, .png, dan .webp yang didukung."
  );

export const frontEndReviewSchema = baseReviewSchema.extend({
  image: z
    .custom<FileList>()
    .refine((files) => files.length > 0, "Pilih setidaknya satu gambar.")
    .refine(
      (files) => files.length <= MAX_FILE_COUNT,
      `Maksimal ${MAX_FILE_COUNT} gambar yang bisa diunggah.`
    )
    .refine((files) => {
      // Validasi setiap file dalam FileList
      for (const file of Array.from(files)) {
        if (!fileSchema.safeParse(file).success) {
          return false;
        }
      }
      return true;
    }, "File tidak valid (Ukuran gambar maksimal 5MB. atau Hanya format .jpg, .jpeg, .png, dan .webp yang didukung.)."),
});

export const backendReviewSchema = baseReviewSchema.extend({
  image: z.array(z.url({ error: "URL not valid" })).optional(),
});

export const frontendUpdateReviewSchema = baseReviewSchema.partial();

// FIXME : change validation
export const backendUpdateReviewSchema = baseReviewSchema.extend({
  newImages: z.array(z.url({ error: "URL not valid" })).optional(),
  deletedImages: z.array(z.url({ error: "URL not valid" })).optional(),
});

export const baseBannerSchema = z.object({
  title: z
    .string({ message: "Banner title is required" })
    .min(1, { message: "Banner title is required" }),

  subtitle: z
    .string({ message: "Banner subtitle is required" })
    .min(1, { message: "Banner subtitle is required" })
    .max(200, { message: "Banner subtitle max 200" }),

  link: z.string({ message: "Banner link is required" }),
  status: z.boolean({ message: "Status must boolean" }),
});

export const frontendBannerSchema = baseBannerSchema.extend({
  image: z
    .any()
    .refine((file) => file?.length > 0, {
      error: "Gambar Banner wajib diunggah.",
    })
    .refine((file) => file?.[0]?.size <= MAX_FILE_SIZE, {
      message: "Ukuran file maksimal 5 MB.",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type), {
      error: "Hanya format .jpg, .jpeg, .png, dan .webp yang didukung.",
    }),
});

export const frontendEditBannerSchema = baseBannerSchema
  .extend({
    image: z
      .any()
      .refine((file) => file?.length > 0, {
        error: "Gambar Banner wajib diunggah.",
      })
      .refine((file) => file?.[0]?.size <= MAX_FILE_SIZE, {
        message: "Ukuran file maksimal 5 MB.",
      })
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.[0]?.type), {
        error: "Hanya format .jpg, .jpeg, .png, dan .webp yang didukung.",
      })
      .optional(),
  })
  .partial();

export const backendBannerSchema = baseBannerSchema.extend({
  image: z.url({
    message: "URL not valid",
  }),
});

export const backendEditBannerSchema = baseBannerSchema
  .extend({
    image: z
      .url({
        message: "URL not valid",
      })
      .optional(),
  })
  .partial();
