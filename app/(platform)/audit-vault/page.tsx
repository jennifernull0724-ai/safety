import { prisma } from '@/lib/prisma';

export default async function AuditVaultPage() {
  const ledgerEntries = await prisma.immutableEventLedger.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { evidenceNode: true },
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Audit Vault - Immutable Ledger</h1>
      <p className="text-gray-600">All entries are append-only and cryptographically verified.</p>
      
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-4">Recent Ledger Entries ({ledgerEntries.length})</h2>
        {ledgerEntries.length === 0 ? (
          <p className="text-gray-500">No ledger entries found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Event Type</th>
                  <th className="px-4 py-2 text-left">Entity</th>
                  <th className="px-4 py-2 text-left">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {ledgerEntries.map(entry => (
                  <tr key={entry.id} className="border-t">
                    <td className="px-4 py-2 font-mono text-xs">{entry.eventType}</td>
                    <td className="px-4 py-2">{entry.evidenceNode?.entityType}</td>
                    <td className="px-4 py-2 text-gray-500">
                      {new Date(entry.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
