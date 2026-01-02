UNIFIED SYSTEM OF PROOF
COMPLETE PLATFORM / SITE OVERVIEW TREE

(Employee-Anchored • QR-Verified • Audit-Defensible)

0. PLATFORM CORE (INVISIBLE, ALWAYS ON)
0.1 Evidence Graph (GLOBAL SPINE)

All records attach to the Evidence Graph via:

event_id

timestamp

actor_id (user, employee, system)

location_id

asset_id (optional)

risk_context_id (optional)

QR scans, certifications, expirations, revocations, audits, incidents — everything writes here.

0.2 Immutable Event Ledger

Append-only

Cryptographically timestamped

Versioned corrections only (no silent edits)

Feeds:

Audit Defense

Legal Defense

Regulator Portal

Insurance & Claims

0.3 Identity, Roles & Authority

Objects

Organization

User (admin, safety, dispatcher, supervisor, executive)

Employee (field personnel — NOT a user)

Crew

Regulator (external, read-only)

Hard rule:

Employees never log in

Employees are verified, not authenticated

1. PEOPLE & WORKFORCE (ANCHOR DOMAIN)
1.1 Employee Directory (ANCHOR)

Path: /people/employees

Employee Profile Contains

Identity (name, photo, trade)

Employer

Crew assignments

Status (active / inactive)

Work history

Incident involvement

Links To

Certifications (QR)

JHAs

Field Logs

Work Windows

Incidents

Audit Defense

1.2 Employee Certifications & QR Verification

Path: /people/employees/{employeeId}/certifications

Certification Records

Certification type

Issuing authority

Issue date

Expiration date

Status:

Valid

Expiring

Expired

Revoked

Certificate photo (evidence)

QR Code (Per Certification)

Always active

Resolves to verification endpoint

Shows current status at scan time

Logs every scan as evidence

Employee Profile Shows

✅ Valid certs

⚠️ Expiring certs

❌ Expired certs

⛔ Revoked certs

QR for each cert

Links To

JHA eligibility

Dispatch eligibility

Work window enforcement

Incident verification

Audit Defense Vault

1.3 Certification Enforcement & Expiration Engine

Path: /people/certifications/enforcement

Expiration thresholds

Alerting

Auto-blocking of assignments

Audit logging of enforcement actions

1.4 Fatigue & Hours-of-Service Monitoring

Path: /people/fatigue

Work hour aggregation

Risk scoring (non-payroll)

Supervisor alerts

Incident linkage

1.5 Incident-Triggered Drug & Alcohol Testing

Path: /people/testing

Trigger rules

Chain-of-custody

Vendor coordination

Compliance confirmation

2. SAFETY, RISK & COMPLIANCE
2.1 Job Hazard Analysis (JHA)

Path: /safety/jha

JHA Includes

Work type template

Dynamic hazards (location, weather, time)

Required employee certifications

Crew acknowledgment

Hard Enforcement

Employees without valid certs cannot be acknowledged

Links To

Employee profiles

Certifications (QR-verified)

Work windows

Field logs

Audit Defense

2.2 Near-Miss & Safety Observations

Path: /safety/observations

Anonymous or named

Photo + GPS + timestamp

Risk categorization

Links To

Employees (if known)

Locations

JHAs

Evidence Graph

2.3 Audit Defense Vault

Path: /compliance/audit-vault

Audit Case Can Pull

Employee profiles

Certification history

QR scan logs

JHAs

Field logs

Incidents

Enforcement actions

Outputs

Timeline replay

One-click FRA / OSHA packages

3. FIELD EXECUTION & AUTHORITY
3.1 Work Window & Track Time Management

Path: /operations/work-windows

Requests

Approvals

Conflict detection

Overrun tracking

Links To

JHAs

Employee eligibility

Certification validity

Field logs

Audit Defense

3.2 Mobile Daily Field Logs

Path: /operations/field-logs

Structured logs

Weather auto-capture

Crew & equipment roll-up

Photo evidence

Immutable timestamps

Links To

Employees

Work windows

JHAs

Incidents

3.3 Subdivision / Milepost Authority Manager

Path: /operations/authority

Authority boundaries

Active authorities

Proximity alerts

Violation replay

Links To

Employees

Certifications

Incidents

Audit Defense

4. INCIDENT & EMERGENCY OPERATIONS
4.1 Incident Management

Path: /incidents

Incident record

Timeline

Impact zones

Personnel involved

Links To

Employee profiles

Certification state at incident time

QR scans performed

Drug & alcohol workflow

Cost recovery

4.2 Emergency Pre-Plans

Path: /emergency/preplans

GIS rail layouts

Hazmat zones

Offline access

Dispatch packets

4.3 Emergency Contractor Mobilization

Path: /emergency/mobilization

Responder capability profiles

Availability

Callout acknowledgments

Links To

Employee certifications

QR verification logs

4.4 Incident Cost Recovery & Claims

Path: /incidents/costs

Labor

Equipment

Materials

Claim packages

5. ASSETS, ENVIRONMENTAL & DAMAGE
5.1 Right-of-Way Damage Tracking

Path: /assets/damage

Damage reports

Photo evidence

Repair tracking

5.2 Environmental Monitoring & Spill Readiness

Path: /environment/environmental

Risk profiles

Spill kits

Response timelines

Regulatory exports

5.3 Heavy Lift & Crane Planning

Path: /assets/lift-plans

Lift plans

Load calculations

Approvals

Execution evidence

6. DATA, INTELLIGENCE & DEFENSE
6.1 Vendor Performance Intelligence

Path: /intelligence/vendors

Safety metrics

Incident history

Performance scoring

6.2 Project Close-Out & Legal Defense

Path: /defense/projects

Immutable project archives

Evidence indexes

Litigation exports

6.3 Insurance Exposure Tracking

Path: /insurance/exposure

Policy mapping

Exposure modeling

Certification lapse risk

7. REGULATOR & EXTERNAL ACCESS
7.1 Regulator Transparency Portal (Opt-In)

Path: /regulator

Read-only access

Time-boxed sessions

QR verification viewing

Full access logging

8. SYSTEM-WIDE RULES (HARD)

Employees are the field truth anchor

Certifications live under employees

QR codes are always active

Expired ≠ deleted

Every scan is evidence

Nothing bypasses the Evidence Graph

FINAL STATEMENT

This structure creates:

A single, defensible system of record

Real-time field verification via QR

Historical truth preservation

Audit, legal, and regulatory readiness

This is not a CRM.
This is an operational truth platform.



