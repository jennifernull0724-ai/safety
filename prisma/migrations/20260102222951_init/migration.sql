-- CreateEnum
CREATE TYPE "OrgType" AS ENUM ('railroad', 'contractor', 'emergency', 'municipality');

-- CreateEnum
CREATE TYPE "OrgStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'safety', 'dispatcher', 'supervisor', 'executive');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'disabled');

-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "CertificationStatus" AS ENUM ('valid', 'expiring', 'expired', 'revoked');

-- CreateEnum
CREATE TYPE "TokenStatus" AS ENUM ('active', 'revoked');

-- CreateEnum
CREATE TYPE "VerificationResult" AS ENUM ('valid', 'expired', 'revoked');

-- CreateEnum
CREATE TYPE "ActorType" AS ENUM ('user', 'employee', 'system');

-- CreateEnum
CREATE TYPE "JHAStatus" AS ENUM ('draft', 'active', 'closed');

-- CreateEnum
CREATE TYPE "AuditType" AS ENUM ('FRA', 'OSHA', 'internal');

-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('open', 'closed');

-- CreateEnum
CREATE TYPE "WorkWindowStatus" AS ENUM ('approved', 'denied', 'overrun');

-- CreateEnum
CREATE TYPE "CostType" AS ENUM ('labor', 'equipment', 'material');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "OrgType" NOT NULL,
    "status" "OrgStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "tradeRole" TEXT NOT NULL,
    "photoMediaId" TEXT,
    "status" "EmployeeStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Crew" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Crew_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrewMember" (
    "crewId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,

    CONSTRAINT "CrewMember_pkey" PRIMARY KEY ("crewId","employeeId")
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "certificationType" TEXT NOT NULL,
    "issuingAuthority" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "status" "CertificationStatus" NOT NULL,
    "certificateMediaId" TEXT,
    "createdByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" TEXT NOT NULL,
    "certificationId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "status" "TokenStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationEvent" (
    "id" TEXT NOT NULL,
    "verificationTokenId" TEXT NOT NULL,
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locationId" TEXT,
    "result" "VerificationResult" NOT NULL,

    CONSTRAINT "VerificationEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenceNode" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "actorType" "ActorType" NOT NULL,
    "actorId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locationId" TEXT,

    CONSTRAINT "EvidenceNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImmutableEventLedger" (
    "id" TEXT NOT NULL,
    "evidenceNodeId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImmutableEventLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobHazardAnalysis" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "workType" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "weather" JSONB NOT NULL,
    "status" "JHAStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobHazardAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JHAAcknowledgment" (
    "jhaId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "acknowledgedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JHAAcknowledgment_pkey" PRIMARY KEY ("jhaId","employeeId")
);

-- CreateTable
CREATE TABLE "AuditCase" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "auditType" "AuditType" NOT NULL,
    "status" "AuditStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvidenceLink" (
    "auditCaseId" TEXT NOT NULL,
    "evidenceNodeId" TEXT NOT NULL,

    CONSTRAINT "AuditEvidenceLink_pkey" PRIMARY KEY ("auditCaseId","evidenceNodeId")
);

-- CreateTable
CREATE TABLE "WorkWindow" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" "WorkWindowStatus" NOT NULL,

    CONSTRAINT "WorkWindow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldLog" (
    "id" TEXT NOT NULL,
    "workWindowId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "weather" JSONB NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FieldLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "incidentType" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "severity" TEXT NOT NULL,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentEmployee" (
    "incidentId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,

    CONSTRAINT "IncidentEmployee_pkey" PRIMARY KEY ("incidentId","employeeId")
);

-- CreateTable
CREATE TABLE "IncidentCost" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "costType" "CostType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IncidentCost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "assetType" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DamageReport" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mediaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DamageReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnvironmentalRecord" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "spillType" TEXT NOT NULL,
    "reportedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnvironmentalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsurancePolicy" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "policyNumber" TEXT NOT NULL,
    "coverageType" TEXT NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsurancePolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegulatorSession" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "regulatorName" TEXT NOT NULL,
    "accessStart" TIMESTAMP(3) NOT NULL,
    "accessEnd" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegulatorSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "subdivision" TEXT NOT NULL,
    "milepost" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_tokenHash_key" ON "VerificationToken"("tokenHash");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Crew" ADD CONSTRAINT "Crew_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewMember" ADD CONSTRAINT "CrewMember_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewMember" ADD CONSTRAINT "CrewMember_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationToken" ADD CONSTRAINT "VerificationToken_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "Certification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationEvent" ADD CONSTRAINT "VerificationEvent_verificationTokenId_fkey" FOREIGN KEY ("verificationTokenId") REFERENCES "VerificationToken"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationEvent" ADD CONSTRAINT "VerificationEvent_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImmutableEventLedger" ADD CONSTRAINT "ImmutableEventLedger_evidenceNodeId_fkey" FOREIGN KEY ("evidenceNodeId") REFERENCES "EvidenceNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JHAAcknowledgment" ADD CONSTRAINT "JHAAcknowledgment_jhaId_fkey" FOREIGN KEY ("jhaId") REFERENCES "JobHazardAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JHAAcknowledgment" ADD CONSTRAINT "JHAAcknowledgment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditCase" ADD CONSTRAINT "AuditCase_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvidenceLink" ADD CONSTRAINT "AuditEvidenceLink_auditCaseId_fkey" FOREIGN KEY ("auditCaseId") REFERENCES "AuditCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvidenceLink" ADD CONSTRAINT "AuditEvidenceLink_evidenceNodeId_fkey" FOREIGN KEY ("evidenceNodeId") REFERENCES "EvidenceNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldLog" ADD CONSTRAINT "FieldLog_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentEmployee" ADD CONSTRAINT "IncidentEmployee_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentEmployee" ADD CONSTRAINT "IncidentEmployee_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentCost" ADD CONSTRAINT "IncidentCost_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsurancePolicy" ADD CONSTRAINT "InsurancePolicy_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
