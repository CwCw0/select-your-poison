'use client';

import Link from 'next/link';
import { ArrowLeft, Skull } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0C0C0C]">
      {/* Header */}
      <header className="h-[72px] flex items-center justify-between px-4 sm:px-8 lg:px-12 border-b border-[#333333]">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF0000] flex items-center justify-center">
            <Skull className="w-6 h-6 text-[#0C0C0C]" />
          </div>
          <span className="text-sm font-bold tracking-[3px] text-white">SYP</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-3 border border-[#333333] text-white text-[11px] font-semibold tracking-[2px] font-mono hover:border-[#FF0000] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK
        </Link>
      </header>

      {/* Content */}
      <div className="max-w-[800px] mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24">
        <span className="text-[11px] font-semibold tracking-[4px] text-[#FF0000] font-mono">
          LEGAL
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-4 mb-12">
          PRIVACY POLICY
        </h1>

        <div className="flex flex-col gap-10 text-[15px] text-[#999999] leading-[1.9]">
          <section>
            <h2 className="text-lg font-bold text-white tracking-wide mb-4">1. INFORMATION WE COLLECT</h2>
            <p className="mb-3">When you use SYP, we may collect:</p>
            <ul className="list-none flex flex-col gap-2 ml-4">
              <li className="flex items-start gap-3">
                <span className="text-[#FF0000] mt-2 text-[8px]">●</span>
                <strong className="text-white font-semibold">Account Information:</strong>&nbsp;Email address, gamertag, and hashed password when you create an account
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#FF0000] mt-2 text-[8px]">●</span>
                <strong className="text-white font-semibold">OAuth Data:</strong>&nbsp;Basic profile information (name, email) from Discord or Google if you sign in with those providers
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#FF0000] mt-2 text-[8px]">●</span>
                <strong className="text-white font-semibold">Game Data:</strong>&nbsp;In-game stats like deaths, drinks, rounds, and strats used during sessions
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white tracking-wide mb-4">2. HOW WE USE YOUR DATA</h2>
            <p>
              Your data is used solely to provide the SYP experience: managing your account, tracking game
              sessions, displaying stats, and enabling multiplayer lobby features. We do not sell your data
              to third parties. We do not use your data for advertising.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white tracking-wide mb-4">3. DATA STORAGE</h2>
            <p>
              Your data is stored securely in a PostgreSQL database hosted on Neon (serverless PostgreSQL).
              Passwords are hashed using bcrypt and are never stored in plain text. Session tokens are managed
              via secure JWT cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white tracking-wide mb-4">4. THIRD-PARTY SERVICES</h2>
            <p className="mb-3">SYP integrates with the following third-party services:</p>
            <ul className="list-none flex flex-col gap-2 ml-4">
              <li className="flex items-start gap-3">
                <span className="text-[#FF0000] mt-2 text-[8px]">●</span>
                <strong className="text-white font-semibold">Vercel:</strong>&nbsp;Hosting and deployment
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#FF0000] mt-2 text-[8px]">●</span>
                <strong className="text-white font-semibold">Neon:</strong>&nbsp;Database hosting
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#FF0000] mt-2 text-[8px]">●</span>
                <strong className="text-white font-semibold">Discord / Google:</strong>&nbsp;OAuth authentication (only if you choose to sign in with these providers)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white tracking-wide mb-4">5. COOKIES</h2>
            <p>
              SYP uses essential cookies for authentication and session management. We do not use tracking
              cookies or third-party analytics cookies. The only cookies stored are necessary for keeping
              you logged in.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white tracking-wide mb-4">6. YOUR RIGHTS</h2>
            <p>
              You can request deletion of your account and all associated data at any time by contacting us.
              Upon deletion, all personal data including game stats, session history, and account information
              will be permanently removed.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white tracking-wide mb-4">7. CONTACT</h2>
            <p>
              For any privacy-related questions or data deletion requests, reach out via the{' '}
              <Link href="/about" className="text-[#FF0000] hover:underline">About</Link> page
              or email us directly.
            </p>
          </section>

          <div className="pt-8 border-t border-[#333333]">
            <p className="text-[13px] text-[#666666] font-mono">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
