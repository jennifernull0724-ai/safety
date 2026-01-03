import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function IncidentsPage() {
  const session = await getSession();
  if (!session || !['admin', 'safety', 'operations'].includes(session.user.role)) {
    notFound();
  }
  const incidents = await prisma.incident.findMany({
    include: { employees: { include: { employee: true } }, organization: true },
    orderBy: { occurredAt: 'desc' },
  });

  const openIncidents = incidents.filter(i => i.status === 'OPEN' || i.status === 'UNDER_INVESTIGATION');
  const closedIncidents = incidents.filter(i => i.status === 'CLOSED');
  const criticalIncidents = incidents.filter(i => i.severity === 'CRITICAL' || i.severity === 'HIGH');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Incidents</h1>
          <p className="text-gray-500">Track and investigate workplace incidents</p>
        </div>
        <Link
          href="/incidents/new"
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          + Report Incident
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-red-50 rounded-lg shadow p-4">
          <h2 className="font-semibold text-red-800 mb-2">Critical/High</h2>
          <p className="text-3xl font-bold text-red-600">{criticalIncidents.length}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4">
          <h2 className="font-semibold text-yellow-800 mb-2">Open</h2>
          <p className="text-3xl font-bold text-yellow-600">{openIncidents.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4">
          <h2 className="font-semibold text-green-800 mb-2">Closed</h2>
          <p className="text-3xl font-bold text-green-600">{closedIncidents.length}</p>
        </div>
        <div className="bg-gray-50 rounded-lg shadow p-4">
          <h2 className="font-semibold text-gray-800 mb-2">Total</h2>
          <p className="text-3xl font-bold text-gray-600">{incidents.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">All Incidents</h2>
        </div>
        <div className="overflow-x-auto">
          {incidents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No incidents recorded</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Severity</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Personnel</th>
                  <th className="px-4 py-3 text-left">Occurred</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map(incident => (
                  <tr key={incident.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{incident.title}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        incident.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                        incident.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                        incident.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {incident.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        incident.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' :
                        incident.status === 'UNDER_INVESTIGATION' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {incident.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {incident.employees.length} involved
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {incident.occurredAt ? new Date(incident.occurredAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/incidents/${incident.id}`} className="text-blue-600 hover:underline">
                        View
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
