'use client';

import Link from 'next/link';
import { Skull, ArrowLeft, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0C0C0C',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px',
    }}>
      {/* Logo */}
      <Link
        href="/"
        style={{
          position: 'absolute',
          top: '24px',
          left: '48px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textDecoration: 'none',
        }}
      >
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#FF0000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Skull style={{ width: '24px', height: '24px', color: '#0C0C0C' }} />
        </div>
        <span style={{
          fontSize: '14px',
          fontWeight: 700,
          letterSpacing: '3px',
          color: '#FFFFFF',
        }}>
          SYP
        </span>
      </Link>

      {/* Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        textAlign: 'center',
      }}>
        {/* Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
          border: '1px solid rgba(255, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}>
          <Skull style={{ width: '40px', height: '40px', color: '#FF0000' }} />
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 'clamp(3rem, 10vw, 5rem)',
          fontWeight: 900,
          color: '#FF0000',
          letterSpacing: '-2px',
          lineHeight: 1,
        }}>
          ERROR
        </h1>

        {/* Subtext */}
        <p style={{
          fontSize: '15px',
          color: '#999999',
          fontFamily: 'var(--font-space-mono), monospace',
          maxWidth: '440px',
          lineHeight: 1.7,
        }}>
          Something went wrong. Even the best agents whiff sometimes.
        </p>

        {/* Error Details (development) */}
        {error?.message && (
          <div style={{
            padding: '16px 24px',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            maxWidth: '500px',
            width: '100%',
          }}>
            <p style={{
              fontSize: '12px',
              color: '#EF4444',
              fontFamily: 'var(--font-space-mono), monospace',
              wordBreak: 'break-word',
            }}>
              {error.message}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginTop: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          <button
            onClick={reset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              height: '56px',
              paddingLeft: '32px',
              paddingRight: '32px',
              backgroundColor: '#FF0000',
              color: '#0C0C0C',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '2px',
              fontFamily: 'var(--font-space-mono), monospace',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            <RotateCcw style={{ width: '18px', height: '18px' }} />
            TRY AGAIN
          </button>

          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              height: '56px',
              paddingLeft: '32px',
              paddingRight: '32px',
              border: '1px solid #333333',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '2px',
              fontFamily: 'var(--font-space-mono), monospace',
              textDecoration: 'none',
              borderRadius: '3px',
            }}
          >
            <ArrowLeft style={{ width: '18px', height: '18px' }} />
            GO HOME
          </Link>
        </div>
      </div>
    </main>
  );
}
