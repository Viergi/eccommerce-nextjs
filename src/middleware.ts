/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";
import { cookies } from "next/headers";
// Tentukan rute yang memerlukan otentikasi
const PUBLIC_PATHS = [
  "/",
  "/product",
  "/search",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/register",
  "/api/auth/admin/login",
  "/api/auth/admin/logout",
  "/api/auth/admin/register",
];
const ADMIN_PATHS = [
  "/admin",
  "/admin/dashboard",
  "/admin/customers",
  "/admin/usages",
  "/admin/bills",
  "/admin/settings",
];
const CUSTOMER_PATHS = [
  "/usages",
  "/profile",
  "/dashboard",
  "/dashboard/orders",
  "/checkout",
];
const AUTH_PATH_USER = ["/login", "/register"];
const AUTH_PATH_ADMIN = ["/admin/login", "/admin/register"];

const SENSITIVE_ROUTE = ["/api/cart", "/api/orders", "/api/user"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  let userRole = null;

  // Cek apakah ini permintaan ke halaman publik.
  // Jika ya, biarkan saja.
  if (PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/product/")) {
    return NextResponse.next();
  }

  // --- 1. Logika untuk Permintaan API (Bearer Token) ---
  if (pathname.startsWith("/api/")) {
    const authHeader = request.headers.get("Authorization");
    // console.log(authHeader);
    const token = authHeader?.split(" ")[1];
    // console.log(token, "ini token");

    if (
      method === "GET" &&
      !pathname.startsWith("/api/admin") &&
      !SENSITIVE_ROUTE.includes(pathname)
    ) {
      // console.log("p");
      return NextResponse.next();
    }
    if (!token && pathname.startsWith("/api/payment/webhook")) {
      return NextResponse.next();
    }
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: Bearer token is missing." },
        { status: 401 }
      );
    }

    try {
      // verify token
      const payload = await decrypt(token);
      // console.log(payload);
      if (!payload) throw new Error();
      userRole = payload?.role;
      const response = NextResponse.next();
      response.headers.set("X-User-Id", payload?.id);
      response.headers.set("X-Role", payload?.role);
      return response;
    } catch (error) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid or expired token." },
        { status: 401 }
      );
    }
  }

  // --- 2. Logika untuk Permintaan Halaman Web (Cookie) ---
  else {
    // Jika bukan API, asumsikan ini halaman web
    const sessionCookie = (await cookies()).get("session")?.value;
    console.log(sessionCookie, "session");

    if (sessionCookie) {
      if (AUTH_PATH_USER.includes(pathname)) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      if (AUTH_PATH_ADMIN.includes(pathname)) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }

    if (!sessionCookie) {
      if (AUTH_PATH_USER.includes(pathname)) {
        return NextResponse.next();
      }
      if (AUTH_PATH_ADMIN.includes(pathname)) {
        return NextResponse.next();
      }
      // Jika tidak ada cookie, redirect ke halaman login
      if (pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const payload = await decrypt(sessionCookie);
      userRole = payload?.role;
      // console.log(userRole);
    } catch (error) {
      // Jika cookie tidak valid, hapus dan redirect
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("session");
      return response;
    }
  }

  // --- Logika Otorisasi (Setelah Otentikasi Berhasil) ---

  // Jika user mencoba mengakses path admin
  if (ADMIN_PATHS.some((path) => pathname.startsWith(path))) {
    if (userRole !== "Admin" && userRole !== "SuperAdmin") {
      // Redirect ke halaman yang sesuai jika tidak punya akses
      // console.log("p");
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Jika user mencoba mengakses path customer
  else if (CUSTOMER_PATHS.some((path) => pathname.startsWith(path))) {
    // Di sini, Anda bisa putuskan apakah Admin juga bisa akses path customer.
    if (userRole !== "user") {
      // console.log("p");
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Jika semua pemeriksaan lolos, lanjutkan ke request yang sebenarnya
  return NextResponse.next();
}

// Konfigurasi matcher: Tentukan path mana saja yang akan dilewati middleware
export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$).*)",
    "/api/:path*", // Tambahkan ini agar semua API diperiksa
  ],
};

// import { NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { decrypt } from "./lib/session";

