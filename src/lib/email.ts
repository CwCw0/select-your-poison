import { Resend } from 'resend';

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  const resend = getResendClient();
  if (!resend) {
    console.warn('⚠️ RESEND_API_KEY not set. Password reset email not sent.');
    console.log(`🔑 Reset link for ${email}:\n${resetUrl}\n`);
    return;
  }

  const { error } = await resend.emails.send({
    from: `SELECT YOUR POISON <${FROM_EMAIL}>`,
    to: email,
    subject: 'Reset Your Password — SELECT YOUR POISON',
    html: `
      <div style="background-color: #0C0C0C; padding: 48px 24px; font-family: 'Helvetica Neue', Arial, sans-serif;">
        <div style="max-width: 480px; margin: 0 auto;">
          <!-- Logo -->
          <div style="margin-bottom: 40px;">
            <div style="display: inline-block; width: 44px; height: 44px; background-color: #FF0000; text-align: center; line-height: 44px; font-size: 20px;">
              ☠
            </div>
            <span style="margin-left: 12px; font-size: 14px; font-weight: 700; letter-spacing: 3px; color: #FFFFFF; vertical-align: middle;">
              SYP
            </span>
          </div>

          <!-- Content -->
          <h1 style="font-size: 28px; font-weight: 800; color: #FFFFFF; letter-spacing: 1px; margin: 0 0 16px;">
            RESET YOUR PASSWORD
          </h1>
          <p style="font-size: 15px; color: #999999; line-height: 1.8; margin: 0 0 32px;">
            Someone requested a password reset for your Select Your Poison account.
            Click the button below to set a new password. This link expires in 1 hour.
          </p>

          <!-- CTA Button -->
          <a href="${resetUrl}"
             style="display: inline-block; padding: 16px 32px; background-color: #FF0000; color: #0C0C0C; font-size: 14px; font-weight: 700; letter-spacing: 2px; text-decoration: none; margin-bottom: 32px;">
            RESET PASSWORD
          </a>

          <p style="font-size: 13px; color: #666666; line-height: 1.7; margin: 0 0 8px;">
            If you didn't request this, you can safely ignore this email. Your password won't change.
          </p>

          <!-- Divider -->
          <div style="border-top: 1px solid #333333; margin: 32px 0;"></div>

          <!-- Footer -->
          <p style="font-size: 11px; color: #666666; letter-spacing: 1px;">
            SELECT YOUR POISON — Not affiliated with Riot Games.
          </p>
          <p style="font-size: 11px; color: #666666; margin-top: 4px;">
            If the button doesn't work, copy this link:<br />
            <a href="${resetUrl}" style="color: #FF0000; word-break: break-all;">${resetUrl}</a>
          </p>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send password reset email');
  }
}
