// lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { middlewares } from '../prisma/middleware';

const prisma = new PrismaClient();

// Register all middlewares
for (const mw of middlewares) {
  prisma.$use(mw);
}

export default prisma;
