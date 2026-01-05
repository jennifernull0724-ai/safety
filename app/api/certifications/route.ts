import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getEmployeeCertificationsAsOfDate } from '@/lib/services/certificationCorrection';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/certifications
 * Get all certifications, optionally filtered by date (point-in-time query)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const asOfDate = searchParams.get('asOfDate');

    if (asOfDate) {
      // Point-in-time query
      const date = new Date(asOfDate);
      if (isNaN(date.getTime())) {
        return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
      }

      // Get all employees in the organization
      const employees = await prisma.employee.findMany({
        select: { id: true },
      });

      const allCertifications = [];
      for (const employee of employees) {
        const certs = await getEmployeeCertificationsAsOfDate(employee.id, date);
        allCertifications.push(...certs);
      }

      return NextResponse.json(allCertifications);
    } else {
      // Current state - get all certifications
      const certifications = await prisma.certification.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return NextResponse.json(certifications);
    }
  } catch (error: any) {
    console.error('Get certifications error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get certifications' },
      { status: 500 }
    );
  }
}
