-- CreateEnum
CREATE TYPE "UsageMetricType" AS ENUM ('qr_scans_daily', 'ai_events_annual', 'employee_days_annual', 'incidents_annual');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('new', 'contacted', 'qualified', 'demo_scheduled', 'closed_won', 'closed_lost');

-- DropIndex
DROP INDEX "Certification_correctedById_idx";

-- DropIndex
DROP INDEX "Certification_isCorrected_idx";

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "contractTermYears" INTEGER DEFAULT 1,
ADD COLUMN     "employeeCountAtRenewal" INTEGER,
ADD COLUMN     "gracePeriodEndsAt" TIMESTAMP(3),
ADD COLUMN     "isReadOnlyMode" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastRenewalPrice" DOUBLE PRECISION,
ADD COLUMN     "lockedDiscountRate" DOUBLE PRECISION,
ADD COLUMN     "slaCreditsOwed" DOUBLE PRECISION DEFAULT 0;

-- CreateTable
CREATE TABLE "ContactSubmission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "message" TEXT NOT NULL,
    "organizationId" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'new',
    "assignedTo" TEXT,

    CONSTRAINT "ContactSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemoRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT,
    "employeeCount" TEXT,
    "notes" TEXT,
    "organizationId" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'new',

    CONSTRAINT "DemoRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UptimeMetric" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "uptimePercent" DOUBLE PRECISION NOT NULL,
    "downtimeMinutes" INTEGER NOT NULL,
    "slaCreditsEarned" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UptimeMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageMetric" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "metricType" "UsageMetricType" NOT NULL,
    "count" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "exceededThreshold" BOOLEAN NOT NULL DEFAULT false,
    "flaggedAt" TIMESTAMP(3),
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContactSubmission_status_idx" ON "ContactSubmission"("status");

-- CreateIndex
CREATE INDEX "ContactSubmission_submittedAt_idx" ON "ContactSubmission"("submittedAt");

-- CreateIndex
CREATE INDEX "DemoRequest_status_idx" ON "DemoRequest"("status");

-- CreateIndex
CREATE INDEX "DemoRequest_submittedAt_idx" ON "DemoRequest"("submittedAt");

-- CreateIndex
CREATE INDEX "UptimeMetric_month_idx" ON "UptimeMetric"("month");

-- CreateIndex
CREATE UNIQUE INDEX "UptimeMetric_organizationId_month_key" ON "UptimeMetric"("organizationId", "month");

-- CreateIndex
CREATE INDEX "UsageMetric_metricType_period_idx" ON "UsageMetric"("metricType", "period");

-- CreateIndex
CREATE UNIQUE INDEX "UsageMetric_organizationId_metricType_period_key" ON "UsageMetric"("organizationId", "metricType", "period");

-- AddForeignKey
ALTER TABLE "UptimeMetric" ADD CONSTRAINT "UptimeMetric_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageMetric" ADD CONSTRAINT "UsageMetric_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
