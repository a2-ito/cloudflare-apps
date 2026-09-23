// app/api/score/route.ts
import { NextRequest } from "next/server";

export const runtime = "edge";

type ScoreRequest = {
  name: string;
  score: number;
};

export async function POST(
  req: NextRequest,
  { env }: { env: { SCORES: KVNamespace } },
) {
  const body = (await req.json()) as ScoreRequest;

  const { name, score } = body;

  const entry = {
    name,
    score,
    date: new Date().toISOString(),
  };

  const key = `score:${Date.now()}`;
  await env.SCORES.put(key, JSON.stringify(entry));

  return Response.json({ ok: true });
}

export async function GET({ env }: { env: { SCORES: KVNamespace } }) {
  const list = await env.SCORES.list({ prefix: "score:" });
  const scores = await Promise.all(
    list.keys.map(async (k) => {
      const v = await env.SCORES.get(k.name);
      return JSON.parse(v!);
    }),
  );

  scores.sort((a, b) => b.score - a.score);
  return Response.json(scores.slice(0, 10));
}
