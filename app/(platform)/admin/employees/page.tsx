import { prisma } from '@/lib/prisma';
import { AppShell, PageContainer, Card, StatusBadge } from '@/components';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth';

/**
 * ADMIN EMPLOYEE DIRECTORY
 * 
 * Filterable employee list with compliance state.
 * 
 * Table columns:
 * - Name
 * - Trade
 * - Crew
 * - Compliance State (PASS/INCOMPLETE/FAIL)
 * - QR
 * - Actions
 * 
 * Rules:
 * - Compliance state is system-derived
 * - No edit/delete on employee records
 * - Click → Employee Profile (Admin View)
 */

export default async function AdminEmployeesPage({
  searchParams,
}: {
  searchParams: { status?: string; trade?: string };
}) {
  const session = await getSession();
  if (!session || session.user.role !== 'admin') {
    notFound();
  }
  // Fetch employees with compliance state
  const employees = await prisma.employee.findMany({
    include: {
      certifications: {
        select: { status: true }
      },
      user: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Derive compliance state per employee
  const employeesWithCompliance = employees.map(emp => {
    const hasFail = emp.certifications.some(c => c.status === 'FAIL');
    const hasIncomplete = emp.certifications.some(c => c.status === 'INCOMPLETE');
    const allPass = emp.certifications.every(c => c.status === 'PASS');

    const complianceState: 'PASS' | 'INCOMPLETE' | 'FAIL' = 
      hasFail ? 'FAIL' : hasIncomplete ? 'INCOMPLETE' : allPass ? 'PASS' : 'INCOMPLETE';

    return {
      ...emp,
      complianceState,
      userName: emp.user?.name || 'Unknown'
    };
  });

  // Apply filters
  const filtered = employeesWithCompliance.filter(emp => {
    if (searchParams.status && emp.complianceState !== searchParams.status) return false;
    if (searchParams.trade && emp.tradeRole !== searchParams.trade) return false;
    return true;
  });

  return (
    <AppShell
      orgName="System of Proof"
      userRole="ADMIN"
      userName="Admin User"
      evidenceStatus="PASS"
    >
      <PageContainer
        title="Employee Directory"
        description="All employees with compliance state"
        actions={
          <Link 
            href="/admin/employees/create"
            className="px-4 py-2 bg-status-valid text-white rounded-md hover:opacity-90"
          >
            ➕ Create Employee
          </Link>
        }
      >
        {/* Filters */}
        <Card>
          <h3 className="text-text-primary font-bold mb-3">Filters</h3>
          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-text-secondary">Compliance State</label>
              <select className="p-2 border border-border-default rounded-md">
                <option value="">All</option>
                <option value="PASS">PASS</option>
                <option value="INCOMPLETE">INCOMPLETE</option>
                <option value="FAIL">FAIL</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm text-text-secondary">Trade</label>
              <select className="p-2 border border-border-default rounded-md">
                <option value="">All</option>
                <option value="TRACK_MAINTENANCE">Track Maintenance</option>
                <option value="SIGNAL">Signal</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Employee Table */}
        <Card>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-default">
                <th className="text-left p-3 text-text-secondary text-sm">Name</th>
                <th className="text-left p-3 text-text-secondary text-sm">Trade</th>
                <th className="text-left p-3 text-text-secondary text-sm">Crew</th>
                <th className="text-left p-3 text-text-secondary text-sm">Compliance State</th>
                <th className="text-left p-3 text-text-secondary text-sm">QR</th>
                <th className="text-left p-3 text-text-secondary text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr key={emp.id} className="border-b border-border-default hover:bg-bg-secondary">
                  <td className="p-3 text-text-primary">{emp.userName}</td>
                  <td className="p-3 text-text-secondary">{emp.tradeRole || 'N/A'}</td>
                  <td className="p-3 text-text-secondary">{emp.crewId || 'N/A'}</td>
                  <td className="p-3">
                    <StatusBadge status={emp.complianceState} timestamp={new Date()} />
                  </td>
                  <td className="p-3">
                    <Link 
                      href={`/verify/${emp.id}`}
                      className="text-status-valid hover:underline"
                    >
                      View QR
                    </Link>
                  </td>
                  <td className="p-3">
                    <Link 
                      href={`/admin/employees/${emp.id}`}
                      className="text-status-valid hover:underline"
                    >
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="p-8 text-center text-text-secondary">
              No employees found matching filters
            </div>
          )}
        </Card>

        <div className="text-xs text-text-secondary">
          Last Evaluated At: {new Date().toISOString()}
        </div>
      </PageContainer>
    </AppShell>
  );
}
