'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Skull, Eye, EyeOff, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!token || !email) {
    return (
      <main className="min-h-screen bg-[#0C0C0C] flex items-center justify-center px-4 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-14 h-14 bg-[rgba(239,68,68,0.1)] border border-[#EF4444] flex items-center justify-center">
            <Skull className="w-7 h-7 text-[#EF4444]" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">INVALID RESET LINK</h2>
          <p className="text-sm text-[#999999] font-mono max-w-sm">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link
            href="/forgot-password"
            className="h-12 px-8 bg-[#FF0000] text-[#0C0C0C] text-[13px] font-bold tracking-[2px] inline-flex items-center justify-center no-underline hover:bg-[#E50000] transition-colors"
          >
            REQUEST NEW LINK
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      setSuccess(true);
    } catch {
      setError('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-[#0C0C0C] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[400px] flex flex-col gap-8 items-center text-center"
        >
          <div className="w-14 h-14 bg-[rgba(34,197,94,0.1)] border border-[#22C55E] flex items-center justify-center">
            <CheckCircle className="w-7 h-7 text-[#22C55E]" />
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-extrabold text-white">PASSWORD RESET</h2>
            <p className="text-sm text-[#999999] font-mono">
              Your password has been successfully updated. You can now log in with your new password.
            </p>
          </div>
          <Link
            href="/login"
            className="h-12 px-8 bg-[#FF0000] text-[#0C0C0C] text-[13px] font-bold tracking-[2px] inline-flex items-center justify-center no-underline hover:bg-[#E50000] transition-colors"
          >
            LOG IN
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0C0C0C] flex items-center justify-center px-4">
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

        <div className="flex flex-col gap-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[1px] text-white">
            NEW PASSWORD
          </h2>
          <p className="text-sm text-[#999999] font-mono">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Password */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[11px] font-semibold tracking-[2px] text-[#999999] font-mono">
              NEW PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••••••"
                className="w-full h-14 pl-5 pr-14 bg-transparent border border-[#333333] text-white font-mono text-sm outline-none transition-colors duration-200 focus:border-[#FF0000] focus:shadow-[0_0_0_1px_#FF0000]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#999999] cursor-pointer p-0"
              >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[11px] font-semibold tracking-[2px] text-[#999999] font-mono">
              CONFIRM PASSWORD
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
              placeholder="••••••••••••"
              className="w-full h-14 px-5 bg-transparent border border-[#333333] text-white font-mono text-sm outline-none transition-colors duration-200 focus:border-[#FF0000] focus:shadow-[0_0_0_1px_#FF0000]"
            />
          </div>

          {error && (
            <span className="text-[11px] text-[#EF4444] font-mono">{error}</span>
          )}

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={!isLoading ? { scale: 1.01 } : undefined}
            whileTap={!isLoading ? { scale: 0.97 } : undefined}
            className="h-[56px] bg-[#FF0000] text-[#0C0C0C] text-[14px] font-bold tracking-[2px] flex items-center justify-center gap-3 border-none cursor-pointer transition-all duration-200 hover:bg-[#E50000] hover:shadow-[0_0_24px_rgba(255,0,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {isLoading ? 'RESETTING...' : 'RESET PASSWORD'}
          </motion.button>
        </form>

        <Link
          href="/login"
          className="flex items-center gap-2 text-[13px] text-[#FF0000] font-semibold font-mono no-underline hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </motion.div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#0C0C0C] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF0000] animate-spin" />
      </main>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
