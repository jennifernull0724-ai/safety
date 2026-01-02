import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EmployeeProfilePage({ params }: { params: { id: string } }) {
  // Server-only: fetch employee and certs (no data rendered, placeholder)
  const employee = await prisma.employee.findUnique({
    where: { id: params.id },
    include: { certifications: true },
  });
  if (!employee) return notFound();
  return null; // UI not rendered yet per checklist
}
