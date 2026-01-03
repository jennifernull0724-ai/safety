import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function withEvidence({ entityType, entityId, actorType, actorId, eventType, payload, action }) {
  return prisma.$transaction(async (tx) => {
    const result = await action(tx);

    const evidenceNode = await tx.evidenceNode.create({
      data: {
        entityType,
        entityId,
        actorType,
        actorId,
        locationId: null,
      },
    });

    await tx.immutableEventLedger.create({
      data: {
        evidenceNodeId: evidenceNode.id,
        eventType,
        payload,
      },
    });

    return result;
  });
}

async function generateEmployeeQrToken({ certificationId }) {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  const verificationToken = await prisma.verificationToken.create({
    data: {
      certificationId,
      tokenHash,
      status: 'active',
    },
  });

  return { rawToken, verificationToken };
}

async function seed() {
  console.log("🔄 Starting seed...");

  // 1️⃣ Create or get organization
  let organization = await prisma.organization.findFirst({
    where: { name: "IronPath Rail Services, LLC" },
  });

  if (!organization) {
    console.log("📦 Creating organization...");
    organization = await prisma.organization.create({
      data: {
        name: "IronPath Rail Services, LLC",
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
      firstName: "Alex",
      lastName: "Morgan",
      tradeRole: "Railroad Contractor",
      organizationId: organization.id,
      photoPath: "/mockcard.png",
    },
    action: async (tx) => {
      return tx.employee.create({
        data: {
          organizationId: organization.id,
          firstName: "Alex",
          lastName: "Morgan",
          tradeRole: "Railroad Contractor",
          status: "active",
        },
      });
    },
  });
  console.log(`✅ Employee created: ${employee.id}`);

  // 3️⃣ Issue Primary Certification (WITH EVIDENCE)
  console.log("📜 Issuing certification...");
  const certification = await withEvidence({
    entityType: "certification",
    entityId: "pending",
    actorType: "system",
    actorId: systemActorId,
    eventType: "CERTIFICATION_ISSUED",
    payload: {
      employeeId: employee.id,
      certificationType: "eRailSafe System Badge",
      issuingAuthority: "eRailSafe / Class I Railroads",
      issueDate: "2025-06-15",
      expirationDate: "2026-12-15",
    },
    action: async (tx) => {
      return tx.certification.create({
        data: {
          employeeId: employee.id,
          certificationType: "eRailSafe System Badge",
          issuingAuthority: "eRailSafe / Class I Railroads",
          issueDate: new Date("2025-06-15"),
          expirationDate: new Date("2026-12-15"),
          status: "valid",
          createdByUserId: systemActorId,
        },
      });
    },
  });
  console.log(`✅ Certification created: ${certification.id}`);

  // 4️⃣ Generate QR token (ONCE)
  console.log("🔑 Generating QR token...");
  const { rawToken, verificationToken } = await generateEmployeeQrToken({
    certificationId: certification.id,
  });
  console.log(`✅ QR Token generated: ${verificationToken.id}`);

  // 5️⃣ Verification
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
