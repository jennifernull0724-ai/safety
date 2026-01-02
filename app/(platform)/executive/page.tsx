import prisma from '@/lib/prisma';

export default async function ExecutiveDashboardPage() {
  // Server-only: fetch executive data (no data rendered, placeholder)
  const scores = await prisma.auditReadinessScore.findMany({ take: 10 });
  return null; // UI not rendered yet per checklist
}