// export async function middleware(request: NextRequest) {
//   const pathname = request.nextUrl.pathname;
//   const cookie = (await cookies()).get("session")?.value;
//   const session = await decrypt(cookie);
//   let userRole = null;
//   // Daftar path yang hanya bisa diakses oleh ADMIN
//   const adminPaths = [
//     "/admin",
//     "/admin/dashboard",
//     "/admin/customers",
//     "/admin/usages",
//     "/admin/bills",
//     "/admin/settings",
//   ];
//   // Daftar path yang hanya bisa diakses oleh PELANGGAN
//   const customerPaths = ["/", "/bills", "/usages", "/profile"];
//   // Path yang diizinkan untuk semua orang (termasuk yang belum login)
//   const authPath = ["/login", "/register", "/admin/login", "/admin/register"];
//   const publicPaths = [
//     "/",
//     "/login",
//     "/register",
//     "/admin/login",
//     "/admin/register",
//     "/search",
//     // "/api/user",
//     // "/api/user/:id*",
//     // "/api/admin",
//   ]; // asumsi root '/' adalah halaman login atau landing
//   console.log("Session", session);
//   const authHeader = request.headers.get("Authorization");
//   console.log(authHeader, "ini authorization");
//   // Periksa apakah header Authorization ada dan memiliki format yang benar

//   // Jika user mencoba mengakses path publik, biarkan saja
//   if (publicPaths.includes(pathname)) {
//     return NextResponse.next();
//   }
//   if (pathname.startsWith("/api")) {
//     return NextResponse.next();
//   }
//   if (pathname.startsWith("/product")) {
//     return NextResponse.next();
//   }

//   if (authHeader || authHeader?.startsWith("Bearer ")) {
//     const token = authHeader?.split(" ")[1];
//     console.log(token, "token");
//     const payload = await decrypt(token);

//     console.log(payload, "payload");
//     if (payload?.role) {
//       if (payload.role === "Admin") {
//         // Misal token admin dimulai dengan 'admin_'
//         userRole = "Admin";
//       } else if (payload.role === "SuperAdmin") {
//         userRole = "SuperAdmin";
//       } else {
//         userRole = "customer";
//       }
//     }

//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   // !
//   // if (session?.role) {
//   //   if (session.role === "Admin") {
//   //     // Misal token admin dimulai dengan 'admin_'
//   //     userRole = "Admin";
//   //   } else if (session.role === "SuperAdmin") {
//   //     userRole = "SuperAdmin";
//   //   } else {
//   //     userRole = "customer";
//   //   }
//   // }

//   if (authPath.includes(pathname)) {
//     console.log(userRole);
//     if (userRole != null)
//       return NextResponse.redirect(new URL("/", request.url));
//     return NextResponse.next();
//   }

//   // if (pathname.startsWith("/api/admin")) {
//   //   return NextResponse.next();
//   // }

//   // --- Logika Autentikasi ---
//   // if (
//   //   isPublicRoute &&
//   //   session?.userId &&
//   //   !req.nextUrl.pathname.startsWith("/dashboard")
//   // ) {
//   //   return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
//   // }

//   //logika otorisasi
//   if (adminPaths.some((path) => pathname.startsWith(path))) {
//     // Jika user mencoba mengakses path admin
//     if (userRole !== "Admin" && userRole !== "SuperAdmin") {
//       // Jika bukan admin, redirect ke dashboard pelanggan atau halaman 403
//       return NextResponse.redirect(new URL("/dashboard", request.url)); // Atau '/403'
//     }
//   } else if (customerPaths.some((path) => pathname.startsWith(path))) {
//     // Jika user mencoba mengakses path pelanggan
//     if (userRole !== "customer" && userRole !== "Admin") {
//       // Admin juga bisa akses path customer jika diperlukan
//       // Jika bukan pelanggan (dan bukan admin), redirect ke halaman login
//       return NextResponse.redirect(new URL("/login", request.url));
//     }
//   }

//   // Jika semua pemeriksaan lolos, lanjutkan ke request yang sebenarnya
//   return NextResponse.next();
// }

// // Konfigurasi matcher: Tentukan path mana saja yang akan dilewati middleware
// export const config = {
//   matcher: [
//     "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$).*)",
//     // "/((?!api|_next/static|_next/image|favicon.ico|vercel.svg).*)",
//   ],
// };
