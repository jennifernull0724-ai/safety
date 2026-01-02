import prisma from '@/lib/prisma';

export default async function AdminDashboardPage() {
  // Server-only: fetch admin data (no data rendered, placeholder)
  const orgs = await prisma.org.findMany({ take: 10 });
  return null; // UI not rendered yet per checklist
}
