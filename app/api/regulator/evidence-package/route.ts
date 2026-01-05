import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/regulator/evidence-package
 * 
 * Generates evidence package for an employee
 * Returns JSON with all compliance data for client-side generation
 * READ-ONLY - Public regulator access
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { employeeId, startDate, endDate, contents } = body;

    if (!employeeId) {
      return NextResponse.json(
        { error: 'Employee ID required' },
        { status: 400 }
      );
    }

    // Find employee with all related data
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        organization: true,
        certifications: {
          where: startDate && endDate ? {
            createdAt: {
              gte: new Date(startDate),
              lte: new Date(endDate)
            }
          } : undefined,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Get verification events (QR scans)
    const verificationEvents = contents.verificationLogs ? await prisma.verificationEvent.findMany({
      where: {
        token: {
          certification: {
            employeeId
          }
        },
        scannedAt: startDate && endDate ? {
          gte: new Date(startDate),
          lte: new Date(endDate)
        } : undefined
      },
      include: {
        token: {
          include: {
            certification: true
          }
        },
        location: true
      },
      orderBy: { scannedAt: 'desc' }
    }) : [];

    // Get audit trail (evidence nodes)
    const auditTrail = contents.auditTrail ? await prisma.evidenceNode.findMany({
      where: {
        OR: [
          { entityType: 'Employee', entityId: employeeId },
          {
            entityType: 'Certification',
            entityId: {
              in: employee.certifications.map(c => c.id)
            }
          }
        ],
        timestamp: startDate && endDate ? {
          gte: new Date(startDate),
          lte: new Date(endDate)
        } : undefined
      },
      include: {
        ImmutableEventLedger: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { timestamp: 'desc' }
    }) : [];

    // Log evidence package generation
    await prisma.evidenceNode.create({
      data: {
        entityType: 'EvidencePackageGenerated',
        entityId: employeeId,
        actorType: 'regulator',
        actorId: 'evidence_package_request',
      }
    });

    return NextResponse.json({
      employee: {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        tradeRole: employee.tradeRole,
        status: employee.status,
        organizationName: employee.organization.name
      },
      certifications: employee.certifications.map(cert => ({
        id: cert.id,
        type: cert.certificationType,
        issuingAuthority: cert.issuingAuthority,
        issueDate: cert.issueDate,
        expirationDate: cert.expirationDate,
        status: cert.status,
        isNonExpiring: cert.isNonExpiring
      })),
      verificationEvents: verificationEvents.map(event => ({
        id: event.id,
        scannedAt: event.scannedAt,
        result: event.result,
        location: event.location?.name || 'Unknown',
        certificationType: event.token.certification.certificationType
      })),
      auditTrail: auditTrail.map(node => ({
        id: node.id,
        timestamp: node.timestamp,
        entityType: node.entityType,
        actorType: node.actorType,
        actorId: node.actorId,
        events: node.ImmutableEventLedger.map(ledger => ({
          eventType: ledger.eventType,
          createdAt: ledger.createdAt,
          payload: ledger.payload
        }))
      })),
      generatedAt: new Date().toISOString(),
      dateRange: { startDate, endDate }
    });

  } catch (error) {
    console.error('Failed to generate evidence package:', error);
    return NextResponse.json(
      { error: 'Failed to generate evidence package' },
      { status: 500 }
    );
  }
}
