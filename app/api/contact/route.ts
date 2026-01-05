import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Persist to database
    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        company: company || null,
        message,
        status: 'new',
      },
    });

    // Send email to contact form recipient
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: process.env.CONTACT_FORM_TO!,
      replyTo: email,
      subject: 'New Contact Form Submission',
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (error) {
      console.error('Failed to send contact form email:', error);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    // Send admin notification
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: process.env.ADMIN_NOTIFICATION_EMAIL!,
      replyTo: process.env.EMAIL_REPLY_TO!,
      subject: `New Contact Form: ${name} - ${company || 'No company'}`,
      html: `
        <p>New contact form submission received.</p>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Company:</strong> ${company || 'Not provided'}</p>
        <p><strong>Submission ID:</strong> ${submission.id}</p>
      `,
    });

    return NextResponse.json({ success: true, data, submissionId: submission.id });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/contact - List all contact submissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status) where.status = status;

    const submissions = await prisma.contactSubmission.findMany({
      where,
      orderBy: { submittedAt: 'desc' },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Failed to fetch contact submissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
