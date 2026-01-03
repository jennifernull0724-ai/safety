import { prisma } from '@/lib/prisma';

export default async function SupervisorDashboardPage() {
  const employees = await prisma.employee.findMany({ 
    take: 20,
    include: { certifications: true },
    orderBy: { lastName: 'asc' },
  });
  const crews = await prisma.crew.findMany({
    include: { members: true },
  });

  const employeesWithExpiring = employees.filter(e => 
    e.certifications.some(c => c.status === 'expiring')
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Supervisor Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold text-gray-600">Team Members</h2>
          <p className="text-3xl font-bold">{employees.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold text-gray-600">Crews</h2>
          <p className="text-3xl font-bold">{crews.length}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4">
          <h2 className="font-semibold text-yellow-800">Expiring Certs</h2>
          <p className="text-3xl font-bold text-yellow-600">{employeesWithExpiring.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-4">Team Members</h2>
        {employees.length === 0 ? (
          <p className="text-gray-500">No employees found</p>
        ) : (
          <ul className="space-y-2">
            {employees.slice(0, 10).map(emp => (
              <li key={emp.id} className="border-b pb-2 flex justify-between">
                <span>{emp.firstName} {emp.lastName}</span>
                <span className="text-sm text-gray-500">
                  {emp.certifications.length} certifications
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
