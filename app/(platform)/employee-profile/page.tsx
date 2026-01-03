import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EmployeeProfilePage({ params }: { params: { id: string } }) {
  const employee = await prisma.employee.findUnique({
    where: { id: params.id },
    include: { certifications: true, organization: true },
  });
  
  if (!employee) return notFound();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{employee.firstName} {employee.lastName}</h1>
      <p className="text-gray-600">{employee.tradeRole}</p>
      
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-4">Certifications</h2>
        {employee.certifications.length === 0 ? (
          <p className="text-gray-500">No certifications</p>
        ) : (
          <ul className="space-y-2">
            {employee.certifications.map(cert => (
              <li key={cert.id} className="border-b pb-2">
                <span className="font-medium">{cert.certType || cert.certificationType}</span>
                <span className={`ml-2 px-2 py-1 text-xs rounded ${
                  cert.status === 'valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {cert.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
