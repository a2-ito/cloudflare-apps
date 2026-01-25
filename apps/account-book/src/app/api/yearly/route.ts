import { NextResponse } from "next/server";
import { expenses } from "@/db/schema";
import { sql, like } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");

    if (!year) {
      return NextResponse.json({ monthly: [] });
    }

    const { env } = getCloudflareContext();
    const db = drizzle(env.DB);

    const result = await db
      .select({
        month: sql<string>`substr(${expenses.date},1,7)`,
        total: sql<number>`sum(${expenses.amount})`,
      })
      .from(expenses)
      .where(like(expenses.date, `${year}%`))
      .groupBy(sql`substr(${expenses.date},1,7)`)
      .orderBy(sql`substr(${expenses.date},1,7)`);

    return NextResponse.json({ monthly: result ?? [] });
  } catch (err) {
    console.error("yearly error:", err);
    return NextResponse.json({ monthly: [] }, { status: 500 });
  }
}
