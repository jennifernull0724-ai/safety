import { prisma } from '@/lib/prisma';

export default async function RegulatorDashboardPage() {
  // Regulator read-only access - all access logged
  const evidenceNodes = await prisma.evidenceNode.findMany({ 
    take: 50,
    orderBy: { createdAt: 'desc' },
    include: { ledgerEntries: true },
  });
  const auditCases = await prisma.auditCase.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <div className="bg-red-600 text-white p-4 rounded-lg">
        <h1 className="text-2xl font-bold">Regulator Access Portal</h1>
        <p className="text-sm opacity-90">Read-only access. All queries are logged to immutable ledger.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-2">Evidence Nodes</h2>
          <p className="text-3xl font-bold">{evidenceNodes.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-2">Audit Cases</h2>
          <p className="text-3xl font-bold">{auditCases.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-4">Recent Evidence</h2>
        {evidenceNodes.length === 0 ? (
          <p className="text-gray-500">No evidence found</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Entity Type</th>
                <th className="px-4 py-2 text-left">Entity ID</th>
                <th className="px-4 py-2 text-left">Ledger Entries</th>
                <th className="px-4 py-2 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {evidenceNodes.map(node => (
                <tr key={node.id} className="border-t">
                  <td className="px-4 py-2">{node.entityType}</td>
                  <td className="px-4 py-2 font-mono text-xs">{node.entityId.substring(0, 8)}...</td>
                  <td className="px-4 py-2">{node.ledgerEntries.length}</td>
                  <td className="px-4 py-2 text-gray-500">{new Date(node.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
