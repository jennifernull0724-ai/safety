import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { appendLedgerEntry, writeEvidenceNode } from '@/lib/evidence';

// POST /api/regulator/sessions - Create regulator session
export async function POST(req: NextRequest) {
  const data = await req.json();
  
  // Log session creation as evidence
  const evidence = await writeEvidenceNode({
    entityType: 'RegulatorSession',
    entityId: 'pending',
    actorType: 'regulator',
    actorId: data.regulatorId,
  });
  await appendLedgerEntry({
    evidenceNodeId: evidence.id,
    eventType: 'regulator_session_created',
    payload: { regulatorId: data.regulatorId, purpose: data.purpose },
  });

  return NextResponse.json({
    sessionId: evidence.id,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * (parseInt(process.env.REGULATOR_SESSION_TTL_MINUTES || '60'))).toISOString(),
  }, { status: 201 });
}
