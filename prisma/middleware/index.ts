// prisma/middleware/index.ts
import { hardLocksMiddleware } from './hardLocks';

export const middlewares = [
  hardLocksMiddleware(),
];
