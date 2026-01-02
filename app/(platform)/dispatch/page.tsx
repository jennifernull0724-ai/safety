import prisma from '@/lib/prisma';

export default async function DispatchDashboardPage() {
  // Server-only: fetch dispatch data (no data rendered, placeholder)
  const jobs = await prisma.jha.findMany({ take: 10 });
  return null; // UI not rendered yet per checklist
}
