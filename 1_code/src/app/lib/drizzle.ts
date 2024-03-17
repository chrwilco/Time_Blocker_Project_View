import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  primaryKey,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel, eq, relations } from "drizzle-orm";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { AdapterAccount } from "@auth/core/adapters";
import { auth } from "../auth";

export const db = drizzle(sql);

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  completed: boolean("completed").notNull().default(false),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  time: timestamp("time", { mode: "date" }).notNull(),
  duration: integer("duration"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
});

export const taskRelations = relations(tasks, ({ many }) => ({
  tasksToCategories: many(categoriesToTasks),
}));

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color"),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
  deletedAt: timestamp("deletedAt", { mode: "date" }),
});

export const categoryRelations = relations(categories, ({ many }) => ({
  categoriesToTasks: many(categoriesToTasks),
}));

export const categoriesToTasks = pgTable("categoriesToTasks", {
  taskId: integer("taskId")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  categoryId: integer("categoryId")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Task = InferSelectModel<typeof tasks>;
export type NewTask = InferInsertModel<typeof tasks>;

export const categoriesToTasksRelations = relations(
  categoriesToTasks,
  ({ one }) => ({
    task: one(tasks, {
      fields: [categoriesToTasks.taskId],
      references: [tasks.id],
    }),
    category: one(categories, {
      fields: [categoriesToTasks.categoryId],
      references: [categories.id],
    }),
  })
);
