import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function WorkWindowsPage() {
  const session = await getSession();
  if (!session || !['admin', 'operations', 'dispatch'].includes(session.user.role)) {
    notFound();
  }
  const workWindows = await prisma.workWindow.findMany({
    include: { organization: true },
    orderBy: { startTime: 'desc' },
  });

  const now = new Date();
  const activeWindows = workWindows.filter(w => 
    new Date(w.startTime) <= now && (!w.endTime || new Date(w.endTime) >= now)
  );
  const scheduledWindows = workWindows.filter(w => new Date(w.startTime) > now);
  const completedWindows = workWindows.filter(w => w.endTime && new Date(w.endTime) < now);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Work Windows</h1>
          <p className="text-gray-500">Manage scheduled work periods and certification enforcement</p>
        </div>
        <Link
          href="/operations/work-windows/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + New Work Window
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 rounded-lg shadow p-4">
          <h2 className="font-semibold text-green-800 mb-2">Active Now</h2>
          <p className="text-3xl font-bold text-green-600">{activeWindows.length}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-4">
          <h2 className="font-semibold text-blue-800 mb-2">Scheduled</h2>
          <p className="text-3xl font-bold text-blue-600">{scheduledWindows.length}</p>
        </div>
        <div className="bg-gray-50 rounded-lg shadow p-4">
          <h2 className="font-semibold text-gray-800 mb-2">Completed</h2>
          <p className="text-3xl font-bold text-gray-600">{completedWindows.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">All Work Windows</h2>
        </div>
        <div className="overflow-x-auto">
          {workWindows.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No work windows found</p>
              <Link
                href="/operations/work-windows/new"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Create Your First Work Window
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Organization</th>
                  <th className="px-4 py-3 text-left">Start</th>
                  <th className="px-4 py-3 text-left">End</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {workWindows.map(window => {
                  const isActive = new Date(window.startTime) <= now && (!window.endTime || new Date(window.endTime) >= now);
                  const isScheduled = new Date(window.startTime) > now;
                  return (
                    <tr key={window.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{window.name || 'Unnamed Window'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          isActive ? 'bg-green-100 text-green-800' :
                          isScheduled ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {isActive ? 'Active' : isScheduled ? 'Scheduled' : 'Completed'}
                        </span>
                      </td>
                      <td className="px-4 py-3">{window.organization?.name || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(window.startTime).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {window.endTime ? new Date(window.endTime).toLocaleString() : 'Ongoing'}
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/operations/work-windows/${window.id}`} className="text-blue-600 hover:underline">
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
