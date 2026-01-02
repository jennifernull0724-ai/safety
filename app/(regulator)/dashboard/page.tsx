import prisma from '@/lib/prisma';

export default async function RegulatorDashboardPage() {
  // Server-only: fetch regulator data (read-only, no data rendered, placeholder)
  const ledger = await prisma.ledgerEntry.findMany({ take: 10 });
  return null; // UI not rendered yet per checklist
}
