import prisma from '@/lib/prisma';

export default async function SafetyDashboardPage() {
  // Server-only: fetch safety data (no data rendered, placeholder)
  const actions = await prisma.enforcementAction.findMany({ take: 10 });
  return null; // UI not rendered yet per checklist
}
