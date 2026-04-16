'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Skull, LogIn, Eye, EyeOff, MessageCircle, Circle, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithProvider, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'discord' | 'google' | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOAuthLogin = async (provider: 'discord' | 'google') => {
    setOauthLoading(provider);
    clearError();
    await loginWithProvider(provider);
    setOauthLoading(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    const success = await login(email, password);

    if (success) {
      router.push('/');
    }
  };

  return (
    <main className="min-h-screen h-screen bg-[#0C0C0C] flex overflow-hidden">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-between bg-[#080808] p-16 xl:p-20 xl:px-24">
        {/* Top Section */}
        <div className="flex flex-col gap-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 no-underline">
            <div className="w-11 h-11 bg-[#FF0000] flex items-center justify-center">
              <Skull className="w-[26px] h-[26px] text-[#0C0C0C]" />
            </div>
            <span className="text-[15px] font-bold tracking-[3px] text-white">
              SELECT YOUR POISON
            </span>
          </Link>

          {/* Hero */}
          <div className="flex flex-col gap-10">
            <h1 className="text-[72px] xl:text-[80px] font-extrabold text-white tracking-[-3px] leading-[0.95]">
              WELCOME<br />
              BACK,<br />
              AGENT.
            </h1>
            <p className="text-[15px] text-[#777777] font-mono max-w-[400px] leading-[1.9]">
              Your squad is waiting. Log in to continue the chaos.
            </p>
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="flex flex-col gap-5">
          <p className="text-[15px] text-[#666666] font-mono italic leading-relaxed">
            &quot;They have no idea what&apos;s coming.&quot;
          </p>
          <span className="text-[13px] font-mono font-semibold tracking-[2px] text-[#A855F7]">
            — REYNA
          </span>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 sm:px-14 md:px-20 lg:flex-none lg:w-[580px] xl:w-[620px] lg:px-20 xl:px-24 lg:border-l lg:border-[#1E1E1E]">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-16">
          <Link href="/" className="flex items-center gap-4 no-underline">
            <div className="w-11 h-11 bg-[#FF0000] flex items-center justify-center">
              <Skull className="w-6 h-6 text-[#0C0C0C]" />
            </div>
            <span className="text-[15px] font-bold tracking-[3px] text-white">
              SYP
            </span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-12 w-full max-w-[380px] mx-auto lg:mx-0"
        >
          {/* Header */}
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-[2px] text-white">
              LOG IN
            </h2>
            <p className="text-sm text-[#777777] font-mono">
              Enter your credentials to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-8">
            {/* Email */}
            <div className="flex flex-col gap-3">
              <label htmlFor="email" className="text-[11px] font-semibold tracking-[2px] text-[#666666] font-mono">
                EMAIL
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) setValidationErrors(prev => ({ ...prev, email: undefined }));
                }}
                placeholder="agent@valorant.gg"
                aria-invalid={!!validationErrors.email}
                aria-describedby={validationErrors.email ? 'email-error' : undefined}
                className={`h-[52px] px-5 bg-[#141414] border text-white font-mono text-sm outline-none transition-all duration-200 placeholder:text-[#3A3A3A] focus:border-[#FF0000] focus:shadow-[0_0_0_1px_rgba(255,0,0,0.3)] ${validationErrors.email ? 'border-[#EF4444]' : 'border-[#2A2A2A]'}`}
              />
              {validationErrors.email && (
                <span id="email-error" className="text-[11px] text-[#EF4444] font-mono mt-0.5">
                  {validationErrors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-3">
              <label htmlFor="password" className="text-[11px] font-semibold tracking-[2px] text-[#666666] font-mono">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) setValidationErrors(prev => ({ ...prev, password: undefined }));
                  }}
                  placeholder="••••••••••••"
                  aria-invalid={!!validationErrors.password}
                  aria-describedby={validationErrors.password ? 'password-error' : undefined}
                  className={`w-full h-[52px] pl-5 pr-14 bg-[#141414] border text-white font-mono text-sm outline-none transition-all duration-200 placeholder:text-[#3A3A3A] focus:border-[#FF0000] focus:shadow-[0_0_0_1px_rgba(255,0,0,0.3)] ${validationErrors.password ? 'border-[#EF4444]' : 'border-[#2A2A2A]'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-5 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#555555] p-0 hover:text-white transition-colors"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
              {validationErrors.password && (
                <span id="password-error" className="text-[11px] text-[#EF4444] font-mono mt-0.5">
                  {validationErrors.password}
                </span>
              )}
            </div>

            {/* Forgot Password */}
            <Link href="/forgot-password" className="text-[13px] text-[#FF0000] font-mono font-medium no-underline hover:underline -mt-2">
              Forgot password?
            </Link>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.01 } : undefined}
              whileTap={!isLoading ? { scale: 0.97 } : undefined}
              className="h-[56px] bg-[#FF0000] text-[#0C0C0C] text-[14px] font-bold tracking-[2px] flex items-center justify-center gap-3.5 border-none transition-all duration-200 hover:bg-[#E50000] hover:shadow-[0_0_30px_rgba(255,0,0,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF0000] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              {isLoading ? 'ENTERING...' : 'ENTER THE ARENA'}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-6">
            <div className="flex-1 h-px bg-[#1E1E1E]" />
            <span className="text-[10px] font-semibold tracking-[3px] text-[#555555] font-mono">OR</span>
            <div className="flex-1 h-px bg-[#1E1E1E]" />
          </div>

          {/* Social Login */}
          <div className="flex gap-4">
            <motion.button
              type="button"
              onClick={() => handleOAuthLogin('discord')}
              disabled={oauthLoading !== null}
              whileHover={oauthLoading === null ? { scale: 1.02 } : undefined}
              whileTap={oauthLoading === null ? { scale: 0.97 } : undefined}
              className="flex-1 h-[52px] border border-[#2A2A2A] bg-transparent flex items-center justify-center gap-3.5 transition-all duration-200 hover:border-[#5865F2] hover:bg-[#5865F2]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5865F2] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {oauthLoading === 'discord' ? (
                <Loader2 className="w-5 h-5 text-[#5865F2] animate-spin" />
              ) : (
                <MessageCircle className="w-5 h-5 text-[#5865F2]" />
              )}
              <span className="text-[12px] font-semibold tracking-[1px] text-[#A0A0A0] font-mono">DISCORD</span>
            </motion.button>
            <motion.button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              disabled={oauthLoading !== null}
              whileHover={oauthLoading === null ? { scale: 1.02 } : undefined}
              whileTap={oauthLoading === null ? { scale: 0.97 } : undefined}
              className="flex-1 h-[52px] border border-[#2A2A2A] bg-transparent flex items-center justify-center gap-3.5 transition-all duration-200 hover:border-[#FFFFFF]/30 hover:bg-white/3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {oauthLoading === 'google' ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Circle className="w-5 h-5 text-[#A0A0A0]" />
              )}
              <span className="text-[12px] font-semibold tracking-[1px] text-[#A0A0A0] font-mono">GOOGLE</span>
            </motion.button>
          </div>

          {/* Signup Link */}
          <div className="flex items-center justify-center gap-3 mt-2">
            <span className="text-[13px] text-[#666666] font-mono">New agent?</span>
            <Link href="/signup" className="text-[13px] text-[#FF0000] font-semibold font-mono no-underline hover:underline">
              Create account
            </Link>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-6 bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.3)] text-center mt-2">
              <p className="text-[14px] text-[#EF4444] font-mono">
                {error}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
