import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";

// グループ（イベント単位）。通貨はグループ内で固定・単一。
export const groups = sqliteTable("groups", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  currency: text("currency").notNull().default("JPY"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

// メンバー
export const members = sqliteTable("members", {
  id: text("id").primaryKey(),
  groupId: text("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

// 立替（支払い）。amount は通貨の最小単位(minor units)の整数。
export const expenses = sqliteTable("expenses", {
  id: text("id").primaryKey(),
  groupId: text("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  payerId: text("payer_id")
    .notNull()
    .references(() => members.id, { onDelete: "restrict" }),
  amount: integer("amount").notNull(),
  description: text("description").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

// 立替の割り勘対象メンバー（均等割り）
export const expenseParticipants = sqliteTable(
  "expense_participants",
  {
    expenseId: text("expense_id")
      .notNull()
      .references(() => expenses.id, { onDelete: "cascade" }),
    memberId: text("member_id")
      .notNull()
      .references(() => members.id, { onDelete: "restrict" }),
  },
  (t) => [primaryKey({ columns: [t.expenseId, t.memberId] })],
);

export type Group = typeof groups.$inferSelect;
export type Member = typeof members.$inferSelect;
export type Expense = typeof expenses.$inferSelect;
export type ExpenseParticipant = typeof expenseParticipants.$inferSelect;
