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
    <main style={{ minHeight: '100vh', backgroundColor: '#0C0C0C' }}>
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
      <section style={{ padding: '100px 0 80px', backgroundColor: '#0C0C0C' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 48px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '4px', color: '#FF0000', fontFamily: 'var(--font-space-mono), monospace' }}>
              HOW TO PLAY
            </span>
            <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-3px', lineHeight: 1 }}>
              THE RULES
            </h1>
            <p style={{ fontSize: '18px', color: '#999999', lineHeight: 1.8, maxWidth: '700px' }}>
              Select Your Poison turns every Valorant match into a drinking game.
              Choose your modes, set your intensity, and prepare for chaos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Safety Warning */}
      <section style={{ padding: '0 0 80px', backgroundColor: '#0C0C0C' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 48px)' }}>
          <div style={{
            padding: '32px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid #F59E0B',
            display: 'flex',
            gap: '20px'
          }}>
            <AlertTriangle style={{ width: '24px', height: '24px', color: '#F59E0B', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#F59E0B', letterSpacing: '1px' }}>DRINK RESPONSIBLY</span>
              <p style={{ fontSize: '14px', color: 'rgba(245, 158, 11, 0.8)', lineHeight: 1.7 }}>
                This is meant to be fun. Know your limits, stay hydrated, and never drink and drive.
                Use non-alcoholic beverages if you prefer. The point is to have a good time with your squad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section style={{ padding: '80px 0', backgroundColor: '#0A0A0A' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 48px)' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-1px', marginBottom: '48px' }}>
            Getting Started
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '24px' }}>
            {[
              { icon: <Users style={{ width: '28px', height: '28px', color: '#FF0000' }} />, title: '1. Create a Lobby', desc: 'Host creates a lobby and shares the code with the squad. No account needed.' },
              { icon: <Shield style={{ width: '28px', height: '28px', color: '#FF0000' }} />, title: '2. Pick Your Modes', desc: 'Select one or more game modes. Mix Agent Poison with Strat Roulette for maximum chaos.' },
              { icon: <Wine style={{ width: '28px', height: '28px', color: '#FF0000' }} />, title: '3. Track & Drink', desc: 'Use the tracker during your Valorant match. Tap to add deaths, watch drinks stack up.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  padding: '40px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333333',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}
              >
                <div style={{ width: '56px', height: '56px', backgroundColor: 'rgba(255, 0, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF' }}>{item.title}</h3>
                <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.8 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Game Modes */}
      <section style={{ padding: '100px 0', backgroundColor: '#0C0C0C' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 48px)' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-1px', marginBottom: '48px' }}>
            Game Modes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {rules.map((mode, index) => (
              <motion.div
                key={mode.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  padding: '40px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333333',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px'
                }}
                className="md:flex-row"
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', minWidth: '300px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    backgroundColor: mode.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span style={{ color: '#FFFFFF' }}>{mode.icon}</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '1px', marginBottom: '8px' }}>{mode.title}</h3>
                    <p style={{ fontSize: '14px', color: '#999999', lineHeight: 1.6 }}>{mode.description}</p>
                  </div>
                </div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                  {mode.rules.map((rule, ruleIndex) => (
                    <li key={ruleIndex} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                      <span style={{ color: '#FF0000', marginTop: '6px', fontSize: '8px' }}>●</span>
                      <span style={{ fontSize: '15px', color: '#999999', lineHeight: 1.7 }}>{rule}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Intensity Levels */}
      <section style={{ padding: '100px 0', backgroundColor: '#0A0A0A' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 48px)' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-1px', marginBottom: '16px' }}>
            Intensity Levels
          </h2>
          <p style={{ fontSize: '16px', color: '#999999', lineHeight: 1.7, marginBottom: '48px' }}>
            The intensity multiplier affects how many drinks you take. Choose wisely.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '24px' }}>
            {intensityLevels.map((level, index) => (
              <motion.div
                key={level.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  padding: '32px 24px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333333',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '12px'
                }}
              >
                <span style={{ fontSize: '36px', fontWeight: 800, color: level.color }}>{level.multiplier}</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '2px' }}>{level.name}</span>
                <span style={{ fontSize: '13px', color: '#999999', lineHeight: 1.6 }}>{level.description}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '120px 0', backgroundColor: '#0C0C0C', borderTop: '1px solid #333333' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 48px)', textAlign: 'center' }}>
          <h2 style={{ fontSize: '40px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-2px', marginBottom: '40px' }}>
            Ready to Play?
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link
              href="/lobby/create"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '20px 40px',
                backgroundColor: '#FF0000',
                fontSize: '14px',
                fontWeight: 700,
                color: '#0C0C0C',
                letterSpacing: '2px'
              }}
            >
              <Zap style={{ width: '20px', height: '20px' }} />
              CREATE LOBBY
            </Link>
            <Link
              href="/lobby/join"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '20px 40px',
                border: '1px solid #333333',
                fontSize: '14px',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '2px'
              }}
            >
              JOIN GAME
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
