import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/support/submissions
 * Returns all support submissions (contact + demo requests)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // 'contact' | 'demo' | null (all)

    const submissions = [];

    if (!type || type === 'contact') {
      const contacts = await prisma.contactSubmission.findMany({
        orderBy: { submittedAt: 'desc' },
        take: 50,
      });
      submissions.push(...contacts.map(c => ({
        ...c,
        type: 'contact',
      })));
    }

    if (!type || type === 'demo') {
      const demos = await prisma.demoRequest.findMany({
        orderBy: { submittedAt: 'desc' },
        take: 50,
      });
      submissions.push(...demos.map(d => ({
        ...d,
        type: 'demo',
      })));
    }

    // Sort by submittedAt
    submissions.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Failed to fetch submissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
