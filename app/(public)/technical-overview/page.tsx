'use client';

import React from 'react';
import Link from 'next/link';
import { PublicLayout } from '@/components/PublicLayout';
import {
  Server,
  Database,
  Lock,
  Shield,
  Cloud,
  AlertTriangle,
  FileText,
  Users,
  Key,
  RefreshCw,
  Mail
} from 'lucide-react';

/**
 * TECHNICAL OVERVIEW PAGE
 * 
 * PURPOSE:
 * - Pre-sales technical disclosure for CIO, IT, Security, Architecture review
 * - Factual descriptions of system boundaries, integrations, infrastructure
 * - NO marketing language
 * - Honest disclosure of what exists vs. what is planned
 * 
 * SCOPE:
 * - Public access (no authentication required)
 * - NOT promotional — technical reference only
 */

export default function TechnicalOverview() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-slate-950 text-white">
        <main className="max-w-5xl mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-12 md:pb-20">
          {/* Header */}
          <section className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Technical Overview
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Pre-sales technical reference for IT, security, and architecture review. This document provides factual disclosure of system role, boundaries, integrations, infrastructure, and failure modes.
            </p>
          </section>

          {/* 1. System Role & Boundaries */}
          <section className="mb-12 p-6 rounded-lg bg-slate-900/50 border border-slate-700">
            <div className="flex items-start gap-3 mb-4">
              <Server className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">System Role & Boundaries</h2>
                <div className="space-y-4 text-slate-300">
                  <p>
                    T-REX AI OS is a <strong>system of verification and evidence record</strong>. It does not replace HRIS, Learning Management Systems (LMS), or physical access control systems.
                  </p>
                  <p>
                    <strong>Core Function:</strong> Records employee certification state and verification events. Preserves historical state (i.e., "what was true at the time of scan").
                  </p>
                  <div className="mt-4 p-4 bg-slate-800/50 rounded border border-slate-600">
                    <h3 className="font-semibold text-white mb-2">System Boundaries</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong>HRIS:</strong> Remains system of record for employment, hiring, termination</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong>LMS:</strong> Remains system of record for training delivery and completion</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong>T-REX AI OS:</strong> Records certification evidence, verification outcomes, and compliance state</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Data Entry & Ingestion */}
          <section className="mb-12 p-6 rounded-lg bg-slate-900/50 border border-slate-700">
            <div className="flex items-start gap-3 mb-4">
              <Database className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">How Data Enters the System</h2>
                <div className="space-y-4 text-slate-300">
                  <p>Certification data enters the system through the following mechanisms:</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold mt-1">✓</span>
                      <div>
                        <strong>Manual Entry:</strong> Authorized users (compliance staff, supervisors) manually enter certification records via authenticated dashboard
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold mt-1">✓</span>
                      <div>
                        <strong>Evidence Upload:</strong> Supporting documents (PDFs, images) uploaded via secure file storage (Google Cloud Storage)
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold mt-1">⧗</span>
                      <div>
                        <strong>Bulk CSV Import:</strong> Planned — not yet available in production
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold mt-1">⧗</span>
                      <div>
                        <strong>API Ingestion:</strong> Planned — backend API exists for internal use; public API documentation under development
                      </div>
                    </li>
                  </ul>
                  <div className="mt-4 p-4 bg-slate-800/50 rounded border border-slate-600">
                    <h3 className="font-semibold text-white mb-2">Data Integrity Rules</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>Employees do NOT have accounts and cannot self-edit records</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>Corrections are append-only (no overwrite)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>Original records are preserved in full audit history</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Integrations & APIs */}
          <section className="mb-12 p-6 rounded-lg bg-slate-900/50 border border-slate-700">
            <div className="flex items-start gap-3 mb-4">
              <RefreshCw className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">Integrations & APIs</h2>
                <div className="space-y-4 text-slate-300">
                  <p>
                    <strong>Current State:</strong> REST API exists for internal operations. Public-facing API documentation is in development.
                  </p>
                  <div className="mt-4 p-4 bg-slate-800/50 rounded border border-slate-600">
                    <h3 className="font-semibold text-white mb-2">API Capabilities (Planned for Public Release)</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong>Authentication:</strong> API key-based authentication (OAuth 2.0 planned)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong>Read Operations:</strong> Retrieve certification records, verification history, employee compliance state</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong>Write Operations:</strong> Create certification records, upload evidence (subject to role-based permissions)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong>Webhooks:</strong> Planned — event notifications for certification expiration, enforcement actions</span>
                      </li>
                    </ul>
                  </div>
                  <p className="text-sm mt-4">
                    <strong>Documentation Availability:</strong> API specifications available upon request for evaluation purposes. Contact technical sales for access.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Identity & Access Control */}
          <section className="mb-12 p-6 rounded-lg bg-slate-900/50 border border-slate-700">
            <div className="flex items-start gap-3 mb-4">
              <Key className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">Authentication & Access Control</h2>
                <div className="space-y-4 text-slate-300">
                  <div className="p-4 bg-slate-800/50 rounded border border-slate-600">
                    <h3 className="font-semibold text-white mb-2">User Account Model</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong>User Accounts:</strong> Issued to administrators, compliance staff, supervisors</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong>Employee Records:</strong> Employees are data entities, not user accounts (they do not log in)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong>Role-Based Access Control (RBAC):</strong> Granular permissions per role (admin, compliance, supervisor, read-only)</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded border border-slate-600">
                    <h3 className="font-semibold text-white mb-2">Regulator Access Model</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>Read-only regulator portal (no mutation paths)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>Time-limited session access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>Export capability for evidence packages (PDF/ZIP)</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded border border-slate-600">
                    <h3 className="font-semibold text-white mb-2">Authentication Features</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold mt-1">✓</span>
                        <span><strong>Multi-Factor Authentication (MFA):</strong> Supported (planned for enforcement)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold mt-1">⧗</span>
                        <span><strong>SSO (SAML/OIDC):</strong> Planned for enterprise tier</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Hosting & Infrastructure */}
          <section className="mb-12 p-6 rounded-lg bg-slate-900/50 border border-slate-700">
            <div className="flex items-start gap-3 mb-4">
              <Cloud className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">Hosting & Infrastructure</h2>
                <div className="space-y-4 text-slate-300">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-800/50 rounded border border-slate-600">
                      <h3 className="font-semibold text-white mb-2">Cloud Provider</h3>
                      <p className="text-sm">Amazon Web Services (AWS) — US East region</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded border border-slate-600">
                      <h3 className="font-semibold text-white mb-2">Database</h3>
                      <p className="text-sm">PostgreSQL (AWS RDS)</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded border border-slate-600">
                      <h3 className="font-semibold text-white mb-2">File Storage</h3>
                      <p className="text-sm">Google Cloud Storage (GCS) — evidence documents, certifications</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded border border-slate-600">
                      <h3 className="font-semibold text-white mb-2">Deployment Model</h3>
                      <p className="text-sm">Multi-tenant SaaS (single-tenant available for enterprise)</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded border border-slate-600">
                    <h3 className="font-semibold text-white mb-2">Data Residency</h3>
                    <p className="text-sm">
                      Primary data storage in US-based AWS regions. Customer data does not leave US infrastructure. Region-specific deployments available for enterprise customers with specific residency requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Data Retention & Ownership */}
          <section className="mb-12 p-6 rounded-lg bg-slate-900/50 border border-slate-700">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">Data Retention & Ownership</h2>
                <div className="space-y-4 text-slate-300">
                  <div className="p-4 bg-slate-800/50 rounded border border-slate-600">
                    <h3 className="font-semibold text-white mb-2">Data Ownership</h3>
                    <p className="text-sm">
                      <strong>Customer owns all data.</strong> T-REX AI OS acts as a custodian of customer records. All certification data, employee records, and uploaded evidence belong to the customer organization.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded border border-slate-600">
                    <h3 className="font-semibold text-white mb-2">Retention Policy</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>Certification records retained for duration of contract plus configurable retention period</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>Audit logs retained for 90 days minimum (configurable per customer policy)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>No silent deletion — all record changes create audit trail entries</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded border border-slate-600">
                    <h3 className="font-semibold text-white mb-2">Data Export</h3>
                    <p className="text-sm">
                      Customer data export available via:
                    </p>
                    <ul className="space-y-2 text-sm mt-2">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>Dashboard export (PDF, CSV)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>API-based export (planned)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>Full data export upon contract termination (standard clause in Terms of Service)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 7. Immutability & Corrections */}
          <section className="mb-12 p-6 rounded-lg bg-slate-900/50 border border-slate-700">
            <div className="flex items-start gap-3 mb-4">
              <Lock className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">Immutability Model</h2>
                <div className="space-y-4 text-slate-300">
                  <p>
                    The system implements an <strong>append-only architecture</strong> to preserve evidentiary integrity.
                  </p>
                  <div className="p-4 bg-slate-800/50 rounded border border-slate-600">
                    <h3 className="font-semibold text-white mb-2">How Corrections Work</h3>
                    <ol className="space-y-2 text-sm list-decimal list-inside">
                      <li>Corrections create new records referencing the prior record</li>
                      <li>Original evidence is never deleted or overwritten</li>
                      <li>Full historical timeline preserved (who, what, when for all changes)</li>
                      <li>Audit logs track correction events with user attribution</li>
                    </ol>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded border border-slate-600">
                    <h3 className="font-semibold text-white mb-2">Technical Implementation</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>Database-level delete operations disabled (<code className="text-xs bg-slate-900 px-1 py-0.5 rounded">DISABLE_DB_DELETES=true</code>)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>Soft delete middleware marks records as inactive rather than removing them</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>Cryptographic hashing used for evidence integrity verification</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 8. Reliability & Failure Modes */}
          <section className="mb-12 p-6 rounded-lg bg-slate-900/50 border border-slate-700">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">Reliability & Failure Modes</h2>
                <div className="space-y-4 text-slate-300">
                  <div className="p-4 bg-slate-800/50 rounded border border-slate-600">
                    <h3 className="font-semibold text-white mb-2">Fail-Closed Philosophy</h3>
                    <p className="text-sm mb-2">
                      System enforcement operates in <strong>fail-closed mode</strong> (<code className="text-xs bg-slate-900 px-1 py-0.5 rounded">FAIL_CLOSED_ENFORCEMENT=true</code>).
                    </p>
                    <p className="text-sm">
                      If verification services are unavailable, enforcement errs on the side of blocking access rather than allowing unverified operations.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded border border-slate-600">
                    <h3 className="font-semibold text-white mb-2">Service Degradation Behavior</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong>Database Unavailable:</strong> Read-only mode for public QR verification (cached state served); write operations rejected</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong>Storage Unavailable:</strong> Evidence uploads queued; verification continues using database state</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong>QR Verification Service Down:</strong> QR scans fail visibly (no silent fallback to "allow")</span>
                      </li>
                    </ul>
                  </div>
                  <p className="text-sm text-slate-400">
                    <strong>Note:</strong> Formal SLAs defined contractually per customer tier.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 9. Backup & Disaster Recovery */}
          <section className="mb-12 p-6 rounded-lg bg-slate-900/50 border border-slate-700">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">Business Continuity & Disaster Recovery</h2>
                <div className="space-y-4 text-slate-300">
                  <div className="p-4 bg-slate-800/50 rounded border border-slate-600">
                    <h3 className="font-semibold text-white mb-2">Backup Strategy</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>Database: Automated daily backups with point-in-time recovery (AWS RDS native backups)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>File Storage: Multi-region replication for evidence files (GCS geo-redundancy)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>Backup retention: 30 days standard, configurable per customer requirements</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded border border-slate-600">
                    <h3 className="font-semibold text-white mb-2">Recovery Objectives</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong>RPO (Recovery Point Objective):</strong> Defined contractually per tier (typically ≤ 24 hours)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong>RTO (Recovery Time Objective):</strong> Defined contractually per tier (typically ≤ 4 hours for critical services)</span>
                      </li>
                    </ul>
                  </div>
                  <p className="text-sm text-slate-400">
                    Disaster recovery testing conducted quarterly. Incident response and recovery procedures documented and maintained.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 10. Security Posture */}
          <section className="mb-12 p-6 rounded-lg bg-slate-900/50 border border-slate-700">
            <div className="flex items-start gap-3 mb-4">
              <Shield className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">Security Architecture</h2>
                <div className="space-y-4 text-slate-300">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-800/50 rounded border border-slate-600">
                      <h3 className="font-semibold text-white mb-2">Encryption</h3>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>At Rest: AES-256 (database and file storage)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>In Transit: TLS 1.3 for all API and web traffic</span>
                        </li>
                      </ul>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded border border-slate-600">
                      <h3 className="font-semibold text-white mb-2">Access Logging</h3>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>All user actions logged with timestamps</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>Audit trail for all data mutations</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded border border-slate-600">
                    <h3 className="font-semibold text-white mb-2">Vulnerability Management</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>Dependency scanning for known vulnerabilities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>Regular security patching of infrastructure and application dependencies</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>Penetration testing conducted annually (planned for production maturity)</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded border border-slate-600">
                    <h3 className="font-semibold text-white mb-2">Compliance & Certification</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold mt-1">⧗</span>
                        <span><strong>SOC 2 Type II:</strong> In progress — audit scheduled for Q2 2026</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span><strong>GDPR/Privacy:</strong> Privacy policy and data processing agreement available</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 11. Technical Contact */}
          <section className="mb-12 p-6 rounded-lg bg-blue-900/20 border-2 border-blue-500/50">
            <div className="flex items-start gap-3 mb-4">
              <Mail className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">Technical Review & Architecture Questions</h2>
                <div className="space-y-4 text-slate-300">
                  <p>
                    Pre-sales architecture review available for qualified prospects. Our solutions engineering team can provide:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Detailed integration consultation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>API documentation and sample code</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Security and compliance documentation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>Infrastructure architecture diagrams</span>
                    </li>
                  </ul>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/request-demo"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                    >
                      Request Technical Review
                    </Link>
                    <a
                      href="mailto:jennnull4@gmail.com?subject=Technical Architecture Review Request"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800/50 font-medium transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Email Solutions Engineering
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Navigation */}
          <section className="pt-8 border-t border-slate-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Link
                href="/"
                className="text-slate-400 hover:text-white transition-colors"
              >
                ← Back to Home
              </Link>
              <div className="flex flex-wrap gap-4 text-sm">
                <Link href="/pricing" className="text-slate-400 hover:text-white transition-colors">
                  Pricing
                </Link>
                <Link href="/terms" className="text-slate-400 hover:text-white transition-colors">
                  Terms
                </Link>
                <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">
                  Privacy
                </Link>
                <Link href="/security" className="text-slate-400 hover:text-white transition-colors">
                  Security
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </PublicLayout>
  );
}
