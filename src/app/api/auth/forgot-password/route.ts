import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Always return success to prevent email enumeration
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user) {
      // Generate reset token
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Clean up any existing tokens for this email
      await prisma.verificationToken.deleteMany({
        where: { identifier: normalizedEmail },
      });

      // Store the token
      await prisma.verificationToken.create({
        data: {
          identifier: normalizedEmail,
          token,
          expires,
        },
      });

      // Send reset email
      await sendPasswordResetEmail(normalizedEmail, token);
    }

    // Always return success (prevents email enumeration)
    return NextResponse.json({
      success: true,
      message: 'If an account exists with that email, a reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
