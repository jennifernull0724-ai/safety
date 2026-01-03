import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function EmployeeDirectoryPage() {
  const session = await getSession();
  if (!session || !['admin', 'safety', 'supervisor'].includes(session.user.role)) {
    notFound();
  }
  
  const employees = await prisma.employee.findMany({
    orderBy: { lastName: 'asc' },
    take: 100,
    include: { certifications: true, organization: true },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employee Directory</h1>
            <p className="text-gray-600 mt-2">Manage workforce certifications and compliance</p>
          </div>
          <Link
            href="/employees/create"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            + Create Employee
          </Link>
        </div>

        {/* Empty State */}
        {employees.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
            <div className="text-8xl mb-6">👷</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No employees have been created yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Get started by creating your first employee record to begin tracking certifications and compliance.
            </p>
            <Link
              href="/employees/create"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              + Create Employee
            </Link>
          </div>
        ) : (
          /* Employee Table */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Employee Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Trade Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Compliance Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {employees.map(emp => {
                    const failedCerts = emp.certifications?.filter((c: any) => c.status === 'revoked' || c.status === 'expired').length || 0;
                    const activeCerts = emp.certifications?.filter((c: any) => c.status === 'active').length || 0;
                    const complianceStatus = failedCerts > 0 ? 'FAIL' : activeCerts > 0 ? 'PASS' : 'INCOMPLETE';
                    
                    return (
                      <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {emp.firstName} {emp.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700">{emp.tradeRole || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            emp.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {emp.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            complianceStatus === 'PASS' ? 'bg-green-100 text-green-800' :
                            complianceStatus === 'INCOMPLETE' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {complianceStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <Link
                              href={`/employees/${emp.id}/qr`}
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                            >
                              View QR
                            </Link>
                            <Link
                              href={`/people/employees/${emp.id}`}
                              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
                            >
                              Manage Certifications
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
