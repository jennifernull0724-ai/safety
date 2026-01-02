import prisma from '@/lib/prisma';

export default async function EmployeeDirectoryPage() {
  // Server-only: fetch employees (no data rendered, placeholder)
  const employees = await prisma.employee.findMany({
    orderBy: { lastName: 'asc' },
    take: 100,
  });
  return null; // UI not rendered yet per checklist
}
