import { prisma } from '@/lib/prisma';
import { AppShell, PageContainer, Card, StatusBadge, QRCodeCard, EvidenceTimeline } from '@/components';
import { notFound } from 'next/navigation';
import Link from 'next/link';

/**
 * ADMIN EMPLOYEE PROFILE
 * 
 * Internal QR page with:
 * - Employee header (photo, name, trade, status, QR code)
 * - Compliance table (preset-driven)
 * - Enforcement history (read-only)
 * - Linked evidence (JHAs, field logs, incidents, snapshots)
 * 
 * Rules:
 * - Status is auto-derived
 * - Proof is view-only if present
 * - Action = Upload Proof only if INCOMPLETE or FAIL
 * - ❌ No edit / delete on certifications
 */

interface Props {
  params: { employeeId: string };
}

export default async function AdminEmployeeProfilePage({ params }: Props) {
  const employee = await prisma.employee.findUnique({
    where: { id: params.employeeId },
    include: {
      user: true,
      certifications: {
        include: {
          evidenceNode: true
        },
        orderBy: { expirationDate: 'asc' }
      },
      jhaAcknowledgments: {
        include: {
          jha: true,
          evidenceNode: true
        },
        take: 5,
        orderBy: { acknowledgedAt: 'desc' }
      }
    }
  });

  if (!employee) {
    notFound();
  }

  // Derive overall compliance state
  const hasFail = employee.certifications.some(c => c.status === 'FAIL');
  const hasIncomplete = employee.certifications.some(c => c.status === 'INCOMPLETE');
  const overallStatus: 'PASS' | 'INCOMPLETE' | 'FAIL' = 
    hasFail ? 'FAIL' : hasIncomplete ? 'INCOMPLETE' : 'PASS';

  // Enforcement history (from EnforcementActions)
  const enforcementHistory = await prisma.enforcementAction.findMany({
    where: {
      entityId: params.employeeId,
      entityType: 'Employee'
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  return (
    <AppShell
      orgName="System of Proof"
      userRole="ADMIN"
      userName="Admin User"
      evidenceStatus={overallStatus}
    >
      <PageContainer
        title={employee.user?.name || 'Employee Profile'}
        description="Internal Admin View with QR Code"
      >
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column: Employee Info + QR */}
          <div className="col-span-1 flex flex-col gap-4">
            <Card>
              <div className="flex flex-col gap-3">
                <div className="w-24 h-24 bg-bg-secondary rounded-full flex items-center justify-center text-3xl">
                  👤
                </div>
                <h2 className="text-xl font-bold text-text-primary">{employee.user?.name}</h2>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-text-secondary">Trade Role</span>
                  <span className="text-text-primary">{employee.tradeRole || 'N/A'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-text-secondary">Status</span>
                  <StatusBadge status={overallStatus} timestamp={new Date()} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-text-secondary">Company</span>
                  <span className="text-text-primary">{employee.organizationId}</span>
                </div>
              </div>
            </Card>

            {/* QR Code */}
            <Card>
              <h3 className="text-sm font-bold text-text-primary mb-3">QR Code (Downloadable)</h3>
              <QRCodeCard
                certificationId={employee.certifications[0]?.id || 'none'}
                status={overallStatus}
                qrToken={`emp-${employee.id}`}
              />
            </Card>
          </div>

          {/* Right Column: Compliance + History */}
          <div className="col-span-2 flex flex-col gap-6">
            {/* Compliance Table */}
            <section>
              <h2 className="text-lg font-bold text-text-primary mb-4">Compliance Table (Preset-Driven)</h2>
              <Card>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-default">
                      <th className="text-left p-2 text-xs text-text-secondary">Category</th>
                      <th className="text-left p-2 text-xs text-text-secondary">Certification</th>
                      <th className="text-left p-2 text-xs text-text-secondary">Issuer</th>
                      <th className="text-left p-2 text-xs text-text-secondary">Issue</th>
                      <th className="text-left p-2 text-xs text-text-secondary">Exp</th>
                      <th className="text-left p-2 text-xs text-text-secondary">Status</th>
                      <th className="text-left p-2 text-xs text-text-secondary">Proof</th>
                      <th className="text-left p-2 text-xs text-text-secondary">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employee.certifications.map((cert) => (
                      <tr key={cert.id} className="border-b border-border-default">
                        <td className="p-2 text-sm text-text-secondary">Safety</td>
                        <td className="p-2 text-sm text-text-primary">{cert.certificationTypeId}</td>
                        <td className="p-2 text-sm text-text-secondary">{cert.issuingAuthority || 'N/A'}</td>
                        <td className="p-2 text-sm text-text-secondary">
                          {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="p-2 text-sm text-text-secondary">
                          {new Date(cert.expirationDate).toLocaleDateString()}
                        </td>
                        <td className="p-2">
                          <StatusBadge status={cert.status} timestamp={new Date()} />
                        </td>
                        <td className="p-2">
                          {cert.evidenceNode ? (
                            <Link href={`/evidence/${cert.evidenceNode.id}`} className="text-status-valid text-sm hover:underline">
                              View
                            </Link>
                          ) : (
                            <span className="text-text-secondary text-sm">None</span>
                          )}
                        </td>
                        <td className="p-2">
                          {(cert.status === 'INCOMPLETE' || cert.status === 'FAIL') && (
                            <button className="text-status-valid text-sm hover:underline">
                              Upload Proof
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </section>

            {/* Enforcement History */}
            <section>
              <h2 className="text-lg font-bold text-text-primary mb-4">Enforcement History (Read-only)</h2>
              <Card>
                <div className="flex flex-col gap-3">
                  {enforcementHistory.map((action) => (
                    <div key={action.id} className="flex items-start gap-3 p-2 border-b border-border-default">
                      <span className="text-2xl">🔒</span>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-text-primary">{action.type}</span>
                        <span className="text-xs text-text-secondary">{action.reason}</span>
                        <span className="text-xs text-text-secondary">
                          {new Date(action.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {enforcementHistory.length === 0 && (
                    <p className="text-text-secondary text-sm">No enforcement actions</p>
                  )}
                </div>
              </Card>
            </section>

            {/* Linked Evidence */}
            <section>
              <h2 className="text-lg font-bold text-text-primary mb-4">Linked Evidence</h2>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <h3 className="text-sm font-bold text-text-primary mb-2">JHAs</h3>
                  <div className="flex flex-col gap-2">
                    {employee.jhaAcknowledgments.map((ack) => (
                      <Link 
                        key={ack.id}
                        href={`/safety/jha/${ack.jhaId}`}
                        className="text-status-valid text-sm hover:underline"
                      >
                        {ack.jha.workType} - {new Date(ack.acknowledgedAt).toLocaleDateString()}
                      </Link>
                    ))}
                    {employee.jhaAcknowledgments.length === 0 && (
                      <span className="text-text-secondary text-sm">No JHA records</span>
                    )}
                  </div>
                </Card>

                <Card>
                  <h3 className="text-sm font-bold text-text-primary mb-2">Snapshots</h3>
                  <span className="text-text-secondary text-sm">No snapshots available</span>
                </Card>
              </div>
            </section>
          </div>
        </div>

        <div className="text-xs text-text-secondary mt-6">
          Last Evaluated At: {new Date().toISOString()}
        </div>
      </PageContainer>
    </AppShell>
  );
}
