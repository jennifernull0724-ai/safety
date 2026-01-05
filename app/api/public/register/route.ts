import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

/**
 * CREATE ACCOUNT API
 * 
 * Purpose:
 * - Create a user identity, NOT an organization
 * 
 * Response:
 * { "userId": "user_456", "nextStep": "join_or_request_org" }
 * 
 * DOES NOT:
 * - Create organization
 * - Grant verification authority
 * - Enable operational permissions
 * - Associate with organization
 * 
 * NO Base44, NO verification logic
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, password } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: 'Full name, email, and password required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength (min 8 chars)
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user (no organization yet - they need to join or create one)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: fullName,
        role: 'admin', // Default role, can be changed when joining org
        status: 'active'
      }
    });

    return NextResponse.json({
      userId: user.id,
      email: user.email,
      nextStep: 'join_or_request_org',
      message: 'Account created successfully. Please join an organization or request a demo.'
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
