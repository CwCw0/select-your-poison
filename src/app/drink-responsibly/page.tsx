'use client';

import Link from 'next/link';
import { ArrowLeft, Skull, AlertTriangle, Heart, Shield, Phone } from 'lucide-react';

export default function DrinkResponsiblyPage() {
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
        <div className="flex items-center gap-4 mb-12">
          <AlertTriangle className="w-8 h-8 text-[#F59E0B] flex-shrink-0" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            DRINK RESPONSIBLY
          </h1>
        </div>

        {/* Warning Banner */}
        <div className="p-6 sm:p-8 bg-[rgba(245,158,11,0.1)] border border-[#F59E0B] mb-12">
          <p className="text-base sm:text-lg text-[#F59E0B] font-semibold leading-relaxed">
            Select Your Poison is designed to be fun. It is NOT designed to encourage excessive or
            dangerous drinking. Your safety and the safety of your friends always comes first.
          </p>
        </div>

        <div className="flex flex-col gap-10 text-[15px] text-[#999999] leading-[1.9]">
          {/* Guidelines */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-[#22C55E]" />
              <h2 className="text-xl font-bold text-white tracking-wide">OUR GUIDELINES</h2>
            </div>
            <div className="flex flex-col gap-4">
              {[
                'Know your limits. Stop drinking when you feel you\'ve had enough.',
                'Stay hydrated. Drink water between rounds.',
                'Eat before and during your session.',
                'Never drink and drive. Arrange a ride home before you start.',
                'It\'s always OK to skip a drink. Nobody should be pressured.',
                'Use non-alcoholic drinks if you prefer — the game is just as fun.',
                'Look out for your friends. If someone seems unwell, stop the game.',
                'You must be 21 or older to use SYP with alcoholic beverages.',
              ].map((rule, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="text-[#22C55E] mt-2 text-[8px] flex-shrink-0">●</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Alternatives */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-[#FF0000]" />
              <h2 className="text-xl font-bold text-white tracking-wide">NON-ALCOHOLIC ALTERNATIVES</h2>
            </div>
            <p className="mb-4">
              SYP works perfectly with non-alcoholic drinks. Here are some ideas:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Water (stay hydrated!)',
                'Energy drinks',
                'Juice or soda',
                'Sparkling water',
                'Mocktails',
                'Tea or coffee',
                'Non-alcoholic beer',
                'Whatever you enjoy',
              ].map((alt, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-[#1A1A1A] border border-[#333333]">
                  <span className="text-[#FF0000] text-[8px]">●</span>
                  <span className="text-[14px] text-[#CCCCCC] font-mono">{alt}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Resources */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Phone className="w-6 h-6 text-[#7DD3FC]" />
              <h2 className="text-xl font-bold text-white tracking-wide">RESOURCES</h2>
            </div>
            <p className="mb-4">
              If you or someone you know needs help with alcohol use, these resources are available:
            </p>
            <div className="flex flex-col gap-3">
              {[
                { name: 'SAMHSA National Helpline', detail: '1-800-662-4357 (free, confidential, 24/7)' },
                { name: 'National Institute on Alcohol Abuse', detail: 'niaaa.nih.gov' },
                { name: 'Alcoholics Anonymous', detail: 'aa.org' },
                { name: 'Crisis Text Line', detail: 'Text HOME to 741741' },
              ].map((resource, i) => (
                <div key={i} className="p-4 bg-[#1A1A1A] border border-[#333333]">
                  <span className="text-[14px] font-bold text-white block mb-1">{resource.name}</span>
                  <span className="text-[13px] text-[#999999] font-mono">{resource.detail}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="p-6 bg-[#1A1A1A] border-l-4 border-[#FF0000] mt-4">
            <p className="text-[15px] text-white font-semibold leading-relaxed">
              The goal of SYP is to bring friends together and have a good time.
              If drinking stops being fun, stop drinking. It&apos;s that simple.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
