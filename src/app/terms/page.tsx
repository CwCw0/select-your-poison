'use client';

import Link from 'next/link';
import { ArrowLeft, Skull } from 'lucide-react';

export default function TermsPage() {
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
          TERMS OF SERVICE
        </h1>

        <div className="flex flex-col gap-10 text-[15px] text-[#999999] leading-[1.9]">
          <section>
            <h2 className="text-lg font-bold text-white tracking-wide mb-4">1. ACCEPTANCE OF TERMS</h2>
            <p>
              By accessing or using Select Your Poison (&quot;SYP&quot;, &quot;the Service&quot;), you agree to be bound
              by these Terms of Service. If you do not agree with any part of these terms, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white tracking-wide mb-4">2. DESCRIPTION OF SERVICE</h2>
            <p>
              SYP is a web-based companion tool for gaming sessions. It provides game tracking, strat roulette,
              and social features for use alongside video games. SYP is not a gambling service and does not
              facilitate real-money transactions beyond voluntary donations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white tracking-wide mb-4">3. ELIGIBILITY</h2>
            <p>
              You must be at least 21 years of age to use this Service. By using SYP, you confirm that you meet
              this age requirement. SYP is intended for use by legal adults in jurisdictions where the consumption
              of alcoholic beverages is permitted.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white tracking-wide mb-4">4. USER ACCOUNTS</h2>
            <p>
              When you create an account, you are responsible for maintaining the security of your credentials.
              You agree to provide accurate information and to not impersonate others. We reserve the right to
              suspend or terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white tracking-wide mb-4">5. ACCEPTABLE USE</h2>
            <p>You agree not to:</p>
            <ul className="list-none flex flex-col gap-2 mt-3 ml-4">
              <li className="flex items-start gap-3">
                <span className="text-[#FF0000] mt-2 text-[8px]">●</span>
                Use the Service for any unlawful purpose
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#FF0000] mt-2 text-[8px]">●</span>
                Attempt to gain unauthorized access to any part of the Service
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#FF0000] mt-2 text-[8px]">●</span>
                Interfere with or disrupt the Service or its infrastructure
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#FF0000] mt-2 text-[8px]">●</span>
                Use automated tools to scrape or interact with the Service
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white tracking-wide mb-4">6. DISCLAIMER</h2>
            <p>
              SYP is provided &quot;as is&quot; without warranties of any kind. We do not guarantee uninterrupted
              or error-free operation. SYP is a companion tool and is not affiliated with, endorsed by, or
              connected to Riot Games or Valorant in any way.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white tracking-wide mb-4">7. RESPONSIBILITY</h2>
            <p>
              SYP is a social tool. You are solely responsible for your actions while using the Service,
              including but not limited to the consumption of beverages. SYP does not encourage excessive
              or irresponsible drinking. Please refer to our{' '}
              <Link href="/drink-responsibly" className="text-[#FF0000] hover:underline">
                Drink Responsibly
              </Link>{' '}
              page for guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white tracking-wide mb-4">8. CHANGES TO TERMS</h2>
            <p>
              We reserve the right to update these terms at any time. Continued use of the Service after
              changes constitutes acceptance of the updated terms.
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
