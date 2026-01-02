import prisma from '@/lib/prisma';

export default async function AIAdvisoryPage() {
  // Server-only: fetch AI insights (advisory only, no data rendered, placeholder)
  const insights = await prisma.aiInsight.findMany({ take: 10 });
  return null; // UI not rendered yet per checklist
}
