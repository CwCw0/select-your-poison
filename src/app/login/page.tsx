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
      <div className="hidden lg:flex flex-1 flex-col justify-between bg-[#0A0A0A] p-20 xl:px-24">
        {/* Top Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
            <div style={{ width: '44px', height: '44px', backgroundColor: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Skull style={{ width: '26px', height: '26px', color: '#0C0C0C' }} />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '3px', color: '#FFFFFF' }}>
              SELECT YOUR POISON
            </span>
          </Link>

          {/* Hero */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <h1 style={{ fontSize: '80px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-3px', lineHeight: 0.95 }}>
              WELCOME<br />
              BACK,<br />
              AGENT.
            </h1>
            <p style={{ fontSize: '16px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace', maxWidth: '400px', lineHeight: 1.7 }}>
              Your squad is waiting. Log in to continue the chaos.
            </p>
          </div>
        </div>

        {/* Bottom Quote */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ fontSize: '16px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace', fontStyle: 'italic', lineHeight: 1.6 }}>
            &quot;They have no idea what&apos;s coming.&quot;
          </p>
          <span style={{ fontSize: '13px', fontFamily: 'var(--font-space-mono), monospace', fontWeight: 600, letterSpacing: '2px', color: '#A855F7' }}>
            — REYNA
          </span>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 md:px-16 lg:flex-none lg:w-[600px] lg:px-20 lg:border-l lg:border-[#333333]">
        {/* Mobile Logo */}
        <div className="lg:hidden" style={{ marginBottom: '56px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none' }}>
            <div style={{ width: '44px', height: '44px', backgroundColor: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Skull style={{ width: '24px', height: '24px', color: '#0C0C0C' }} />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '3px', color: '#FFFFFF' }}>
              SYP
            </span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '40px', width: '100%', maxWidth: '400px' }}
        >
          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '2px', color: '#FFFFFF' }}>
              LOG IN
            </h2>
            <p style={{ fontSize: '14px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace' }}>
              Enter your credentials to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label htmlFor="email" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace' }}>
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
                className={`h-14 px-5 bg-transparent border text-white font-mono text-sm outline-none transition-colors duration-200 focus:border-[#FF0000] focus:shadow-[0_0_0_1px_#FF0000] ${validationErrors.email ? 'border-[#EF4444]' : 'border-[#333333]'}`}
              />
              {validationErrors.email && (
                <span id="email-error" style={{ fontSize: '11px', color: '#EF4444', fontFamily: 'var(--font-space-mono), monospace' }}>
                  {validationErrors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label htmlFor="password" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace' }}>
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
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
                  className={`w-full h-14 pl-5 pr-14 bg-transparent border text-white font-mono text-sm outline-none transition-colors duration-200 focus:border-[#FF0000] focus:shadow-[0_0_0_1px_#FF0000] ${validationErrors.password ? 'border-[#EF4444]' : 'border-[#333333]'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#999999',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  {showPassword ? <Eye style={{ width: '20px', height: '20px' }} /> : <EyeOff style={{ width: '20px', height: '20px' }} />}
                </button>
              </div>
              {validationErrors.password && (
                <span id="password-error" style={{ fontSize: '11px', color: '#EF4444', fontFamily: 'var(--font-space-mono), monospace' }}>
                  {validationErrors.password}
                </span>
              )}
            </div>

            {/* Forgot Password */}
            <Link href="#" style={{ fontSize: '13px', color: '#FF0000', fontFamily: 'var(--font-space-mono), monospace', fontWeight: 500, textDecoration: 'none' }}>
              Forgot password?
            </Link>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.01 } : undefined}
              whileTap={!isLoading ? { scale: 0.97 } : undefined}
              className="h-[60px] bg-[#FF0000] text-[#0C0C0C] text-[15px] font-bold tracking-[2px] flex items-center justify-center gap-3.5 border-none mt-2 transition-all duration-200 hover:bg-[#E50000] hover:shadow-[0_0_24px_rgba(255,0,0,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF0000] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-[22px] h-[22px] animate-spin" />
              ) : (
                <LogIn className="w-[22px] h-[22px]" />
              )}
              {isLoading ? 'ENTERING...' : 'ENTER THE ARENA'}
            </motion.button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#333333' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#333333' }} />
          </div>

          {/* Social Login */}
          <div className="flex gap-4">
            <motion.button
              type="button"
              onClick={() => handleOAuthLogin('discord')}
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
              onClick={() => handleOAuthLogin('google')}
              disabled={oauthLoading !== null}
              whileHover={oauthLoading === null ? { scale: 1.02 } : undefined}
              whileTap={oauthLoading === null ? { scale: 0.97 } : undefined}
              className="flex-1 h-14 border border-[#333333] bg-transparent flex items-center justify-center gap-3.5 transition-all duration-200 hover:border-[#FFFFFF]/50 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {oauthLoading === 'google' ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Circle className="w-5 h-5 text-white" />
              )}
              <span className="text-[13px] font-semibold tracking-[1px] text-white font-mono">GOOGLE</span>
            </motion.button>
          </div>

          {/* Signup Link */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '8px' }}>
            <span style={{ fontSize: '13px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace' }}>New agent?</span>
            <Link href="/signup" style={{ fontSize: '13px', color: '#FF0000', fontWeight: 600, fontFamily: 'var(--font-space-mono), monospace', textDecoration: 'none' }}>
              Create account
            </Link>
          </div>

          {/* Error Notice */}
          {error && (
            <div style={{ padding: '24px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', textAlign: 'center', marginTop: '8px' }}>
              <p style={{ fontSize: '15px', color: '#EF4444', fontFamily: 'var(--font-space-mono), monospace' }}>
                {error}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
