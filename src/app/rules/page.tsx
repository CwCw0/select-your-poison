'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Zap,
  ArrowLeft,
  Skull,
  Target,
  Dices,
  Trophy,
  AlertTriangle,
  Users,
  Wine,
  Shield,
} from 'lucide-react';

const rules = [
  {
    title: 'CLASSIC MODE',
    icon: <Skull className="w-6 h-6" />,
    iconBg: '#EF4444',
    description: 'The OG drinking game mode. Simple and deadly.',
    rules: [
      'Every death = 1 drink (modified by intensity)',
      'Track your deaths using the +1 button',
      'Deaths are per-round, drinks stack throughout the game',
      'First blood of the round? Bonus drink for the victim',
    ],
  },
  {
    title: 'AGENT POISON',
    icon: <Target className="w-6 h-6" />,
    iconBg: '#7C3AED',
    description: 'Your agent choice determines your drinking destiny.',
    rules: [
      'Each agent has unique drinking rules',
      'Duelist mains: Drink on whiff ults',
      'Sentinel mains: Drink when utility destroyed',
      'Initiator mains: Drink when flashes miss',
      'Controller mains: Drink when smokes fade early',
    ],
  },
  {
    title: 'STRAT ROULETTE',
    icon: <Dices className="w-6 h-6" />,
    iconBg: '#FF0000',
    description: 'Random challenges spice up every round.',
    rules: [
      'New strat is rolled each round automatically',
      'Team must follow the strat or everyone drinks',
      'Strats range from easy to absolutely stupid',
      'Use rerolls wisely - you only get 3 per half',
      'Successfully completing hard strats earns glory',
    ],
  },
  {
    title: 'CHALLENGES',
    icon: <Trophy className="w-6 h-6" />,
    iconBg: '#F59E0B',
    description: 'Side objectives for bonus drinking.',
    rules: [
      'Optional challenges appear throughout the game',
      'Complete them for bragging rights',
      'Fail them and drink the penalty',
      'Stack with other modes for maximum chaos',
    ],
  },
];

const intensityLevels = [
  { name: 'CASUAL', multiplier: '0.5x', description: 'Half drinks. For the lightweights.', color: '#78716C' },
  { name: 'RANKED', multiplier: '1x', description: 'Standard rules. The baseline.', color: '#EAB308' },
  { name: 'IMMORTAL', multiplier: '1.5x', description: 'Extra drinks. Getting spicy.', color: '#A855F7' },
  { name: 'RADIANT', multiplier: '2x', description: 'Double everything. True champions only.', color: '#FF0000' },
];

