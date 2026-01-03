import { NextRequest, NextResponse } from 'next/server';
import { writeEvidenceNode, appendLedgerEntry } from '../evidence';
import { AuthUser } from './auth';

// Middleware that automatically writes evidence for mutating operations
export async function withEvidenceWriter(
  req: NextRequest,
  user: AuthUser,
  entityType: string,
  entityId: string,
  eventType: string,
  handler: (req: NextRequest, user: AuthUser) => Promise<{ data: unknown; evidencePayload?: Record<string, unknown> }>
): Promise<NextResponse> {
  try {
    const result = await handler(req, user);
    
    // Write evidence node
    const evidenceNode = await writeEvidenceNode({
      entityType,
      entityId,
      actorType: 'user',
      actorId: user.id,
    });

    // Append ledger entry with event details
    await appendLedgerEntry({
      evidenceNodeId: evidenceNode.id,
      eventType,
      payload: result.evidencePayload || {},
    });

    return NextResponse.json({
      ...result.data as object,
      evidenceNodeId: evidenceNode.id,
    });
  } catch (error) {
    // Write failure evidence
    const failureEvidence = await writeEvidenceNode({
      entityType,
      entityId: entityId || 'unknown',
      actorType: 'user',
      actorId: user.id,
    });

    await appendLedgerEntry({
      evidenceNodeId: failureEvidence.id,
      eventType: `${eventType}_failed`,
      payload: { error: error instanceof Error ? error.message : 'Unknown error' },
    });

    throw error;
  }
}

// Higher-order function to wrap API handlers with automatic evidence writing
export function evidenceWriterMiddleware(
  entityType: string,
  getEntityId: (req: NextRequest, result: unknown) => string,
  eventType: string
) {
  return (handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>) => {
    return async (req: NextRequest, user: AuthUser): Promise<NextResponse> => {
      const response = await handler(req, user);
      const responseData = await response.clone().json();

      // Only write evidence for successful mutations
      if (response.status >= 200 && response.status < 300 && req.method !== 'GET') {
        const entityId = getEntityId(req, responseData);
        
        const evidenceNode = await writeEvidenceNode({
          entityType,
          entityId,
          actorType: 'user',
          actorId: user.id,
        });

        await appendLedgerEntry({
          evidenceNodeId: evidenceNode.id,
          eventType,
          payload: { method: req.method, url: req.url },
        });
      }

      return response;
    };
  };
}
