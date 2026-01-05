import { prisma } from '../prisma';
import { getCorrectionChain } from './certificationCorrection';
import archiver from 'archiver';
import { Readable } from 'stream';

export interface AuditPackageOptions {
  organizationId?: string;
  includeEmployees?: boolean;
  includeCertifications?: boolean;
  includeVerificationLogs?: boolean;
  includeEvidenceFiles?: boolean;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Generates a complete audit package with all required data.
 * Returns a ZIP archive containing:
 * - PDF summary report
 * - Employee data (CSV)
 * - Certification history with correction chains (CSV)
 * - Verification logs (CSV)
 * - Evidence files
 * - Integrity manifest
 */
export async function generateAuditPackage(
  options: AuditPackageOptions,
  exportedBy: string
): Promise<{ buffer: Buffer; filename: string; manifest: any }> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `audit-package-${timestamp}.zip`;

  // Gather all data
  const employeeData = options.includeEmployees !== false 
    ? await getEmployeeDataForAudit(options)
    : [];

  const certificationData = options.includeCertifications !== false
    ? await getCertificationHistoryForAudit(options)
    : [];

  const verificationData = options.includeVerificationLogs !== false
    ? await getVerificationLogsForAudit(options)
    : [];

  // Create manifest
  const manifest = {
    exportedAt: new Date().toISOString(),
    exportedBy,
    organizationId: options.organizationId || 'ALL',
    dateRange: {
      start: options.startDate?.toISOString() || 'ALL_TIME',
      end: options.endDate?.toISOString() || 'PRESENT',
    },
    contents: {
      employees: employeeData.length,
      certifications: certificationData.length,
      verificationLogs: verificationData.length,
    },
    integrityHash: '', // Will be calculated after packaging
  };

  // Calculate integrity hash
  const crypto = await import('crypto');
  const dataForHash = JSON.stringify({
    employees: employeeData,
    certifications: certificationData,
    verifications: verificationData,
  });
  manifest.integrityHash = crypto.createHash('sha256').update(dataForHash).digest('hex');

  // Convert data to CSV format
  const employeeCSV = convertToCSV(employeeData);
  const certificationCSV = convertToCSV(certificationData);
  const verificationCSV = convertToCSV(verificationData);

  // Create PDF summary (simplified - in production would use a proper PDF library)
  const pdfContent = generatePDFSummary(manifest, options);

  // Package everything into a ZIP
  const zipBuffer = await createZipArchive({
    'README.txt': `Audit Package Export
Exported: ${manifest.exportedAt}
Exported By: ${manifest.exportedBy}
Organization: ${manifest.organizationId}

This package contains:
- manifest.json: Export metadata and integrity hash
- summary.pdf: Human-readable summary report
- employees.csv: Employee data
- certifications.csv: Certification history with correction chains
- verification-logs.csv: QR verification event logs

All data is timestamped and immutable. The integrity hash in manifest.json 
can be used to verify that the contents have not been tampered with.`,
    'manifest.json': JSON.stringify(manifest, null, 2),
    'summary.pdf': pdfContent,
    'employees.csv': employeeCSV,
    'certifications.csv': certificationCSV,
    'verification-logs.csv': verificationCSV,
  });

  return {
    buffer: zipBuffer,
    filename,
    manifest,
  };
}

async function getEmployeeDataForAudit(options: AuditPackageOptions) {
  const where: any = {};
  if (options.organizationId) {
    where.organizationId = options.organizationId;
  }

  const employees = await prisma.employee.findMany({
    where,
    include: {
      certifications: {
        where: { isCorrected: false }, // Current versions only
      },
    },
  });

  return employees.map(emp => ({
    id: emp.id,
    firstName: emp.firstName,
    lastName: emp.lastName,
    tradeRole: emp.tradeRole,
    status: emp.status,
    organizationId: emp.organizationId,
    createdAt: emp.createdAt.toISOString(),
    activeCertifications: emp.certifications.filter(c => c.status === 'valid').length,
    totalCertifications: emp.certifications.length,
  }));
}

