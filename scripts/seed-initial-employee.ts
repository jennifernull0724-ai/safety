import { prisma } from "../lib/prisma.js";
import { withEvidence } from "../lib/withEvidence.js";
import { generateEmployeeQrToken } from "../lib/qrToken.js";
import { getRequiredCertifications } from "../lib/compliancePresets.js";

async function seed() {
  console.log("🔄 Starting seed...");

  // 1️⃣ Create or get organization
  let organization = await prisma.organization.findFirst({
    where: { name: "System of Proof" },
  });

  if (!organization) {
    console.log("📦 Creating organization...");
    organization = await prisma.organization.create({
      data: {
        name: "System of Proof",
        type: "contractor",
        status: "active",
      },
    });
    console.log(`✅ Organization created: ${organization.id}`);
  } else {
    console.log(`✅ Organization exists: ${organization.id}`);
  }

  const systemActorId = "system-bootstrap";

  // 2️⃣ Create Employee (WITH EVIDENCE)
  console.log("👤 Creating employee...");
  const employee = await withEvidence({
    entityType: "employee",
    entityId: "pending",
    actorType: "system",
    actorId: systemActorId,
    eventType: "EMPLOYEE_CREATED",
    payload: {
      firstName: "Jennifer",
      lastName: "Null",
      tradeRole: "Safety Supervisor",
      organizationId: organization.id,
    },
    action: async (tx) => {
      return tx.employee.create({
        data: {
          organizationId: organization.id,
          firstName: "Jennifer",
          lastName: "Null",
          tradeRole: "Safety Supervisor",
          status: "active",
        },
      });
    },
  });
  console.log(`✅ Employee created: ${employee.id}`);

  // 3️⃣ Generate QR token (ONCE)
  console.log("🔑 Generating QR token...");
  const { rawToken, verificationToken } = await generateEmployeeQrToken({
    employeeId: employee.id,
  });
  console.log(`✅ QR Token generated: ${verificationToken.id}`);
  console.log(`📱 Raw token (for testing): ${rawToken}`);

  // 4️⃣ Issue Primary Certification (WITH EVIDENCE)
  console.log("📜 Issuing certification...");
  const certification = await withEvidence({
    entityType: "certification",
    entityId: "pending",
    actorType: "system",
    actorId: systemActorId,
    eventType: "CERTIFICATION_ISSUED",
    payload: {
      employeeId: employee.id,
      certificationType: "Railroad Safety & Access",
      issuingAuthority: "FRA",
    },
    action: async (tx) => {
      return tx.certification.create({
        data: {
          employeeId: employee.id,
          presetCategory: "SAFETY_CORE",
          certificationType: "Railroad Safety & Access",
          issuingAuthority: "FRA",
          issueDate: new Date("2025-01-01"),
          expirationDate: new Date("2026-01-01"),
          isNonExpiring: false,
          status: "PASS",
          createdByUserId: null,
        },
      });
    },
  });
  console.log(`✅ Certification created: ${certification.id}`);

  // 5️⃣ Instantiate all required certifications (INCOMPLETE state)
  console.log("📋 Creating remaining certification records...");
  const presets = getRequiredCertifications();
  let createdCount = 0;

  for (const preset of presets) {
    // Skip the one we already created
    if (preset.name === "Railroad Safety & Access") continue;

    await prisma.certification.create({
      data: {
        employeeId: employee.id,
        presetCategory: preset.category,
        certificationType: preset.name,
        issuingAuthority: preset.issuingAuthority || null,
        issueDate: null,
        expirationDate: null,
        isNonExpiring: !preset.requiresExpiration,
        status: "INCOMPLETE",
        createdByUserId: null,
      },
    });
    createdCount++;
  }
  console.log(`✅ Created ${createdCount} additional certification records`);

  // 6️⃣ Verification
  console.log("\n📊 Verification:");
  const evidenceCount = await prisma.evidenceNode.count();
  const ledgerCount = await prisma.immutableEventLedger.count();
  const certCount = await prisma.certification.count();

  console.log({
    employeeId: employee.id,
    employeeName: `${employee.firstName} ${employee.lastName}`,
    certificationId: certification.id,
    qrTokenId: verificationToken.id,
    rawToken: rawToken.substring(0, 20) + "...",
    evidenceNodes: evidenceCount,
    ledgerEntries: ledgerCount,
    totalCertifications: certCount,
  });

  console.log("\n✅ SEED COMPLETE");
  console.log(`\n🔗 Test URLs:`);
  console.log(`   Employee Directory: http://localhost:3000/employee-directory`);
  console.log(`   Employee QR: http://localhost:3000/employees/${employee.id}/qr`);
  console.log(`   Public Verify: http://localhost:3000/verify/employee/${rawToken}`);
  console.log(`   Audit Ledger: http://localhost:3000/audit-vault`);
}

seed()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
