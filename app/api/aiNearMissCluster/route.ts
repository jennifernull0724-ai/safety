import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateNearMissClusterRisk } from '@/lib/ai/risk-engine';

// GET /api/aiNearMissCluster - Get AI near-miss clusters (advisory only)
export async function GET(req: NextRequest) {
  // NOTE: nearMiss model not yet implemented in schema
  // Return empty advisory response until model is added
  const nearMisses: any[] = [];

  // Group by category for clustering
  const categories = nearMisses.reduce((acc, nm) => {
    const cat = nm.category || 'UNCATEGORIZED';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(nm);
    return acc;
  }, {} as Record<string, any[]>);

  const clusters = Object.entries(categories).map(([category, items]) => {
    const itemsArray = items as any[];
    return {
      category,
      count: itemsArray.length,
      items: itemsArray.slice(0, 5),
      aiAdvisory: 'This is an AI-generated advisory insight. It does not block operations.',
    };
  });

  return NextResponse.json({ 
    clusters,
    isAdvisoryOnly: true,
    disclaimer: 'AI insights are advisory only and do not affect system enforcement',
  });
}
