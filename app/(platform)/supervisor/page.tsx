import prisma from '@/lib/prisma';

export default async function SupervisorDashboardPage() {
  // Server-only: fetch supervisor data (no data rendered, placeholder)
  const employees = await prisma.employee.findMany({ take: 10 });
  return null; // UI not rendered yet per checklist
}
