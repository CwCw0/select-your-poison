'use client';

import Link from 'next/link';
import { Skull, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0C0C0C',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(16px, 4vw, 48px)',
    }}>
      {/* Logo */}
      <Link
        href="/"
        style={{
          position: 'absolute',
          top: '24px',
          left: 'clamp(16px, 4vw, 48px)',
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
        {/* Skull Icon */}
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

        {/* 404 */}
        <h1 style={{
          fontSize: 'clamp(6rem, 20vw, 12rem)',
          fontWeight: 900,
          color: '#FF0000',
          letterSpacing: '-4px',
          lineHeight: 0.9,
        }}>
          404
        </h1>

        {/* Heading */}
        <h2 style={{
          fontSize: '24px',
          fontWeight: 800,
          letterSpacing: '6px',
          color: '#FFFFFF',
        }}>
          PAGE NOT FOUND
        </h2>

        {/* Subtext */}
        <p style={{
          fontSize: '15px',
          color: '#999999',
          fontFamily: 'var(--font-space-mono), monospace',
          maxWidth: '400px',
          lineHeight: 1.7,
        }}>
          This page doesn&apos;t exist. Maybe it got aced.
        </p>

        {/* Button */}
        <Link
          href="/"
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
            textDecoration: 'none',
            borderRadius: '3px',
            marginTop: '16px',
          }}
        >
          <ArrowLeft style={{ width: '18px', height: '18px' }} />
          BACK TO BASE
        </Link>
      </div>
    </main>
  );
}
