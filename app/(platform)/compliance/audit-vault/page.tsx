import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function ComplianceAuditVaultPage() {
  const auditCases = await prisma.auditCase.findMany({
    include: { 
      evidenceLinks: { include: { evidenceNode: true } },
      organization: true 
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalEvidence = auditCases.reduce((sum, audit) => sum + audit.evidenceLinks.length, 0);
  const openCases = auditCases.filter(a => a.status === 'open');
  const closedCases = auditCases.filter(a => a.status === 'closed');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Compliance Audit Vault</h1>
          <p className="text-gray-500">Immutable evidence repository for regulatory compliance</p>
        </div>
        <Link
          href="/compliance/audit-vault/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + New Audit Case
        </Link>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <p className="text-yellow-800 font-medium">
          ⚠️ All evidence in this vault is append-only and cryptographically hashed. 
          Modifications are permanently logged in the immutable ledger.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg shadow p-4">
          <h2 className="font-semibold text-blue-800 mb-2">Total Cases</h2>
          <p className="text-3xl font-bold text-blue-600">{auditCases.length}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4">
          <h2 className="font-semibold text-yellow-800 mb-2">Open</h2>
          <p className="text-3xl font-bold text-yellow-600">{openCases.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4">
          <h2 className="font-semibold text-green-800 mb-2">Closed</h2>
          <p className="text-3xl font-bold text-green-600">{closedCases.length}</p>
        </div>
        <div className="bg-purple-50 rounded-lg shadow p-4">
          <h2 className="font-semibold text-purple-800 mb-2">Evidence Items</h2>
          <p className="text-3xl font-bold text-purple-600">{totalEvidence}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Audit Cases</h2>
        </div>
        <div className="overflow-x-auto">
          {auditCases.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No audit cases found</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Case ID</th>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Organization</th>
                  <th className="px-4 py-3 text-left">Evidence</th>
                  <th className="px-4 py-3 text-left">Created</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {auditCases.map(audit => (
                  <tr key={audit.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sm">{audit.id.substring(0, 8)}...</td>
                    <td className="px-4 py-3 font-medium">{audit.title}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        audit.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {audit.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{audit.organization?.name || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className="text-gray-600">{audit.evidenceLinks.length} items</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(audit.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <Link href={`/compliance/audit-vault/${audit.id}`} className="text-blue-600 hover:underline">
                        View
                      </Link>
                      <Link href={`/api/audits/${audit.id}/export`} className="text-green-600 hover:underline">
                        Export
                      </Link>
                    </td>
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
