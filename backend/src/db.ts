import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "./generated/prisma";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function createClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? "file:./database.sqlite";
  const adapter = new PrismaBetterSqlite3({ url });

  return new PrismaClient({
    adapter,
    log: ["warn", "error"],
  });
}

export function getDb(): PrismaClient {
  if (!global.prisma) {
    global.prisma = createClient();
  }

  return global.prisma;
}

export async function resetDbClientForTests() {
  if (!global.prisma) {
    return;
  }

  await global.prisma.$disconnect();
  global.prisma = undefined;
}
