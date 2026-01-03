import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function JHAPage() {
  const session = await getSession();
  if (!session || !['admin', 'safety'].includes(session.user.role)) {
    notFound();
  }
  const jhas = await prisma.jobHazardAnalysis.findMany({
    include: { organization: true, acknowledgments: { include: { employee: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const activeJHAs = jhas.filter(j => j.status === 'active');
  const completedJHAs = jhas.filter(j => j.status === 'closed');
  const pendingJHAs = jhas.filter(j => j.status === 'draft');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Hazard Analysis</h1>
          <p className="text-gray-500">Manage job safety assessments and crew acknowledgments</p>
        </div>
        <Link
          href="/safety/jha/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + New JHA
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-yellow-50 rounded-lg shadow p-4">
          <h2 className="font-semibold text-yellow-800 mb-2">Pending Review</h2>
          <p className="text-3xl font-bold text-yellow-600">{pendingJHAs.length}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-4">
          <h2 className="font-semibold text-blue-800 mb-2">Active</h2>
          <p className="text-3xl font-bold text-blue-600">{activeJHAs.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4">
          <h2 className="font-semibold text-green-800 mb-2">Completed</h2>
          <p className="text-3xl font-bold text-green-600">{completedJHAs.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">All JHAs</h2>
        </div>
        <div className="overflow-x-auto">
          {jhas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No JHAs found</p>
              <Link
                href="/safety/jha/new"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Create Your First JHA
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Job Name</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Organization</th>
                  <th className="px-4 py-3 text-left">Acknowledgments</th>
                  <th className="px-4 py-3 text-left">Created</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jhas.map(jha => (
                  <tr key={jha.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{jha.jobName}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        jha.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        jha.status === 'closed' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {jha.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{jha.organization?.name || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className="text-gray-600">{jha.acknowledgments.length} acknowledgments</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(jha.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/safety/jha/${jha.id}`} className="text-blue-600 hover:underline">
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
