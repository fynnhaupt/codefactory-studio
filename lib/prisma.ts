import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const PRISMA_CLIENT_KEY = 'prisma.client';
const PRISMA_ADAPTER_KEY = 'prisma.adapter';

const globalForPrisma = global as unknown as {
  [PRISMA_CLIENT_KEY]?: PrismaClient;
  [PRISMA_ADAPTER_KEY]?: PrismaPg;
};

export function getPrisma() {
  const connectionString = process.env.DATABASE_URL;
  const adapter = globalForPrisma[PRISMA_ADAPTER_KEY] || new PrismaPg({ connectionString });

  const prisma =
    globalForPrisma[PRISMA_CLIENT_KEY] ||
    new PrismaClient({
      adapter
    });

  if (process.env.NODE_ENV !== 'production') {
    if (globalForPrisma[PRISMA_ADAPTER_KEY] === undefined)
      globalForPrisma[PRISMA_ADAPTER_KEY] = adapter;
    if (globalForPrisma[PRISMA_CLIENT_KEY] === undefined)
      globalForPrisma[PRISMA_CLIENT_KEY] = prisma;
  }

  return prisma;
}
