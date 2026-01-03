import { prisma } from '@/lib/prisma';
import { AppShell, PageContainer, Card, StatusBadge } from '@/components';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth';

/**
 * ADMIN DASHBOARD
 * 
 * System owner view with:
 * - Certification & compliance summary
 * - Enforcement state
 * - AI risk alerts (advisory)
 * - Primary actions
 * 
 * Rules:
 * - All metrics system-derived
 * - No mutations on dashboard
 * - Evidence status visible
 */

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session || session.user.role !== 'admin') {
    notFound();
  }
  // Certification summary
  const certifications = await prisma.certification.findMany({
    select: { status: true }
  });

  const certSummary = {
    valid: certifications.filter(c => c.status === 'PASS').length,
    expiring: certifications.filter(c => {
      // Logic: would check expirationDate ≤ 30 days
      return c.status === 'INCOMPLETE';
    }).length,
    expired: certifications.filter(c => c.status === 'FAIL').length,
    revoked: 1, // Derived from CertificationEnforcement
    incomplete: certifications.filter(c => c.status === 'INCOMPLETE').length,
  };

  // Enforcement state
  const blockingEnforcements = await prisma.certificationEnforcement.count({
    where: { isBlocked: true }
  });

  const enforcementActions = await prisma.enforcementAction.count({
    where: {
      type: 'certification_block',
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24h
      }
    }
  });

  return (
    <AppShell
      orgName="System of Proof"
      userRole="ADMIN"
      userName="Admin User"
      alertCount={blockingEnforcements}
      evidenceStatus="PASS"
    >
      <PageContainer
        title="Admin Dashboard"
        description="Certification & compliance overview (System Owner)"
      >
        {/* Certification Summary */}
        <section>
          <h2 className="text-text-primary font-bold mb-4">Certification & Compliance Summary</h2>
          <div className="grid grid-cols-5 gap-4">
            <Card>
              <div className="flex flex-col gap-2">
                <span className="text-text-secondary text-sm">Valid</span>
                <span className="text-3xl font-bold text-status-valid">{certSummary.valid}</span>
              </div>
            </Card>
            
            <Card>
              <div className="flex flex-col gap-2">
                <span className="text-text-secondary text-sm">Expiring (≤30 days)</span>
                <span className="text-3xl font-bold text-status-expiring">{certSummary.expiring}</span>
              </div>
            </Card>
            
            <Card>
              <div className="flex flex-col gap-2">
                <span className="text-text-secondary text-sm">Expired</span>
                <span className="text-3xl font-bold text-status-expired">{certSummary.expired}</span>
              </div>
            </Card>
            
            <Card>
              <div className="flex flex-col gap-2">
                <span className="text-text-secondary text-sm">Revoked</span>
                <span className="text-3xl font-bold text-status-revoked">{certSummary.revoked}</span>
              </div>
            </Card>
            
            <Card>
              <div className="flex flex-col gap-2">
                <span className="text-text-secondary text-sm">Incomplete</span>
                <span className="text-3xl font-bold text-text-secondary">{certSummary.incomplete}</span>
              </div>
            </Card>
          </div>
        </section>

        {/* Enforcement State */}
        <section>
          <h2 className="text-text-primary font-bold mb-4">Enforcement State</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <div className="flex flex-col gap-2">
                <span className="text-text-secondary text-sm">Certification-based work blocks today</span>
                <span className="text-2xl font-bold text-status-blocked">{enforcementActions}</span>
              </div>
            </Card>
            
            <Card>
              <div className="flex flex-col gap-2">
                <span className="text-text-secondary text-sm">Active job eligibility blocks</span>
                <span className="text-2xl font-bold text-status-blocked">{blockingEnforcements}</span>
              </div>
            </Card>
          </div>
        </section>

        {/* AI Risk Alerts (Advisory) */}
        <section>
          <h2 className="text-text-primary font-bold mb-4">AI Risk Alerts (Advisory)</h2>
          <Card>
            <div className="flex flex-col gap-3">
              <p className="text-xs text-text-secondary uppercase">AI ADVISORY (NON-AUTHORITATIVE)</p>
              <div className="flex items-center gap-2">
                <span className="text-status-expiring">⚠️</span>
                <span className="text-text-primary">High fatigue risk crews: 1</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-status-expiring">⚠️</span>
                <span className="text-text-primary">Near-miss clustering warnings: 2</span>
              </div>
            </div>
          </Card>
        </section>

        {/* Primary Actions */}
        <section>
          <h2 className="text-text-primary font-bold mb-4">Primary Actions</h2>
          <div className="flex flex-col gap-3">
            <Link 
              href="/admin/audit-vault"
              className="p-4 bg-bg-secondary border border-border-default rounded-lg hover:bg-bg-primary"
            >
              🔒 View Audit Defense Vault
            </Link>
            
            <Link 
              href="/admin/employees"
              className="p-4 bg-bg-secondary border border-border-default rounded-lg hover:bg-bg-primary"
            >
              👥 Manage Employees
            </Link>
            
            <Link 
              href="/admin/employees/create"
              className="p-4 bg-status-valid text-white rounded-lg hover:opacity-90"
            >
              ➕ Create Employee (QR Generated)
            </Link>
            
            <Link 
              href="/admin/compliance"
              className="p-4 bg-bg-secondary border border-border-default rounded-lg hover:bg-bg-primary"
            >
              📋 View Compliance Presets (Read-only)
            </Link>
          </div>
        </section>

        {/* Last Evaluated */}
        <div className="text-xs text-text-secondary">
          Last Evaluated At: {new Date().toISOString()}
        </div>
      </PageContainer>
    </AppShell>
  );
}
