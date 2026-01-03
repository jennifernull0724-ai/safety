import { prisma } from '@/lib/prisma';
import { AppShell, PageContainer, Card, AICallout } from '@/components';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth';

/**
 * SAFETY MANAGER DASHBOARD
 * 
 * Overview with:
 * - Active JHAs
 * - Near-miss summary (7 days)
 * - AI Safety Insights (advisory)
 * 
 * Rules:
 * - AI insights labeled as advisory
 * - All data immutable (read-only view)
 * - Evidence-linked metrics
 */

export default async function SafetyDashboardPage() {
  const session = await getSession();
  if (!session || !['admin', 'safety'].includes(session.user.role)) {
    notFound();
  }
  // Active JHAs
  const activeJHAs = await prisma.jHA.findMany({
    where: {
      status: 'ACTIVE'
    },
    include: {
      acknowledgments: {
        include: {
          employee: {
            include: {
              user: true
            }
          }
        }
      }
    },
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  // Near-miss summary (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const nearMisses = await prisma.nearMiss.findMany({
    where: {
      reportedAt: {
        gte: sevenDaysAgo
      }
    }
  });

  const nearMissByType = {
    slipHazards: nearMisses.filter(nm => nm.category === 'SLIP_HAZARD').length,
    authorityAlerts: nearMisses.filter(nm => nm.category === 'AUTHORITY').length,
  };

  return (
    <AppShell
      orgName="System of Proof"
      userRole="SAFETY_MANAGER"
      userName="Safety Manager"
      evidenceStatus="PASS"
    >
      <PageContainer
        title="Safety Dashboard"
        description="Active JHAs, near-miss summary, and AI safety insights"
      >
        {/* Active JHAs */}
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-4">Active JHAs</h2>
          <Card>
            {activeJHAs.map((jha) => (
              <div key={jha.id} className="flex items-center justify-between p-3 border-b border-border-default last:border-b-0">
                <div className="flex flex-col gap-1">
                  <Link 
                    href={`/safety/jha/${jha.id}`}
                    className="text-text-primary font-bold hover:text-status-valid"
                  >
                    {jha.workType} {jha.location}
                  </Link>
                  <span className="text-sm text-text-secondary">
                    {jha.acknowledgments.length} workers
                  </span>
                </div>
                <Link 
                  href={`/safety/jha/${jha.id}`}
                  className="text-status-valid text-sm hover:underline"
                >
                  View →
                </Link>
              </div>
            ))}
            {activeJHAs.length === 0 && (
              <p className="text-text-secondary">No active JHAs</p>
            )}
          </Card>
        </section>

        {/* Near-Miss Summary */}
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-4">Near-Miss Summary (7 days)</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <div className="flex flex-col gap-2">
                <span className="text-text-secondary text-sm">Slip hazards</span>
                <span className="text-3xl font-bold text-status-expiring">{nearMissByType.slipHazards}</span>
              </div>
            </Card>
            <Card>
              <div className="flex flex-col gap-2">
                <span className="text-text-secondary text-sm">Authority alerts</span>
                <span className="text-3xl font-bold text-status-expired">{nearMissByType.authorityAlerts}</span>
              </div>
            </Card>
          </div>
        </section>

        {/* AI Safety Insights */}
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-4">AI Safety Insights (Advisory)</h2>
          <div className="flex flex-col gap-3">
            <AICallout
              insightType="near_miss_cluster"
              confidenceScore={78}
              advisoryText="Near-miss cluster detected at MP 118–120"
            />
            <AICallout
              insightType="fatigue_risk"
              confidenceScore={65}
              advisoryText="Fatigue risk rising — Crew B"
            />
          </div>
        </section>

        {/* Actions */}
        <section>
          <div className="flex gap-4">
            <Link 
              href="/safety/jha/create"
              className="px-4 py-2 bg-status-valid text-white rounded-md hover:opacity-90"
            >
              ➕ Create New JHA
            </Link>
            <Link 
              href="/safety/near-miss"
              className="px-4 py-2 bg-bg-secondary border border-border-default rounded-md hover:bg-bg-primary"
            >
              View All Near-Misses
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
        <div className="bg-blue-50 rounded-lg shadow p-4">
          <h2 className="font-semibold text-blue-800">Near Misses (30d)</h2>
          <p className="text-3xl font-bold text-blue-600">{nearMisses.length}</p>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-4">
          <h2 className="font-semibold text-red-800">Incidents</h2>
          <p className="text-3xl font-bold text-red-600">{incidents.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-4">Recent Near Misses</h2>
        {nearMisses.length === 0 ? (
          <p className="text-gray-500">No near misses reported</p>
        ) : (
          <ul className="space-y-2">
            {nearMisses.slice(0, 5).map(nm => (
              <li key={nm.id} className="border-b pb-2">
                <span className="font-medium">{nm.title || 'Untitled'}</span>
                <span className="ml-2 text-sm text-gray-500">
                  {new Date(nm.reportedAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
