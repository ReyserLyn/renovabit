import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { lifecycleDates, primaryKey } from "./_utils";

export const userRoles = pgEnum("user_roles", [
	"admin",
	"customer",
	"distributor",
]);

export const users = pgTable(
	"users",
	{
		...primaryKey,

		name: text("name").notNull(),
		email: text("email").notNull().unique(),
		username: text("username").unique(),
		displayUsername: text("display_username"),
		emailVerified: boolean("email_verified").default(false).notNull(),
		image: text("image"),

		// Custom fields
		phone: text("phone"),
		role: userRoles("role").default("customer").notNull(),

		...lifecycleDates,
	},
	(table) => [index("users_role_idx").on(table.role)],
);

export const sessions = pgTable(
	"sessions",
	{
		...primaryKey,
		expiresAt: timestamp("expires_at").notNull(),
		token: text("token").notNull().unique(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),

		...lifecycleDates,
	},
	(table) => [index("sessions_userId_idx").on(table.userId)],
);

export const accounts = pgTable(
	"accounts",
	{
		...primaryKey,
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		scope: text("scope"),
		password: text("password"),

		...lifecycleDates,
	},
	(table) => [index("accounts_userId_idx").on(table.userId)],
);

export const verifications = pgTable(
	"verifications",
	{
		...primaryKey,

		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at").notNull(),

		...lifecycleDates,
	},
	(table) => [index("verifications_identifier_idx").on(table.identifier)],
);

// Relations
export const userRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	accounts: many(accounts),
}));

export const sessionRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));

export const accountRelations = relations(accounts, ({ one }) => ({
	user: one(users, {
		fields: [accounts.userId],
		references: [users.id],
	}),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Verification = typeof verifications.$inferSelect;
