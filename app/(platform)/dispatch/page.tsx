import { prisma } from '@/lib/prisma';

export default async function DispatchDashboardPage() {
  const jhas = await prisma.jobHazardAnalysis.findMany({ 
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: { acknowledgments: true },
  });
  const workWindows = await prisma.workWindow.findMany({
    take: 10,
    orderBy: { startTime: 'desc' },
  });

  const activeJHAs = jhas.filter(j => j.status === 'active');

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dispatch Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold text-gray-600">Active JHAs</h2>
          <p className="text-3xl font-bold">{activeJHAs.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold text-gray-600">Total JHAs</h2>
          <p className="text-3xl font-bold">{jhas.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold text-gray-600">Work Windows</h2>
          <p className="text-3xl font-bold">{workWindows.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-4">Recent Job Hazard Analyses</h2>
        {jhas.length === 0 ? (
          <p className="text-gray-500">No JHAs found</p>
        ) : (
          <ul className="space-y-2">
            {jhas.slice(0, 5).map(jha => (
              <li key={jha.id} className="border-b pb-2">
                <span className="font-medium">{jha.jobName || jha.workType}</span>
                <span className={`ml-2 px-2 py-1 text-xs rounded ${
                  jha.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {jha.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
