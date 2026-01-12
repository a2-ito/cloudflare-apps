import {
  sqliteTable,
  integer,
  text,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

export const expenses = sqliteTable("expenses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  groupId: text("group_id")
    .notNull()
    .references(() => groups.id),

  amount: integer("amount").notNull(),
  categoryId: text("category_id"),
  memo: text("memo"),
  date: text("date").notNull(), // yyyy-mm-dd

  //createdAt: integer("created_at").notNull(),
  createdAt: integer("created_at")
    .notNull()
    .default(sql`(unixepoch())`),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  //createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
  createdAt: integer("created_at")
    .notNull()
    .default(sql`(unixepoch())`),
});

export const groups = sqliteTable("groups", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: integer("created_at")
    .notNull()
    .default(sql`(unixepoch())`),
});

export const userGroups = sqliteTable(
  "user_groups",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    groupId: text("group_id")
      .notNull()
      .references(() => groups.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.groupId] }),
  }),
);
