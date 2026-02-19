'use client';

import Link from 'next/link';
import { Zap, Github, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-[var(--bg-secondary)] border-t border-[var(--border-default)]">
      <div className="max-w-7xl mx-auto px-8 md:px-16 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--accent-red)] flex items-center justify-center">
                <Zap className="w-6 h-6 text-[var(--bg-primary)]" />
              </div>
              <span className="text-sm font-bold tracking-[3px] text-white">
                SELECT YOUR POISON
              </span>
            </div>
            <p className="text-sm text-[var(--text-muted)] max-w-xs">
              The ultimate Valorant drinking game. Track deaths, roll strats, and embrace the chaos.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold tracking-[2px] text-[var(--text-muted)] font-mono">
                PLAY
              </span>
              <Link href="/lobby/create" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
                Create Lobby
              </Link>
              <Link href="/lobby/join" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
                Join Game
              </Link>
              <Link href="/strats" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
                Browse Strats
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold tracking-[2px] text-[var(--text-muted)] font-mono">
                INFO
              </span>
              <Link href="#rules" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
                Rules
              </Link>
              <Link href="#modes" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
                Game Modes
              </Link>
              <Link href="#agents" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">
                Agent Rules
              </Link>
            </div>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold tracking-[2px] text-[var(--text-muted)] font-mono">
              CONNECT
            </span>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-[var(--border-default)] hover:border-[var(--text-muted)] transition-colors"
              >
                <Github className="w-5 h-5 text-[var(--text-secondary)]" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-[var(--border-default)] hover:border-[var(--text-muted)] transition-colors"
              >
                <Twitter className="w-5 h-5 text-[var(--text-secondary)]" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-[var(--border-default)] gap-4">
          <p className="text-[10px] text-[var(--text-muted)] font-mono">
            © 2025 SELECT YOUR POISON. Not affiliated with Riot Games.
          </p>
          <p className="text-[10px] font-semibold tracking-[1px] text-[var(--accent-red)] font-mono">
            21+ ONLY. PLEASE DRINK RESPONSIBLY.
          </p>
        </div>
      </div>
    </footer>
  );
}
