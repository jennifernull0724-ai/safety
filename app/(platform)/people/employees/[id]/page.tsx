import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EmployeeDetailPage({ params }: { params: { id: string } }) {
  const employee = await prisma.employee.findUnique({
    where: { id: params.id },
    include: { certifications: true, organization: true },
  });

  if (!employee) notFound();

  const validCerts = employee.certifications.filter(c => c.status === 'valid');
  const expiredCerts = employee.certifications.filter(c => c.status === 'expired');
  const revokedCerts = employee.certifications.filter(c => c.status === 'revoked');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/employee-directory" className="text-sm text-blue-600 hover:underline">
            ← Back to Directory
          </Link>
          <h1 className="text-3xl font-bold mt-2">{employee.firstName} {employee.lastName}</h1>
          <p className="text-gray-500">{employee.role || 'No role assigned'}</p>
        </div>
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            employee.status === 'active' ? 'bg-green-100 text-green-800' :
            employee.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
            'bg-red-100 text-red-800'
          }`}>
            {employee.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold text-gray-700 mb-2">Employee ID</h2>
          <p className="text-lg">{employee.employeeNumber || 'N/A'}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold text-gray-700 mb-2">Organization</h2>
          <p className="text-lg">{employee.organization?.name || 'N/A'}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold text-gray-700 mb-2">Hire Date</h2>
          <p className="text-lg">{employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : 'N/A'}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Certifications</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">{validCerts.length}</div>
              <div className="text-sm text-gray-600">Valid</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded">
              <div className="text-2xl font-bold text-yellow-600">{expiredCerts.length}</div>
              <div className="text-sm text-gray-600">Expired</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded">
              <div className="text-2xl font-bold text-red-600">{revokedCerts.length}</div>
              <div className="text-sm text-gray-600">Revoked</div>
            </div>
          </div>

          {employee.certifications.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No certifications on record</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Issue Date</th>
                  <th className="px-4 py-2 text-left">Expiration</th>
                </tr>
              </thead>
              <tbody>
                {employee.certifications.map(cert => (
                  <tr key={cert.id} className="border-t">
                    <td className="px-4 py-3">{cert.certType}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        cert.status === 'valid' ? 'bg-green-100 text-green-800' :
                        cert.status === 'expired' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {cert.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-4 py-3">{cert.expirationDate ? new Date(cert.expirationDate).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
