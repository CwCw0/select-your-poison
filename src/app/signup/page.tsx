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
    <main style={{ minHeight: '100vh', height: '100vh', backgroundColor: '#0C0C0C', display: 'flex', overflow: 'hidden' }}>
      {/* Left Panel */}
      <div className="hidden lg:flex" style={{
        flex: 1,
        backgroundColor: '#0A0A0A',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '80px 96px'
      }}>
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
            {/* Tag */}
            <div style={{ display: 'inline-flex', alignSelf: 'flex-start', padding: '10px 20px', border: '1px solid #22C55E' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '4px', color: '#22C55E', fontFamily: 'var(--font-space-mono), monospace' }}>
                JOIN THE CHAOS
              </span>
            </div>
            <h1 style={{ fontSize: '72px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-2px', lineHeight: 1.05 }}>
              BECOME AN<br />
              AGENT.
            </h1>
            <p style={{ fontSize: '16px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace', maxWidth: '400px', lineHeight: 1.7 }}>
              Create your account. Pick your agent.<br />
              No mercy awaits.
            </p>
          </div>
        </div>

        {/* Bottom Quote */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ fontSize: '16px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace', fontStyle: 'italic', lineHeight: 1.6 }}>
            &quot;Watch this.&quot;
          </p>
          <span style={{ fontSize: '13px', fontFamily: 'var(--font-space-mono), monospace', fontWeight: 600, letterSpacing: '2px', color: '#7DD3FC' }}>
            — JETT
          </span>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
        borderLeft: '1px solid #333333'
      }} className="lg:flex-none lg:w-[600px]">
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
              CREATE ACCOUNT
            </h2>
            <p style={{ fontSize: '14px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace' }}>
              Enter your details to get started
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Gamertag */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label htmlFor="gamertag" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace' }}>
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
                style={{
                  height: '56px',
                  padding: '0 20px',
                  backgroundColor: '#1A1A1A',
                  border: validationErrors.gamertag ? '1px solid #EF4444' : '1px solid #333333',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                  textTransform: 'uppercase'
                }}
              />
              {validationErrors.gamertag && (
                <span id="gamertag-error" style={{ fontSize: '11px', color: '#EF4444', fontFamily: 'var(--font-space-mono), monospace' }}>
                  {validationErrors.gamertag}
                </span>
              )}
            </div>

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
                style={{
                  height: '56px',
                  padding: '0 20px',
                  backgroundColor: '#1A1A1A',
                  border: validationErrors.email ? '1px solid #EF4444' : '1px solid #333333',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none'
                }}
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
                  style={{
                    width: '100%',
                    height: '56px',
                    padding: '0 56px 0 20px',
                    backgroundColor: '#1A1A1A',
                    border: validationErrors.password ? '1px solid #EF4444' : '1px solid #333333',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    outline: 'none'
                  }}
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

            {/* Signup Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                height: '60px',
                backgroundColor: '#FF0000',
                color: '#0C0C0C',
                fontSize: '15px',
                fontWeight: 700,
                letterSpacing: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1,
                marginTop: '16px'
              }}
            >
              <UserPlus style={{ width: '22px', height: '22px' }} />
              {isLoading ? 'CREATING...' : 'JOIN THE ARENA'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#333333' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#333333' }} />
          </div>

          {/* Social Login */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              type="button"
              onClick={() => handleOAuthSignup('discord')}
              disabled={oauthLoading !== null}
              style={{
                flex: 1,
                height: '56px',
                border: '1px solid #333333',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                cursor: oauthLoading !== null ? 'not-allowed' : 'pointer',
                opacity: oauthLoading !== null ? 0.5 : 1
              }}
            >
              {oauthLoading === 'discord' ? (
                <Loader2 style={{ width: '20px', height: '20px', color: '#5865F2', animation: 'spin 1s linear infinite' }} />
              ) : (
                <MessageCircle style={{ width: '20px', height: '20px', color: '#5865F2' }} />
              )}
              <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '1px', color: '#FFFFFF', fontFamily: 'var(--font-space-mono), monospace' }}>DISCORD</span>
            </button>
            <button
              type="button"
              onClick={() => handleOAuthSignup('google')}
              disabled={oauthLoading !== null}
              style={{
                flex: 1,
                height: '56px',
                border: '1px solid #333333',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                cursor: oauthLoading !== null ? 'not-allowed' : 'pointer',
                opacity: oauthLoading !== null ? 0.5 : 1
              }}
            >
              {oauthLoading === 'google' ? (
                <Loader2 style={{ width: '20px', height: '20px', color: '#FFFFFF', animation: 'spin 1s linear infinite' }} />
              ) : (
                <Globe style={{ width: '20px', height: '20px', color: '#FFFFFF' }} />
              )}
              <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '1px', color: '#FFFFFF', fontFamily: 'var(--font-space-mono), monospace' }}>GOOGLE</span>
            </button>
          </div>

          {/* Login Link */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '8px' }}>
            <span style={{ fontSize: '13px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace' }}>Already an agent?</span>
            <Link href="/login" style={{ fontSize: '13px', color: '#FF0000', fontWeight: 600, fontFamily: 'var(--font-space-mono), monospace', textDecoration: 'none' }}>
              Log in
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
