import { NextRequest } from "next/server";
import { getDB } from "@/db";
import { allowedUsers, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { jwtVerify, createRemoteJWKSet, JWTPayload } from "jose";
// 公開鍵リスト（JWKS）を取得するための関数を定義
// これは関数の外に置くことで、Workerのインスタンス間で再利用され、効率的に動作します。
const JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs"),
);

// Google IDトークンのペイロード用インターフェース（必要に応じて拡張）
interface GoogleIDTokenPayload extends JWTPayload {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

function createSessionToken(userId: string): string {
  const payload = { userId, exp: Date.now() + 24 * 60 * 60 * 1000 }; // 24 hours
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export async function POST(request: NextRequest) {
  const db = getDB();
  const { idToken } = (await request.json()) as { idToken: string };

  const clientId = process.env.GOOGLE_CLIENT_ID;

  try {
    // トークンの検証
    // jwtVerifyは、署名の確認、有効期限(exp)、発行元(iss)、対象者(aud)を一度にチェックします。
    const { payload } = await jwtVerify<GoogleIDTokenPayload>(idToken, JWKS, {
      issuer: "https://accounts.google.com",
      audience: clientId,
      // わずかな時刻のズレを許容する場合（必要なら設定）
      // clockTolerance: '5s',
    });
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
  } catch (err: any) {
    console.error(err);
  }
}
