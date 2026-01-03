import { prisma } from '@/lib/prisma';

export default async function AdminDashboardPage() {
  // Server-only: fetch admin data 
  const organizations = await prisma.organization.findMany({ take: 10 });
  const users = await prisma.user.findMany({ take: 10 });
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold">Organizations</h2>
          <p className="text-3xl">{organizations.length}</p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold">Users</h2>
          <p className="text-3xl">{users.length}</p>
        </div>
      </div>
    </div>
  );
}
