-- DropIndex
DROP INDEX "idx_audit_evidence_link";

-- DropIndex
DROP INDEX "idx_cert_employee_status";

-- DropIndex
DROP INDEX "idx_evidence_entity";

-- DropIndex
DROP INDEX "idx_ledger_created_at";

-- DropIndex
DROP INDEX "idx_incident_org_occurred";

-- DropIndex
DROP INDEX "idx_jha_ack_jha_employee";

-- DropIndex
DROP INDEX "idx_verification_events";

-- DropIndex
DROP INDEX "idx_qr_token";

-- DropIndex
DROP INDEX "idx_work_window_time";

-- CreateTable
CREATE TABLE "AIInsight" (
    "id" TEXT NOT NULL,
    "insightType" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "evidenceIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AISuggestion" (
    "id" TEXT NOT NULL,
    "suggestionType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "relatedEntity" TEXT NOT NULL,
    "relatedEntityId" TEXT NOT NULL,
    "evidenceIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AISuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIInsight_insightType_idx" ON "AIInsight"("insightType");

-- CreateIndex
CREATE INDEX "AIInsight_createdAt_idx" ON "AIInsight"("createdAt");

-- CreateIndex
CREATE INDEX "AISuggestion_suggestionType_idx" ON "AISuggestion"("suggestionType");

-- CreateIndex
CREATE INDEX "AISuggestion_relatedEntity_relatedEntityId_idx" ON "AISuggestion"("relatedEntity", "relatedEntityId");

-- CreateIndex
CREATE INDEX "AISuggestion_createdAt_idx" ON "AISuggestion"("createdAt");
