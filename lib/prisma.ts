// lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { middlewares } from '../prisma/middleware';

const prismaClient = new PrismaClient();

// Register all middlewares
for (const mw of middlewares) {
  prismaClient.$use(mw);
}

// Named export for convenience
export const prisma = prismaClient;

// Default export for backward compatibility
export default prismaClient;
