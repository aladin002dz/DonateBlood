import { relations } from "drizzle-orm/relations";
import { user, account, session, tasks } from "./schema";

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	sessions: many(session),
	tasks: many(tasks),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const tasksRelations = relations(tasks, ({one}) => ({
	user: one(user, {
		fields: [tasks.userId],
		references: [user.id]
	}),
}));