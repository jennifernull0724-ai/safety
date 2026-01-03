// lib/prisma.ts
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// CRITICAL: Global delete middleware (P0 production hardening)
// Evidence-bearing records are immutable - no deletes allowed
const prismaClientWithMiddleware = new PrismaClient({
  log: ["error", "warn"],
}).$extends({
  query: {
    evidenceNode: {
      async delete() {
        throw new Error('❌ DELETE is forbidden on EvidenceNode. Evidence-bearing records are immutable.');
      },
      async deleteMany() {
        throw new Error('❌ DELETE is forbidden on EvidenceNode. Evidence-bearing records are immutable.');
      },
    },
    immutableEventLedger: {
      async delete() {
        throw new Error('❌ DELETE is forbidden on ImmutableEventLedger. Evidence-bearing records are immutable.');
      },
      async deleteMany() {
        throw new Error('❌ DELETE is forbidden on ImmutableEventLedger. Evidence-bearing records are immutable.');
      },
    },
    verificationEvent: {
      async delete() {
        throw new Error('❌ DELETE is forbidden on VerificationEvent. Evidence-bearing records are immutable.');
      },
      async deleteMany() {
        throw new Error('❌ DELETE is forbidden on VerificationEvent. Evidence-bearing records are immutable.');
      },
    },
    certification: {
      async delete() {
        throw new Error('❌ DELETE is forbidden on Certification. Evidence-bearing records are immutable.');
      },
      async deleteMany() {
        throw new Error('❌ DELETE is forbidden on Certification. Evidence-bearing records are immutable.');
      },
    },
  },
});

export const prisma =
  globalForPrisma.prisma ?? prismaClientWithMiddleware;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
