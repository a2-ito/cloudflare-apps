// 精算計算（純粋関数）。金額はすべて通貨の最小単位(minor units)の整数で扱う。

export interface SettlementMember {
  id: string;
  name: string;
}

export interface SettlementExpense {
  id: string;
  payerId: string;
  amount: number; // minor units
  participantIds: string[]; // 割り勘対象(均等割り)
}

export interface Balance {
  memberId: string;
  paid: number; // 支払った総額
  owed: number; // 負担すべき総額
  net: number; // paid - owed (正=受け取る, 負=支払う)
}

export interface Transfer {
  fromId: string; // 支払う人
  toId: string; // 受け取る人
  amount: number;
}

export interface SettlementResult {
  total: number;
  balances: Balance[];
  transfers: Transfer[];
}

// 金額 amount を n 人で均等割りし、余りを先頭から1単位ずつ配分した配列を返す。
// 合計は必ず amount と一致する。
export function splitEqually(amount: number, n: number): number[] {
  if (n <= 0) return [];
  const base = Math.floor(amount / n);
  const remainder = amount - base * n;
  return Array.from({ length: n }, (_, i) => base + (i < remainder ? 1 : 0));
}

export function calculateSettlement(
  members: SettlementMember[],
  expenses: SettlementExpense[],
): SettlementResult {
  const paid = new Map<string, number>();
  const owed = new Map<string, number>();
  for (const m of members) {
    paid.set(m.id, 0);
    owed.set(m.id, 0);
  }

  let total = 0;
  for (const e of expenses) {
    total += e.amount;
    if (paid.has(e.payerId)) {
      paid.set(e.payerId, (paid.get(e.payerId) ?? 0) + e.amount);
    }
    const participants = e.participantIds.filter((id) => owed.has(id));
    const shares = splitEqually(e.amount, participants.length);
    participants.forEach((id, i) => {
      owed.set(id, (owed.get(id) ?? 0) + shares[i]);
    });
  }

  const balances: Balance[] = members.map((m) => {
    const p = paid.get(m.id) ?? 0;
    const o = owed.get(m.id) ?? 0;
    return { memberId: m.id, paid: p, owed: o, net: p - o };
  });

  const transfers = minimizeTransfers(balances);

  return { total, balances, transfers };
}

// 貪欲法で送金回数を最小化する。最大の債務者と最大の債権者を順に相殺する。
export function minimizeTransfers(balances: Balance[]): Transfer[] {
  const creditors = balances
    .filter((b) => b.net > 0)
    .map((b) => ({ id: b.memberId, amount: b.net }));
  const debtors = balances
    .filter((b) => b.net < 0)
    .map((b) => ({ id: b.memberId, amount: -b.net }));

  // 金額降順で安定した結果を得る
  creditors.sort((a, b) => b.amount - a.amount || a.id.localeCompare(b.id));
  debtors.sort((a, b) => b.amount - a.amount || a.id.localeCompare(b.id));

  const transfers: Transfer[] = [];
  let ci = 0;
  let di = 0;
  while (ci < creditors.length && di < debtors.length) {
    const credit = creditors[ci];
    const debt = debtors[di];
    const amount = Math.min(credit.amount, debt.amount);
    if (amount > 0) {
      transfers.push({ fromId: debt.id, toId: credit.id, amount });
    }
    credit.amount -= amount;
    debt.amount -= amount;
    if (credit.amount === 0) ci++;
    if (debt.amount === 0) di++;
  }

  return transfers;
}
