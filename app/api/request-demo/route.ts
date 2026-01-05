import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, role, employeeCount, notes } = body;

    // Validate required fields
    if (!name || !email || !company) {
      return NextResponse.json(
        { error: 'Name, email, and company are required' },
        { status: 400 }
      );
    }

    // Persist to database
    const demoRequest = await prisma.demoRequest.create({
      data: {
        name,
        email,
        company,
        role: role || null,
        employeeCount: employeeCount || null,
        notes: notes || null,
        status: 'new',
      },
    });

    // Send email to demo request recipient
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: process.env.REQUEST_DEMO_TO!,
      replyTo: email,
      subject: 'New Demo Request',
      html: `
        <h2>New Demo Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Role:</strong> ${role || 'Not provided'}</p>
        <p><strong>Estimated Employee Count:</strong> ${employeeCount || 'Not provided'}</p>
        <p><strong>Notes:</strong></p>
        <p>${notes ? notes.replace(/\n/g, '<br>') : 'No additional notes'}</p>
      `,
    });

    if (error) {
      console.error('Failed to send demo request email:', error);
      return NextResponse.json(
        { error: 'Failed to send demo request' },
        { status: 500 }
      );
    }  <p><strong>Request ID:</strong> ${demoRequest.id}</p>
      `,
    });

    return NextResponse.json({ success: true, data, requestId: demoRequest.id });
  } catch (error) {
    console.error('Demo request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/request-demo - List all demo requests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status) where.status = status;

    const requests = await prisma.demoRequest.findMany({
      where,
      orderBy: { submittedAt: 'desc' },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Failed to fetch demo requestsION_EMAIL!,
      replyTo: process.env.EMAIL_REPLY_TO!,
      subject: `New Demo Request: ${company} (${employeeCount || 'Unknown'} employees)`,
      html: `
        <p>New demo request received.</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Contact:</strong> ${name} (${email})</p>
        <p><strong>Role:</strong> ${role || 'Not provided'}</p>
        <p><strong>Employee Count:</strong> ${employeeCount || 'Not provided'}</p>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Demo request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
