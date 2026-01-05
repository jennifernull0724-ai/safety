-- Migration: Add correction chain support to Certification model
-- This migration adds fields to track certification corrections while preserving the original records

-- Add correction chain fields to Certification table
ALTER TABLE "Certification" 
  ADD COLUMN "isCorrected" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "correctedById" TEXT,
  ADD COLUMN "correctionReason" TEXT,
  ADD COLUMN "correctedAt" TIMESTAMP(3),
  ADD COLUMN "correctedByUserId" TEXT;

-- Add foreign key constraint for correction chain
ALTER TABLE "Certification"
  ADD CONSTRAINT "Certification_correctedById_fkey" 
  FOREIGN KEY ("correctedById") 
  REFERENCES "Certification"("id") 
  ON DELETE RESTRICT 
  ON UPDATE CASCADE;

-- Create index for efficient correction chain queries
CREATE INDEX "Certification_correctedById_idx" ON "Certification"("correctedById");
CREATE INDEX "Certification_isCorrected_idx" ON "Certification"("isCorrected");

-- Note: This migration preserves all existing certification records.
-- No data is deleted or modified. The new fields enable tracking of corrections
-- while maintaining a complete audit trail of all certification versions.
