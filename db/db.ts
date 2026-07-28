import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL || "postgres://placeholder:placeholder@localhost:5432/placeholder");

export const db = drizzle(sql, { schema });