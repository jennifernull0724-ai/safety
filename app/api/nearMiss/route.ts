import { NextRequest, NextResponse } from 'next/server';
import { withEvidence } from '@/lib/withEvidence';
import { prisma } from '@/lib/prisma';

// POST /api/nearMiss - Create near-miss (regulated, org/role enforced)
export async function POST(req: NextRequest) {
  const data = await req.json();
  
  const result = await withEvidence({
    entityType: 'nearMiss',
    entityId: 'new',
    actorType: 'user',
    actorId: 'system',
    eventType: 'nearMiss.created',
    payload: data,
    action: async (tx) => {
      return tx.nearMiss.create({
        data,
      });
    }
  });
  return NextResponse.json({ nearMiss: result });
}

// PATCH /api/nearMiss/:id - Update near-miss (regulated, org/role enforced)
export async function PATCH(req: NextRequest) {
  const data = await req.json();
  
  const result = await withEvidence({
    entityType: 'nearMiss',
    entityId: data.id || 'unknown',
    actorType: 'user',
    actorId: 'system',
    eventType: 'nearMiss.updated',
    payload: data,
    action: async (tx) => {
      return tx.nearMiss.update({
        where: { id: data.id },
        data: data.update,
      });
    }
  });
  return NextResponse.json({ nearMiss: result });
}
