/**
 * Script to update a user's role to 'admin'
 * 
 * Usage: npx tsx scripts/make-admin.ts
 * 
 * Make sure to replace '[YOUR_EMAIL_HERE]' with your actual email address.
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Schema definition (inline to avoid import issues)
import { pgEnum, pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";

const userRoleEnum = pgEnum('user_role', ['user', 'moderator', 'admin']);

const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").unique(),
    role: userRoleEnum("role").default('user').notNull(),
});

// ⚠️ CHANGE THIS TO YOUR EMAIL ADDRESS
const TARGET_EMAIL = process.env.TARGET_EMAIL;

async function makeAdmin() {
    if (!TARGET_EMAIL) {
        console.error("❌ Error: Please replace '[YOUR_EMAIL_HERE]' with your actual email address in the script.");
        process.exit(1);
    }

    if (!process.env.DATABASE_URL) {
        console.error("❌ Error: DATABASE_URL environment variable is not set.");
        process.exit(1);
    }

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    console.log(`🔍 Looking for user with email: ${TARGET_EMAIL}`);

    // Find the user
    const users = await db
        .select({ id: user.id, name: user.name, email: user.email, role: user.role })
        .from(user)
        .where(eq(user.email, TARGET_EMAIL));

    if (users.length === 0) {
        console.error(`❌ Error: No user found with email: ${TARGET_EMAIL}`);
        process.exit(1);
    }

    const targetUser = users[0];
    console.log(`✅ Found user: ${targetUser.name} (${targetUser.email})`);
    console.log(`   Current role: ${targetUser.role}`);

    if (targetUser.role === 'admin') {
        console.log("ℹ️  User is already an admin. No changes needed.");
        process.exit(0);
    }

    // Update the user's role to admin
    await db
        .update(user)
        .set({ role: 'admin' })
        .where(eq(user.email, TARGET_EMAIL));

    console.log(`🎉 Success! User ${targetUser.name} is now an admin.`);
}

makeAdmin().catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
});
