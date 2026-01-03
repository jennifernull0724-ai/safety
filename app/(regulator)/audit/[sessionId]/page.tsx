import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function RegulatorAuditPage({ params }: { params: { sessionId: string } }) {
  // Log every regulator access
  const evidenceNodes = await prisma.evidenceNode.findMany({
    include: { ledgerEntries: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <div className="bg-red-600 text-white p-4 rounded-lg">
        <h1 className="text-2xl font-bold">Regulator Audit Session</h1>
        <p className="text-sm opacity-90">Session ID: {params.sessionId}</p>
        <p className="text-sm opacity-90">All access is logged and immutable</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Evidence Repository</h2>
        <p className="text-gray-600 mb-4">
          Total evidence nodes: <span className="font-bold">{evidenceNodes.length}</span>
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Evidence ID</th>
                <th className="px-4 py-3 text-left">Entity Type</th>
                <th className="px-4 py-3 text-left">Entity ID</th>
                <th className="px-4 py-3 text-left">Ledger Entries</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {evidenceNodes.map(node => (
                <tr key={node.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm">{node.id.substring(0, 12)}...</td>
                  <td className="px-4 py-3">{node.entityType}</td>
                  <td className="px-4 py-3 font-mono text-sm">{node.entityId.substring(0, 8)}...</td>
                  <td className="px-4 py-3">{node.ledgerEntries.length}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(node.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link 
                      href={`/api/regulator/evidence/${node.id}`} 
                      className="text-blue-600 hover:underline"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 text-sm">
          <strong>Notice:</strong> This is a read-only regulatory access portal. 
          All queries and data retrievals are automatically logged to the immutable ledger 
          with your session ID for audit trail purposes.
        </p>
      </div>
    </div>
  );
}
