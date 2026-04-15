'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Skull, ArrowLeft, Mail, Loader2, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      setSent(true);
    } catch {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen h-screen bg-[#0C0C0C] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] flex flex-col gap-10"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 no-underline">
          <div className="w-11 h-11 bg-[#FF0000] flex items-center justify-center">
            <Skull className="w-6 h-6 text-[#0C0C0C]" />
          </div>
          <span className="text-[15px] font-bold tracking-[3px] text-white">SYP</span>
        </Link>

        {sent ? (
          /* Success State */
          <div className="flex flex-col gap-6">
            <div className="w-14 h-14 bg-[rgba(34,197,94,0.1)] border border-[#22C55E] flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-[#22C55E]" />
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-extrabold tracking-[1px] text-white">CHECK YOUR EMAIL</h2>
              <p className="text-sm text-[#999999] font-mono leading-relaxed">
                If an account exists with <span className="text-white">{email}</span>, we&apos;ve sent
                a password reset link. Check your inbox and spam folder.
              </p>
            </div>
            <Link
              href="/login"
              className="flex items-center gap-2 text-[13px] text-[#FF0000] font-semibold font-mono no-underline hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </div>
        ) : (
          /* Form State */
          <>
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[1px] text-white">
                RESET PASSWORD
              </h2>
              <p className="text-sm text-[#999999] font-mono">
                Enter your email and we&apos;ll send you a reset link
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2.5">
                <label
                  htmlFor="email"
                  className="text-[11px] font-semibold tracking-[2px] text-[#999999] font-mono"
                >
                  EMAIL
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="agent@valorant.gg"
                  className={`h-14 px-5 bg-transparent border text-white font-mono text-sm outline-none transition-colors duration-200 focus:border-[#FF0000] focus:shadow-[0_0_0_1px_#FF0000] ${error ? 'border-[#EF4444]' : 'border-[#333333]'}`}
                />
                {error && (
                  <span className="text-[11px] text-[#EF4444] font-mono">{error}</span>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.01 } : undefined}
                whileTap={!isLoading ? { scale: 0.97 } : undefined}
                className="h-[56px] bg-[#FF0000] text-[#0C0C0C] text-[14px] font-bold tracking-[2px] flex items-center justify-center gap-3 border-none cursor-pointer transition-all duration-200 hover:bg-[#E50000] hover:shadow-[0_0_24px_rgba(255,0,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Mail className="w-5 h-5" />
                )}
                {isLoading ? 'SENDING...' : 'SEND RESET LINK'}
              </motion.button>
            </form>

            <Link
              href="/login"
              className="flex items-center gap-2 text-[13px] text-[#FF0000] font-semibold font-mono no-underline hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </>
        )}
      </motion.div>
    </main>
  );
}
