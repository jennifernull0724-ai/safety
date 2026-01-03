import { prisma } from '@/lib/prisma';

export default async function SafetyDashboardPage() {
  const nearMisses = await prisma.nearMiss.findMany({ 
    take: 20,
    orderBy: { reportedAt: 'desc' },
  });
  const incidents = await prisma.incident.findMany({
    take: 10,
    orderBy: { occurredAt: 'desc' },
  });
  const certifications = await prisma.certification.findMany({
    where: { status: 'valid' },
  });
  const expiringCerts = await prisma.certification.findMany({
    where: { status: 'expiring' },
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Safety Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-green-50 rounded-lg shadow p-4">
          <h2 className="font-semibold text-green-800">Valid Certifications</h2>
          <p className="text-3xl font-bold text-green-600">{certifications.length}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4">
          <h2 className="font-semibold text-yellow-800">Expiring Soon</h2>
          <p className="text-3xl font-bold text-yellow-600">{expiringCerts.length}</p>
        </div>
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
