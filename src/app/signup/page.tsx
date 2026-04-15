'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Skull, UserPlus, Eye, EyeOff, MessageCircle, Globe, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

export default function SignupPage() {
  const router = useRouter();
  const { signup, loginWithProvider, isLoading, error, clearError } = useAuthStore();
  const [gamertag, setGamertag] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'discord' | 'google' | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ gamertag?: string; email?: string; password?: string }>({});

  const validateForm = () => {
    const errors: { gamertag?: string; email?: string; password?: string } = {};

    if (!gamertag.trim()) {
      errors.gamertag = 'Gamertag is required';
    } else if (gamertag.trim().length < 3) {
      errors.gamertag = 'Gamertag must be at least 3 characters';
    } else if (gamertag.trim().length > 16) {
      errors.gamertag = 'Gamertag must be 16 characters or less';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOAuthSignup = async (provider: 'discord' | 'google') => {
    setOauthLoading(provider);
    clearError();
    await loginWithProvider(provider);
    setOauthLoading(null);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    const success = await signup(gamertag, email, password);

    if (success) {
      router.push('/');
    }
  };

  return (
    <main className="min-h-screen h-screen bg-[#0C0C0C] flex overflow-hidden">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-between bg-[#0A0A0A] p-20 xl:px-24">
        {/* Top Section */}
        <div className="flex flex-col gap-14">
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
          <div className="flex flex-col gap-8">
            {/* Tag */}
            <div className="inline-flex self-start py-2.5 px-5 border border-[#22C55E]">
              <span className="text-[11px] font-semibold tracking-[4px] text-[#22C55E] font-mono">
                JOIN THE CHAOS
              </span>
            </div>
            <h1 className="text-[72px] font-extrabold text-white tracking-[-2px] leading-[1.05]">
              BECOME AN<br />
              AGENT.
            </h1>
            <p className="text-base text-[#999999] font-mono max-w-[400px] leading-[1.7]">
              Create your account. Pick your agent.<br />
              No mercy awaits.
            </p>
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="flex flex-col gap-5">
          <p className="text-base text-[#999999] font-mono italic leading-relaxed">
            &quot;Watch this.&quot;
          </p>
          <span className="text-[13px] font-mono font-semibold tracking-[2px] text-[#7DD3FC]">
            — JETT
          </span>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 md:px-16 lg:flex-none lg:w-[600px] lg:px-20 lg:border-l lg:border-[#333333]">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-14">
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
          className="flex flex-col gap-10 w-full max-w-[400px]"
        >
          {/* Header */}
          <div className="flex flex-col gap-3">
            <h2 className="text-4xl font-extrabold tracking-[2px] text-white">
              CREATE ACCOUNT
            </h2>
            <p className="text-sm text-[#999999] font-mono">
              Enter your details to get started
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="flex flex-col gap-6">
            {/* Gamertag */}
            <div className="flex flex-col gap-2.5">
              <label htmlFor="gamertag" className="text-[11px] font-semibold tracking-[2px] text-[#999999] font-mono">
                GAMERTAG
              </label>
              <input
                id="gamertag"
                type="text"
                value={gamertag}
                onChange={(e) => {
                  setGamertag(e.target.value);
                  if (validationErrors.gamertag) setValidationErrors(prev => ({ ...prev, gamertag: undefined }));
                }}
                placeholder="JETTSNIPER42"
                aria-invalid={!!validationErrors.gamertag}
                aria-describedby={validationErrors.gamertag ? 'gamertag-error' : undefined}
                className={`h-14 px-5 bg-[#1A1A1A] border text-white text-sm outline-none uppercase transition-colors duration-200 focus:border-[#FF0000] focus:shadow-[0_0_0_1px_#FF0000] ${validationErrors.gamertag ? 'border-[#EF4444]' : 'border-[#333333]'}`}
              />
              {validationErrors.gamertag && (
                <span id="gamertag-error" className="text-[11px] text-[#EF4444] font-mono">
                  {validationErrors.gamertag}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2.5">
              <label htmlFor="email" className="text-[11px] font-semibold tracking-[2px] text-[#999999] font-mono">
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
                className={`h-14 px-5 bg-[#1A1A1A] border text-white text-sm outline-none transition-colors duration-200 focus:border-[#FF0000] focus:shadow-[0_0_0_1px_#FF0000] ${validationErrors.email ? 'border-[#EF4444]' : 'border-[#333333]'}`}
              />
              {validationErrors.email && (
                <span id="email-error" className="text-[11px] text-[#EF4444] font-mono">
                  {validationErrors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2.5">
              <label htmlFor="password" className="text-[11px] font-semibold tracking-[2px] text-[#999999] font-mono">
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
                  className={`w-full h-14 pl-5 pr-14 bg-[#1A1A1A] border text-white text-sm outline-none transition-colors duration-200 focus:border-[#FF0000] focus:shadow-[0_0_0_1px_#FF0000] ${validationErrors.password ? 'border-[#EF4444]' : 'border-[#333333]'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-5 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#999999] p-0 hover:text-white transition-colors"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
              {validationErrors.password && (
                <span id="password-error" className="text-[11px] text-[#EF4444] font-mono">
                  {validationErrors.password}
                </span>
              )}
            </div>

            {/* Signup Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.01 } : undefined}
              whileTap={!isLoading ? { scale: 0.97 } : undefined}
              className="h-[60px] bg-[#FF0000] text-[#0C0C0C] text-[15px] font-bold tracking-[2px] flex items-center justify-center gap-3.5 border-none mt-4 transition-all duration-200 hover:bg-[#E50000] hover:shadow-[0_0_24px_rgba(255,0,0,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF0000] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-[22px] h-[22px] animate-spin" />
              ) : (
                <UserPlus className="w-[22px] h-[22px]" />
              )}
              {isLoading ? 'CREATING...' : 'JOIN THE ARENA'}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-5">
            <div className="flex-1 h-px bg-[#333333]" />
            <span className="text-[11px] font-semibold tracking-[2px] text-[#999999] font-mono">OR</span>
            <div className="flex-1 h-px bg-[#333333]" />
          </div>

          {/* Social Login */}
          <div className="flex gap-4">
            <motion.button
              type="button"
              onClick={() => handleOAuthSignup('discord')}
              disabled={oauthLoading !== null}
              whileHover={oauthLoading === null ? { scale: 1.02 } : undefined}
              whileTap={oauthLoading === null ? { scale: 0.97 } : undefined}
              className="flex-1 h-14 border border-[#333333] bg-transparent flex items-center justify-center gap-3.5 transition-all duration-200 hover:border-[#5865F2] hover:bg-[#5865F2]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5865F2] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {oauthLoading === 'discord' ? (
                <Loader2 className="w-5 h-5 text-[#5865F2] animate-spin" />
              ) : (
                <MessageCircle className="w-5 h-5 text-[#5865F2]" />
              )}
              <span className="text-[13px] font-semibold tracking-[1px] text-white font-mono">DISCORD</span>
            </motion.button>
            <motion.button
              type="button"
              onClick={() => handleOAuthSignup('google')}
              disabled={oauthLoading !== null}
              whileHover={oauthLoading === null ? { scale: 1.02 } : undefined}
              whileTap={oauthLoading === null ? { scale: 0.97 } : undefined}
              className="flex-1 h-14 border border-[#333333] bg-transparent flex items-center justify-center gap-3.5 transition-all duration-200 hover:border-[#FFFFFF]/50 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {oauthLoading === 'google' ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Globe className="w-5 h-5 text-white" />
              )}
              <span className="text-[13px] font-semibold tracking-[1px] text-white font-mono">GOOGLE</span>
            </motion.button>
          </div>

          {/* Login Link */}
          <div className="flex items-center justify-center gap-2.5 mt-2">
            <span className="text-[13px] text-[#999999] font-mono">Already an agent?</span>
            <Link href="/login" className="text-[13px] text-[#FF0000] font-semibold font-mono no-underline hover:underline">
              Log in
            </Link>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-6 bg-[rgba(239,68,68,0.1)] border border-[#EF4444] text-center mt-2">
              <p className="text-[15px] text-[#EF4444] font-mono">
                {error}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
