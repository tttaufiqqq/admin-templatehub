import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

declare global {
  var __templatehubPrisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL must be set before creating the Prisma client.");
  }

  const pool = new Pool({ connectionString: databaseUrl });

  return new PrismaClient({
    adapter: new PrismaPg(pool),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma =
  globalThis.__templatehubPrisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__templatehubPrisma = prisma;
}
