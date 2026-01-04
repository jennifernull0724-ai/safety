import { prisma } from '@/lib/prisma';
import { AppShell, PageContainer, Card, StatusBadge } from '@/components';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function SupervisorDashboardPage() {
  const session = await getSession();
  if (!session || !['admin', 'supervisor'].includes(session.user.role)) {
    notFound();
  }
  const employees = await prisma.employee.findMany({ 
    take: 20,
    include: { 
      certifications: true,
      user: true
    },
    orderBy: { createdAt: 'desc' },
  });
  const crews = await prisma.crew.findMany({
    include: { members: true },
  });

  // Derive compliance per employee
  const employeesWithCompliance = employees.map(emp => {
    const hasFail = emp.certifications.some(c => c.status === 'FAIL');
    const hasIncomplete = emp.certifications.some(c => c.status === 'INCOMPLETE');
    const complianceState: 'PASS' | 'INCOMPLETE' | 'FAIL' = 
      hasFail ? 'FAIL' : hasIncomplete ? 'INCOMPLETE' : 'PASS';
    return { ...emp, complianceState };
  });

  return (
    <AppShell orgName="System of Proof" userRole="SUPERVISOR" userName="Supervisor" evidenceStatus="PASS">
      <PageContainer title="Crew View" description="Crew roster and compliance">
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-4">Crew Roster</h2>
          <Card>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-default">
                  <th className="text-left p-3 text-sm text-text-secondary">Employee</th>
                  <th className="text-left p-3 text-sm text-text-secondary">Trade</th>
                  <th className="text-left p-3 text-sm text-text-secondary">Compliance</th>
                  <th className="text-left p-3 text-sm text-text-secondary">QR</th>
                </tr>
              </thead>
              <tbody>
                {employeesWithCompliance.map((emp) => (
                  <tr key={emp.id} className="border-b border-border-default">
                    <td className="p-3 text-text-primary">{emp.user?.name || 'Unknown'}</td>
                    <td className="p-3 text-text-secondary">{emp.tradeRole || 'N/A'}</td>
                    <td className="p-3">
                      <StatusBadge status={emp.complianceState} timestamp={new Date()} />
                    </td>
                    <td className="p-3">
                      <Link href={`/verify/emp-${emp.id}`} className="text-status-valid hover:underline">
                        View QR
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>

        <section>
          <div className="flex gap-4">
            <Link href="/supervisor/logs" className="px-4 py-2 bg-status-valid text-white rounded-md hover:opacity-90">
              Create Field Log
            </Link>
            <Link href="/supervisor/incident" className="px-4 py-2 bg-status-expired text-white rounded-md hover:opacity-90">
              Trigger Incident
            </Link>
          </div>
        </section>

        <div className="text-xs text-text-secondary">
          Last Evaluated At: {new Date().toISOString()}
        </div>
      </PageContainer>
    </AppShell>
  );
}
