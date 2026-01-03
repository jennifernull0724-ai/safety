import { prisma } from '@/lib/prisma';

export default async function ExecutiveDashboardPage() {
  const organizations = await prisma.organization.findMany({ take: 10 });
  const employees = await prisma.employee.count();
  const certifications = await prisma.certification.count();
  const incidents = await prisma.incident.count();
  const auditCases = await prisma.auditCase.count();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Executive Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold text-gray-600">Organizations</h2>
          <p className="text-3xl font-bold">{organizations.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold text-gray-600">Employees</h2>
          <p className="text-3xl font-bold">{employees}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold text-gray-600">Certifications</h2>
          <p className="text-3xl font-bold">{certifications}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold text-gray-600">Incidents</h2>
          <p className="text-3xl font-bold">{incidents}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-2">Audit Readiness</h2>
        <p className="text-gray-600">Active audit cases: <span className="font-bold">{auditCases}</span></p>
      </div>
    </div>
  );
}
