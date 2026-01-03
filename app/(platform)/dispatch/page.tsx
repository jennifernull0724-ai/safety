import { prisma } from '@/lib/prisma';
import { AppShell, PageContainer, Card } from '@/components';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function DispatchDashboardPage() {
  const session = await getSession();
  if (!session || !['admin', 'dispatch'].includes(session.user.role)) {
    notFound();
  }
  const workWindows = await prisma.workWindow.findMany({
    include: {
      employees: {
        include: {
          certifications: true
        }
      }
    },
    orderBy: { startTime: 'desc' },
    take: 20
  });

  const approved = workWindows.filter(ww => ww.approvedAt !== null).length;
  const pending = workWindows.filter(ww => ww.approvedAt === null).length;
  const blocked = workWindows.filter(ww => 
    ww.employees.some(emp => emp.certifications.some((c: any) => c.status === 'FAIL'))
  ).length;

  return (
    <AppShell orgName="System of Proof" userRole="DISPATCH" userName="Dispatch" evidenceStatus="PASS">
      <PageContainer title="Operations Dashboard" description="Work windows and authority alerts">
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-4">Work Windows</h2>
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <div className="flex flex-col gap-2">
                <span className="text-text-secondary text-sm">Approved</span>
                <span className="text-3xl font-bold text-status-valid">{approved}</span>
              </div>
            </Card>
            <Card>
              <div className="flex flex-col gap-2">
                <span className="text-text-secondary text-sm">Pending</span>
                <span className="text-3xl font-bold text-status-expiring">{pending}</span>
              </div>
            </Card>
            <Card>
              <div className="flex flex-col gap-2">
                <span className="text-text-secondary text-sm">Blocked</span>
                <span className="text-3xl font-bold text-status-blocked">{blocked}</span>
              </div>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-4">Authority Alerts</h2>
          <Card>
            <div className="flex items-center gap-3 p-3">
              <span className="text-2xl">⚠️</span>
              <span className="text-text-primary">Crew approaching boundary MP 130</span>
            </div>
          </Card>
        </section>

        <section>
          <Link 
            href="/dispatch/work-windows"
            className="px-4 py-2 bg-status-valid text-white rounded-md hover:opacity-90 inline-block"
          >
            Manage Work Windows
          </Link>
        </section>

        <div className="text-xs text-text-secondary">
          Last Evaluated At: {new Date().toISOString()}
        </div>
      </PageContainer>
    </AppShell>
  );
}
