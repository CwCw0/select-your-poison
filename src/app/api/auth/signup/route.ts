import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/auth';
import { signupSchema } from '@/lib/validations';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const { success } = rateLimit(`signup:${ip}`, 3, 60 * 60 * 1000);
    if (!success) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'Invalid input';
      return NextResponse.json(
        { error: firstError },
        { status: 400 }
      );
    }

    const { gamertag, email, password } = parsed.data;

    const result = await createUser(gamertag, email, password);

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Set auth cookie
    const response = NextResponse.json({
      success: true,
      user: result.user,
    });

    response.cookies.set('auth_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
