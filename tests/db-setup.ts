import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/db/schema';

// Test database connection
let testDb: ReturnType<typeof drizzle> | null = null;

export function getTestDb() {
  if (!testDb) {
    const sql = neon(process.env.TEST_DATABASE_URL || process.env.DATABASE_URL!);
    testDb = drizzle(sql, { schema });
  }
  return testDb;
}

export async function cleanupTestDb() {
  if (testDb) {
    // Clean up test data
    // Note: In a real scenario, you might want to use transactions
    // or a separate test database that gets reset
    testDb = null;
  }
}

export async function seedTestData() {
  const db = getTestDb();
  // Add seeding logic here if needed
  // Example: await db.insert(user).values([...]);
}

export async function clearTestData() {
  const db = getTestDb();
  // Add cleanup logic here
  // Example: await db.delete(user);
}

