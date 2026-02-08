import { NextRequest } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { getDB } from "@/db";
import { allowedUsers, users } from "@/db/schema";
import { eq } from "drizzle-orm";

function createSessionToken(userId: string): string {
  const payload = { userId, exp: Date.now() + 24 * 60 * 60 * 1000 }; // 24 hours
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export async function POST(request: NextRequest) {
  const db = getDB();
  const { idToken } = (await request.json()) as { idToken: string };

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const client = new OAuth2Client(clientId);

  const ticket = await client.verifyIdToken({
    idToken,
    audience: clientId,
  });

  const payload = ticket.getPayload();
  if (!payload?.email) {
    return new Response("Invalid token", { status: 401 });
  }

  // allowlist チェック
  const allowed = await db
    .select({ email: allowedUsers.email })
    .from(allowedUsers)
    .where(eq(allowedUsers.email, payload.email))
    .get();

  if (!allowed) {
    return new Response("Forbidden", { status: 403 });
  }

  // ユーザー upsert（users テーブル）
  await db
    .insert(users)
    .values({
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      createdAt: Date.now(),
    })
    .onConflictDoNothing();

  // セッション（簡易JWT or Cookie）
  const token = createSessionToken(payload.sub);

  return new Response(JSON.stringify({ token }), {
    headers: {
      "Set-Cookie": `session=${token}; HttpOnly; Path=/; Secure`,
    },
  });
}
