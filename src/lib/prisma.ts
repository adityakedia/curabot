/**
 * Shared Prisma client to avoid creating multiple instances during
 * development (hot reload) which can exhaust database connections.
 *
 * Pattern: store the client on globalThis in non-production so repeated
 * imports reuse the same instance.
 */
import { PrismaClient } from '@prisma/client';

declare global {
  // Allow storing the client on the globalThis object
  // eslint-disable-next-line no-var
  var __prisma_client__: PrismaClient | undefined;
}

const prisma = globalThis.__prisma_client__ ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma_client__ = prisma;
}

export default prisma;
