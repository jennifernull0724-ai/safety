// prisma/middleware/hardLocks.ts
// Enforces append-only and no-delete rules for EvidenceNode and ImmutableEventLedger


export function hardLocksMiddleware() {
  return async (params: any, next: (params: any) => Promise<any>) => {
    // Block DELETE and UPDATE for append-only tables
    const appendOnlyModels = ['EvidenceNode', 'ImmutableEventLedger'];
    if (
      appendOnlyModels.includes(params.model || '') &&
      (params.action === 'delete' || params.action === 'deleteMany' || params.action === 'update' || params.action === 'updateMany')
    ) {
      throw new Error(`Operation ${params.action} is not allowed on append-only model ${params.model}`);
    }
    return next(params);
  };
}
