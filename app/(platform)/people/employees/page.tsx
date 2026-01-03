import { PageContainer } from "@/components/PageContainer";
import { StatusBadge } from "@/components/StatusBadge";
import { DataTable } from "@/components/DataTable";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function EmployeesPage() {
  const session = await getSession();

  if (!session || !["admin", "safety"].includes(session.user.role)) {
    notFound();
  }

  // Load employees for this organization
  const employees = await prisma.employee.findMany({
    where: {
      organizationId: session.user.organizationId,
    },
    include: {
      certifications: {
        orderBy: {
          expirationDate: "asc",
        },
      },
    },
  });

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (emp: any) => `${emp.firstName} ${emp.lastName}`,
    },
    {
      key: "trade",
      header: "Trade Role",
      render: (emp: any) => emp.tradeRole || "N/A",
    },
    {
      key: "certifications",
      header: "Certifications",
      render: (emp: any) => emp.certifications.length,
    },
    {
      key: "status",
      header: "Status",
      render: (emp: any) => {
        const activeCerts = emp.certifications.filter(
          (cert: any) => cert.status === "active"
        );
        const status = activeCerts.length > 0 ? "PASS" : "FAIL";
        return <StatusBadge status={status} />;
      },
    },
  ];

  return (
    <PageContainer title="Employees">
      <DataTable
        columns={columns}
        data={employees}
        keyExtractor={(emp: any) => emp.id}
      />
    </PageContainer>
  );
}
