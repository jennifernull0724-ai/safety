-- P0 PRODUCTION HARDENING: Database role constraints
-- Evidence-bearing tables cannot be deleted by application role

-- Create restricted application role (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_user') THEN
    CREATE ROLE app_user NOINHERIT LOGIN;
  END IF;
END
$$;

-- Grant connection and schema access
GRANT CONNECT ON DATABASE safety_db TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;

-- Allow read/write but NO DELETE on evidence tables
GRANT SELECT, INSERT, UPDATE ON "EvidenceNode" TO app_user;
GRANT SELECT, INSERT, UPDATE ON "ImmutableEventLedger" TO app_user;
GRANT SELECT, INSERT, UPDATE ON "VerificationEvent" TO app_user;
GRANT SELECT, INSERT, UPDATE ON "Certification" TO app_user;

-- Explicitly revoke deletes (defensive)
REVOKE DELETE ON "EvidenceNode" FROM app_user;
REVOKE DELETE ON "ImmutableEventLedger" FROM app_user;
REVOKE DELETE ON "VerificationEvent" FROM app_user;
REVOKE DELETE ON "Certification" FROM app_user;

-- Grant full access to non-evidence tables
GRANT SELECT, INSERT, UPDATE, DELETE ON "Organization" TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON "User" TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON "Employee" TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON "Crew" TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON "CrewMember" TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON "VerificationToken" TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON "JobHazardAnalysis" TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON "JHAAcknowledgment" TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON "WorkWindow" TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON "FieldLog" TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON "Incident" TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON "IncidentEmployee" TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON "AuditCase" TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON "AuditEvidenceLink" TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON "Asset" TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON "InsurancePolicy" TO app_user;

-- Grant sequence usage (for auto-increment IDs)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO app_user;

-- Comment for audit trail
COMMENT ON ROLE app_user IS 'Restricted application role - cannot delete evidence-bearing records (EvidenceNode, ImmutableEventLedger, VerificationEvent, Certification)';
