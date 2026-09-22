import { NextResponse } from "next/server";
import { expenses, categories } from "@/db/schema";
import { eq, like, sql } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");

    if (!month) {
      return NextResponse.json([]);
    }

    const { env } = getCloudflareContext();
    const db = drizzle(env.DB);
    const result = await db
      .select({
        category: categories.name,
        total: sql<number>`sum(${expenses.amount})`,
      })
      .from(expenses)
      .innerJoin(categories, eq(expenses.categoryId, categories.id))
      .where(like(expenses.date, `${month}%`))
      .groupBy(categories.name);

    return NextResponse.json(result ?? []);
  } catch (err) {
    console.error("summary error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
