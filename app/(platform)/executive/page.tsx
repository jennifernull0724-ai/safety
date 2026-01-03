import { prisma } from '@/lib/prisma';
import { AppShell, PageContainer, Card } from '@/components';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function ExecutiveDashboardPage() {
  const session = await getSession();
  if (!session || !['admin', 'executive'].includes(session.user.role)) {
    notFound();
  }
  const incidents = await prisma.incident.findMany({
    where: {
      resolvedAt: null
    }
  });
  const certifications = await prisma.certification.findMany({
    select: { status: true }
  });
  const auditCases = await prisma.auditCase.count();

  // Calculate compliance exposure
  const failedCerts = certifications.filter(c => c.status === 'FAIL').length;
  const totalCerts = certifications.length;
  const complianceExposure = totalCerts > 0 
    ? failedCerts / totalCerts < 0.05 ? 'LOW' : failedCerts / totalCerts < 0.15 ? 'MEDIUM' : 'HIGH'
    : 'LOW';

  // Audit readiness score
  const passCerts = certifications.filter(c => c.status === 'PASS').length;
  const auditReadiness = totalCerts > 0 
    ? Math.round((passCerts / totalCerts) * 100)
    : 0;

  return (
    <AppShell orgName="System of Proof" userRole="EXECUTIVE" userName="Executive" evidenceStatus="PASS">
      <PageContainer title="Risk Overview" description="Compliance and legal defense metrics">
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-4">Risk Summary</h2>
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <div className="flex flex-col gap-2">
                <span className="text-text-secondary text-sm">Active Incidents</span>
                <span className="text-3xl font-bold text-status-expired">{incidents.length}</span>
              </div>
            </Card>
            <Card>
              <div className="flex flex-col gap-2">
                <span className="text-text-secondary text-sm">Compliance Exposure</span>
                <span className={`text-3xl font-bold ${
                  complianceExposure === 'LOW' ? 'text-status-valid' :
                  complianceExposure === 'MEDIUM' ? 'text-status-expiring' :
                  'text-status-expired'
                }`}>{complianceExposure}</span>
              </div>
            </Card>
            <Card>
              <div className="flex flex-col gap-2">
                <span className="text-text-secondary text-sm">Audit Readiness</span>
                <span className="text-3xl font-bold text-status-valid">{auditReadiness}%</span>
              </div>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-4">Trends</h2>
          <Card>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-status-valid">↓</span>
                <span className="text-text-primary">Near-misses trending down</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-status-expiring">↑</span>
                <span className="text-text-primary">Fatigue risk trending up</span>
              </div>
            </div>
          </Card>
        </section>

        <section>
          <div className="flex gap-4">
            <Link href="/executive/legal" className="px-4 py-2 bg-status-valid text-white rounded-md hover:opacity-90">
              Legal Defense View
            </Link>
            <Link href="/admin/audit-vault" className="px-4 py-2 bg-bg-secondary border border-border-default rounded-md hover:bg-bg-primary">
              Audit Vault
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
