'use client';

import Link from 'next/link';
import { Zap, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  showAuth?: boolean;
}

export function Navbar({ showAuth = true }: NavbarProps) {
  return (
    <nav className="w-full h-[72px] flex items-center justify-between px-8 md:px-16 border-b border-[var(--border-default)]">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[var(--accent-red)] flex items-center justify-center">
          <Zap className="w-6 h-6 text-[var(--bg-primary)]" />
        </div>
        <span className="text-sm font-bold tracking-[3px] text-white hidden sm:block">
          SELECT YOUR POISON
        </span>
      </Link>

      {/* Nav Links - Desktop */}
      <div className="hidden md:flex items-center gap-8">
        <Link
          href="#modes"
          className="text-[11px] font-semibold tracking-[2px] text-[var(--text-muted)] hover:text-white transition-colors font-mono"
        >
          GAME MODES
        </Link>
        <Link
          href="#rules"
          className="text-[11px] font-semibold tracking-[2px] text-[var(--text-muted)] hover:text-white transition-colors font-mono"
        >
          RULES
        </Link>
        <Link
          href="#about"
          className="text-[11px] font-semibold tracking-[2px] text-[var(--text-muted)] hover:text-white transition-colors font-mono"
        >
          ABOUT
        </Link>
      </div>

      {/* Auth Buttons */}
      {showAuth && (
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <LogIn className="w-4 h-4" />
              LOG IN
            </Button>
          </Link>
          <Link href="/lobby/create">
            <Button variant="primary" size="sm">
              <Zap className="w-4 h-4" />
              CREATE LOBBY
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