export default function RulesPage() {
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
          className="flex items-center gap-2 px-5 py-3 border border-[#333333] text-white text-[11px] font-semibold tracking-[2px] font-mono hover:border-[#FF0000] active:scale-[0.97] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK
        </Link>
      </header>

      {/* Hero Section */}
      <section className="pt-16 sm:pt-24 pb-16 sm:pb-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            <span className="text-[11px] font-semibold tracking-[4px] text-[#FF0000] font-mono">
              HOW TO PLAY
            </span>
            <h1 className="text-[clamp(3rem,8vw,5rem)] font-extrabold text-white tracking-[-3px] leading-none">
              THE RULES
            </h1>
            <p className="text-lg text-[#999999] leading-[1.8] max-w-[700px]">
              Select Your Poison turns every Valorant match into a drinking game.
              Choose your modes, set your intensity, and prepare for chaos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Safety Warning */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="p-6 sm:p-8 bg-[rgba(245,158,11,0.1)] border border-[#F59E0B] flex gap-5">
            <AlertTriangle className="w-6 h-6 text-[#F59E0B] shrink-0 mt-0.5" />
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold text-[#F59E0B] tracking-[1px]">DRINK RESPONSIBLY</span>
              <p className="text-sm text-[rgba(245,158,11,0.8)] leading-[1.7]">
                This is meant to be fun. Know your limits, stay hydrated, and never drink and drive.
                Use non-alcoholic beverages if you prefer. The point is to have a good time with your squad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-16 sm:py-20 bg-[#0A0A0A]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12">
          <h2 className="text-[32px] font-extrabold text-white tracking-[-1px] mb-12">
            Getting Started
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Users className="w-7 h-7 text-[#FF0000]" />, title: '1. Create a Lobby', desc: 'Host creates a lobby and shares the code with the squad. No account needed.' },
              { icon: <Shield className="w-7 h-7 text-[#FF0000]" />, title: '2. Pick Your Modes', desc: 'Select one or more game modes. Mix Agent Poison with Strat Roulette for maximum chaos.' },
              { icon: <Wine className="w-7 h-7 text-[#FF0000]" />, title: '3. Track & Drink', desc: 'Use the tracker during your Valorant match. Tap to add deaths, watch drinks stack up.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-8 sm:p-10 bg-[#1A1A1A] border border-[#333333] flex flex-col gap-5"
              >
                <div className="w-14 h-14 bg-[rgba(255,0,0,0.1)] flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="text-[15px] text-[#999999] leading-[1.8]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Game Modes */}
      <section className="py-16 sm:py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12">
          <h2 className="text-[32px] font-extrabold text-white tracking-[-1px] mb-12">
            Game Modes
          </h2>
          <div className="flex flex-col gap-6">
            {rules.map((mode, index) => (
              <motion.div
                key={mode.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-8 sm:p-10 bg-[#1A1A1A] border border-[#333333] flex flex-col md:flex-row gap-6"
              >
                <div className="flex items-start gap-5 md:min-w-[300px]">
                  <div
                    className="w-14 h-14 flex items-center justify-center shrink-0"
                    style={{ backgroundColor: mode.iconBg }}
                  >
                    <span className="text-white">{mode.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-[1px] mb-2">{mode.title}</h3>
                    <p className="text-sm text-[#999999] leading-relaxed">{mode.description}</p>
                  </div>
                </div>
                <ul className="flex flex-col gap-3 flex-1">
                  {mode.rules.map((rule, ruleIndex) => (
                    <li key={ruleIndex} className="flex items-start gap-3.5">
                      <span className="text-[#FF0000] mt-1.5 text-[8px]">●</span>
                      <span className="text-[15px] text-[#999999] leading-[1.7]">{rule}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Intensity Levels */}
      <section className="py-16 sm:py-24 bg-[#0A0A0A]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12">
          <h2 className="text-[32px] font-extrabold text-white tracking-[-1px] mb-4">
            Intensity Levels
          </h2>
          <p className="text-base text-[#999999] leading-[1.7] mb-12">
            The intensity multiplier affects how many drinks you take. Choose wisely.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {intensityLevels.map((level, index) => (
              <motion.div
                key={level.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 sm:p-8 bg-[#1A1A1A] border border-[#333333] flex flex-col items-center text-center gap-3"
              >
                <span className="text-4xl font-extrabold" style={{ color: level.color }}>{level.multiplier}</span>
                <span className="text-sm font-bold text-white tracking-[2px]">{level.name}</span>
                <span className="text-[13px] text-[#999999] leading-relaxed">{level.description}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 border-t border-[#333333]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12 text-center">
          <h2 className="text-[40px] font-extrabold text-white tracking-[-2px] mb-10">
            Ready to Play?
          </h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/lobby/create"
              className="flex items-center gap-3 py-5 px-10 bg-[#FF0000] text-sm font-bold text-[#0C0C0C] tracking-[2px] no-underline hover:bg-[#E50000] active:scale-[0.97] transition-all"
            >
              <Zap className="w-5 h-5" />
              CREATE LOBBY
            </Link>
            <Link
              href="/lobby/join"
              className="flex items-center gap-3 py-5 px-10 border border-[#333333] text-sm font-bold text-white tracking-[2px] no-underline hover:border-[#FF0000] active:scale-[0.97] transition-all"
            >
              JOIN GAME
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
