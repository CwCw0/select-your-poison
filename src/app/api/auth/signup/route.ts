import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth-config';
import { signupSchema } from '@/lib/validations';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = signupSchema.parse(body);

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Check if gamertag already exists
    const existingGamertag = await prisma.user.findUnique({
      where: { gamertag: validatedData.gamertag },
    });

    if (existingGamertag) {
      return NextResponse.json(
        { error: 'This gamertag is already taken' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        gamertag: validatedData.gamertag,
        email: validatedData.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        gamertag: true,
        email: true,
        createdAt: true,
      },
    });

    // Create initial game stats
    await prisma.gameStats.create({
      data: { userId: user.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please sign in.',
      user: {
        id: user.id,
        gamertag: user.gamertag,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);

    if (error instanceof ZodError) {
      const firstIssue = error.issues[0];
      return NextResponse.json(
        { error: firstIssue.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
