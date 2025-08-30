import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { JWTPayload } from "./type";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session?: string) {
  if (session)
    try {
      const { payload } = await jwtVerify(session, encodedKey, {
        algorithms: ["HS256"],
      });
      return payload as JWTPayload;
    } catch (error) {
      console.log("Failed to verify session", error);
      return undefined;
    }
  return undefined;
}

export async function createSession({
  id,
  role,
}: {
  id: string;
  role: string;
}) {
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const session = await encrypt({ id, role, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  return session;
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

// export async function updateSession() {
//   const session = await (await cookies()).get("session")?.value;
//   if (!session) return;

//   const parsed = await decrypt(session);
//   if (!parsed) return; // Jika sesi tidak valid, jangan perbarui

//   const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
//   const newSession = await encrypt({
//     userId: parsed.userId,
//     username: parsed.username,
//     role: parsed.role,
//     expiresAt, // Perbarui waktu kedaluwarsa di payload
//   });

//   cookies().set("session", newSession, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     expires: expiresAt,
//     sameSite: "lax",
//     path: "/",
//   });
// }