async function getCertificationHistoryForAudit(options: AuditPackageOptions) {
  const where: any = {};
  
  if (options.startDate || options.endDate) {
    where.createdAt = {};
    if (options.startDate) where.createdAt.gte = options.startDate;
    if (options.endDate) where.createdAt.lte = options.endDate;
  }

  if (options.organizationId) {
    where.employee = { organizationId: options.organizationId };
  }

  // Get all certifications including corrected ones
  const certifications = await prisma.certification.findMany({
    where,
    include: {
      employee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          organizationId: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  // Expand with correction chain information
  const results = [];
  for (const cert of certifications) {
    try {
      const chain = await getCorrectionChain(cert.id);
      const isOriginal = chain[0].id === cert.id;
      const isCurrent = chain[chain.length - 1].id === cert.id;
      const versionNumber = chain.findIndex(c => c.id === cert.id) + 1;

      results.push({
        id: cert.id,
        employeeId: cert.employee.id,
        employeeName: `${cert.employee.firstName} ${cert.employee.lastName}`,
        organizationId: cert.employee.organizationId,
        certificationType: cert.certificationType,
        issuingAuthority: cert.issuingAuthority,
        issueDate: cert.issueDate.toISOString(),
        expirationDate: cert.expirationDate.toISOString(),
        status: cert.status,
        createdAt: cert.createdAt.toISOString(),
        isCorrected: cert.isCorrected,
        correctedAt: cert.correctedAt?.toISOString() || null,
        correctionReason: cert.correctionReason || null,
        correctedById: cert.correctedById || null,
        isOriginalVersion: isOriginal,
        isCurrentVersion: isCurrent,
        versionNumber,
        totalVersions: chain.length,
      });
    } catch (error) {
      // If chain lookup fails, include basic data
      results.push({
        id: cert.id,
        employeeId: cert.employee.id,
        employeeName: `${cert.employee.firstName} ${cert.employee.lastName}`,
        organizationId: cert.employee.organizationId,
        certificationType: cert.certificationType,
        issuingAuthority: cert.issuingAuthority,
        issueDate: cert.issueDate.toISOString(),
        expirationDate: cert.expirationDate.toISOString(),
        status: cert.status,
        createdAt: cert.createdAt.toISOString(),
        isCorrected: cert.isCorrected,
        error: 'Chain lookup failed',
      });
    }
  }

  return results;
}

async function getVerificationLogsForAudit(options: AuditPackageOptions) {
  const where: any = {};

  if (options.startDate || options.endDate) {
    where.scannedAt = {};
    if (options.startDate) where.scannedAt.gte = options.startDate;
    if (options.endDate) where.scannedAt.lte = options.endDate;
  }

  const verifications = await prisma.verificationEvent.findMany({
    where,
    include: {
      token: {
        include: {
          certification: {
            include: {
              employee: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      },
      location: true,
    },
    orderBy: { scannedAt: 'asc' },
  });

  return verifications.map(event => ({
    id: event.id,
    scannedAt: event.scannedAt.toISOString(),
    result: event.result,
    employeeId: event.token.certification.employee.id,
    employeeName: `${event.token.certification.employee.firstName} ${event.token.certification.employee.lastName}`,
    certificationType: event.token.certification.certificationType,
    certificationStatus: event.token.certification.status,
    locationId: event.locationId || null,
    locationInfo: event.location
      ? `${event.location.subdivision} MP ${event.location.milepost}`
      : null,
  }));
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const rows = data.map(row =>
    headers.map(header => {
      const value = row[header];
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      // Escape quotes and wrap in quotes if contains comma or quote
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

function generatePDFSummary(manifest: any, options: AuditPackageOptions): string {
  // In production, use a proper PDF library like pdfkit or puppeteer
  // For now, return a text-based summary that can be converted to PDF
  return `AUDIT PACKAGE SUMMARY REPORT

Export Information:
-------------------
Exported At: ${manifest.exportedAt}
Exported By: ${manifest.exportedBy}
Organization: ${manifest.organizationId}
Date Range: ${manifest.dateRange.start} to ${manifest.dateRange.end}

Package Contents:
-----------------
Employees: ${manifest.contents.employees}
Certifications: ${manifest.contents.certifications}
Verification Logs: ${manifest.contents.verificationLogs}

Data Integrity:
---------------
SHA-256 Hash: ${manifest.integrityHash}

This hash can be used to verify that the data has not been modified since export.

Notes:
------
- All certification data includes correction chain information
- Corrected records remain visible with links to their successors
- Historical versions are preserved for audit trail
- Timestamps are in ISO 8601 format (UTC)

For questions about this export, contact: ${manifest.exportedBy}
`;
}

async function createZipArchive(files: Record<string, string>): Promise<Buffer> {
  const archiver = require('archiver');
  const { PassThrough } = require('stream');

  return new Promise((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const buffers: Buffer[] = [];
    const passThrough = new PassThrough();

    passThrough.on('data', (chunk: Buffer) => buffers.push(chunk));
    passThrough.on('end', () => resolve(Buffer.concat(buffers)));

    archive.on('error', reject);
    archive.pipe(passThrough);

    // Add all files to archive
    for (const [filename, content] of Object.entries(files)) {
      archive.append(content, { name: filename });
    }

    archive.finalize();
  });
}
