-- CRITICAL PERFORMANCE INDEXES (NON-OPTIONAL)
-- 
-- These indexes are required for production performance and audit queries.
-- Without these, the system will be slow and may fail under regulatory load.

-- Index: Certification queries filtered by employee and status
-- Usage: Employee eligibility checks, compliance dashboards
CREATE INDEX IF NOT EXISTS "idx_cert_employee_status" 
  ON "Certification"("employeeId", "status");

-- Index: QR token lookups (public endpoint, high traffic)
-- Usage: Public QR verification page (/api/verify/{token})
CREATE INDEX IF NOT EXISTS "idx_qr_token" 
  ON "VerificationToken"("tokenHash");

-- Index: Verification event history per token
-- Usage: Audit trail, scan frequency analysis
CREATE INDEX IF NOT EXISTS "idx_verification_events" 
  ON "VerificationEvent"("verificationTokenId", "scannedAt");

-- Index: Evidence node queries by entity
-- Usage: Evidence aggregation, audit timeline building
CREATE INDEX IF NOT EXISTS "idx_evidence_entity" 
  ON "EvidenceNode"("entityType", "entityId");

-- Index: Ledger chronological queries
-- Usage: Evidence timeline, audit export
CREATE INDEX IF NOT EXISTS "idx_ledger_created_at" 
  ON "ImmutableEventLedger"("createdAt");

-- Index: JHA acknowledgments by JHA
-- Usage: JHA status page, compliance verification
CREATE INDEX IF NOT EXISTS "idx_jha_ack_jha_employee" 
  ON "JHAAcknowledgment"("jhaId", "employeeId");

-- Index: Work window queries by time range
-- Usage: Dispatch dashboard, crew scheduling
CREATE INDEX IF NOT EXISTS "idx_work_window_time" 
  ON "WorkWindow"("startTime", "endTime");

-- Index: Incident queries by organization and time
-- Usage: Executive dashboard, trend analysis
CREATE INDEX IF NOT EXISTS "idx_incident_org_occurred" 
  ON "Incident"("organizationId", "occurredAt");

-- Index: Audit case evidence links
-- Usage: Audit vault, regulator evidence view
CREATE INDEX IF NOT EXISTS "idx_audit_evidence_link" 
  ON "AuditEvidenceLink"("auditCaseId", "evidenceNodeId");

-- COMPOSITE INDEX for employee certification expiration checks
-- Usage: Certification expiration background job
CREATE INDEX IF NOT EXISTS "idx_cert_expiration_status" 
  ON "Certification"("expirationDate", "status")
  WHERE "status" IN ('valid', 'expiring');

