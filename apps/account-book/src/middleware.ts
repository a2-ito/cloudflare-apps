import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { userGroups } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session");

  if (request.nextUrl.pathname.startsWith("/login")) {
    return;
  }

  if (!session && !request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  const userId = getSessionUser(request);
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { env } = getCloudflareContext();
  const db = drizzle(env.DB);
  const group = await db
    .select()
    .from(userGroups)
    .where(eq(userGroups.userId, userId))
    .get();

  if (!group) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
}

export const config = {
  matcher: ["/", "/add/:path*"],
};
