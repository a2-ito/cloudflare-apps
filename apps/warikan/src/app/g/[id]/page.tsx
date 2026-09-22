import { notFound } from "next/navigation";
import { asc, desc, eq, inArray } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { formatAmount, getCurrency } from "@/lib/currency";
import { calculateSettlement } from "@/lib/settlement";
import {
  addMember,
  removeMember,
  addExpense,
  updateExpense,
  removeExpense,
} from "./actions";
import { ShareLink } from "./ShareLink";
import { MemberSection } from "./MemberSection";
import { ExpenseSection } from "./ExpenseSection";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getDb();

  const group = await db.query.groups.findFirst({
    where: eq(schema.groups.id, id),
  });
  if (!group) notFound();

  const members = await db.query.members.findMany({
    where: eq(schema.members.groupId, id),
    orderBy: asc(schema.members.createdAt),
  });

  const expenses = await db.query.expenses.findMany({
    where: eq(schema.expenses.groupId, id),
    orderBy: desc(schema.expenses.createdAt),
  });

  const expenseIds = expenses.map((e) => e.id);
  const participants = expenseIds.length
    ? await db.query.expenseParticipants.findMany({
        where: inArray(schema.expenseParticipants.expenseId, expenseIds),
      })
    : [];

  const participantsByExpense = new Map<string, string[]>();
  for (const p of participants) {
    const arr = participantsByExpense.get(p.expenseId) ?? [];
    arr.push(p.memberId);
    participantsByExpense.set(p.expenseId, arr);
  }

  const memberName = new Map(members.map((m) => [m.id, m.name]));
  const currency = getCurrency(group.currency);

  const settlement = calculateSettlement(
    members.map((m) => ({ id: m.id, name: m.name })),
    expenses.map((e) => ({
      id: e.id,
      payerId: e.payerId,
      amount: e.amount,
      participantIds: participantsByExpense.get(e.id) ?? [],
    })),
  );

  // client 用に整形した立替リスト
  const expenseView = expenses.map((e) => ({
    id: e.id,
    payerId: e.payerId,
    amount: e.amount,
    amountLabel: formatAmount(e.amount, group.currency),
    description: e.description,
    participantIds: participantsByExpense.get(e.id) ?? [],
  }));

  const memberView = members.map((m) => ({ id: m.id, name: m.name }));

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold">{group.name}</h1>
          <span className="shrink-0 text-xs font-medium text-black/50 border border-black/10 rounded-full px-2.5 py-1">
            {currency.symbol} {currency.code}
          </span>
        </div>
        <p className="text-sm text-black/50">
          合計 {formatAmount(settlement.total, group.currency)}・立替{" "}
          {expenses.length} 件・メンバー {members.length} 人
        </p>
      </section>

      <ShareLink />

      <MemberSection
        members={memberView}
        balances={settlement.balances.map((b) => ({
          memberId: b.memberId,
          name: memberName.get(b.memberId) ?? "?",
          net: b.net,
          netLabel: formatAmount(b.net, group.currency),
        }))}
        addAction={addMember.bind(null, id)}
        removeAction={removeMember.bind(null, id)}
      />

      <ExpenseSection
        members={memberView}
        currency={group.currency}
        expenses={expenseView}
        memberNames={Object.fromEntries(memberName)}
        addAction={addExpense.bind(null, id)}
        updateAction={updateExpense.bind(null, id)}
        removeAction={removeExpense.bind(null, id)}
      />

      <SettlementSection
        transfers={settlement.transfers.map((t) => ({
          from: memberName.get(t.fromId) ?? "?",
          to: memberName.get(t.toId) ?? "?",
          amountLabel: formatAmount(t.amount, group.currency),
        }))}
        hasExpenses={expenses.length > 0}
      />
    </div>
  );
}

function SettlementSection({
  transfers,
  hasExpenses,
}: {
  transfers: { from: string; to: string; amountLabel: string }[];
  hasExpenses: boolean;
}) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-black/5 p-5">
      <h2 className="font-semibold mb-3">精算結果</h2>
      {!hasExpenses ? (
        <p className="text-sm text-black/40">立替を記録すると精算結果が表示されます。</p>
      ) : transfers.length === 0 ? (
        <p className="text-sm text-black/60">🎉 精算の必要はありません。</p>
      ) : (
        <ul className="space-y-2">
          {transfers.map((t, i) => (
            <li
              key={i}
              className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2.5 text-sm"
            >
              <span className="font-medium">{t.from}</span>
              <span className="text-emerald-600">→</span>
              <span className="font-medium">{t.to}</span>
              <span className="ml-auto font-bold text-emerald-700">
                {t.amountLabel}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
