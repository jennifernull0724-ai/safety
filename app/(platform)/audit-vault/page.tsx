import prisma from '@/lib/prisma';

export default async function AuditVaultPage() {
  // Server-only: fetch audit timeline (no data rendered, placeholder)
  const timeline = await prisma.ledgerEntry.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  return null; // UI not rendered yet per checklist
}
