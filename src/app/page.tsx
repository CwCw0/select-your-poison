'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Zap, Skull, Target, Dices, User, Play, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useLogoEasterEgg, VoicelineEffect } from '@/components/EasterEggs';
import { ThemeToggle } from '@/components/ThemeToggle';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { handleClick: handleLogoClick, showVoiceline, voiceline } = useLogoEasterEgg();

  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      {/* Voiceline Easter Egg */}
      <AnimatePresence>
        {showVoiceline && <VoicelineEffect data={voiceline} />}
      </AnimatePresence>

      {/* Navigation - height 72, padding [0, 64] */}
      <header className="w-full h-[72px] flex items-center justify-between px-4 sm:px-8 lg:px-16 border-b border-[var(--border-default)]">
        {/* Logo with Easter Egg */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-3 bg-transparent border-none cursor-pointer"
          aria-label="SELECT YOUR POISON - Click 5 times for a surprise"
        >
          <div className="w-10 h-10 bg-[#FF0000] flex items-center justify-center">
            <Skull className="w-6 h-6 text-[#0C0C0C]" />
          </div>
          <span className="text-sm font-bold tracking-[3px] text-[var(--text-primary)] hidden md:block">
            SELECT YOUR POISON
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          <Link href="#modes" className="text-[11px] font-semibold tracking-[2px] text-[var(--text-muted)] font-mono hover:text-[var(--text-primary)] transition-colors">
            GAME MODES
          </Link>
          <Link href="/rules" className="text-[11px] font-semibold tracking-[2px] text-[var(--text-muted)] font-mono hover:text-[var(--text-primary)] transition-colors">
            RULES
          </Link>
          <Link href="/about" className="text-[11px] font-semibold tracking-[2px] text-[var(--text-muted)] font-mono hover:text-[var(--text-primary)] transition-colors">
            ABOUT
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Theme Toggle */}
          <ThemeToggle size="sm" />

          {/* Desktop Buttons */}
          <Link
            href="/login"
            className="hidden sm:flex hover:border-[#FF0000] hover:bg-[#FF0000]/5 transition-all duration-200"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '44px',
              minWidth: '100px',
              paddingLeft: '28px',
              paddingRight: '28px',
              border: '1px solid var(--border-default)',
              borderRadius: '3px',
              textDecoration: 'none',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', color: 'var(--text-primary)', fontFamily: 'var(--font-space-mono), monospace', whiteSpace: 'nowrap' }}>LOG IN</span>
          </Link>
          <Link
            href="/lobby/create"
            className="hidden sm:flex hover:bg-[#E50000] hover:shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-all duration-200"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '44px',
              minWidth: '140px',
              paddingLeft: '28px',
              paddingRight: '28px',
              backgroundColor: '#FF0000',
              borderRadius: '3px',
              textDecoration: 'none',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', color: '#0C0C0C', fontFamily: 'var(--font-space-mono), monospace', whiteSpace: 'nowrap' }}>CREATE LOBBY</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 bg-transparent border border-[var(--border-default)] rounded"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-[var(--text-primary)]" />
            ) : (
              <Menu className="w-5 h-5 text-[var(--text-primary)]" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden fixed inset-x-0 top-[72px] z-50 bg-[var(--bg-primary)] border-b border-[var(--border-default)]"
            style={{ padding: '24px' }}
          >
            <nav className="flex flex-col gap-4">
              <Link
                href="#modes"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[13px] font-semibold tracking-[2px] text-[var(--text-muted)] font-mono hover:text-[var(--text-primary)] py-3 border-b border-[var(--border-subtle)]"
              >
                GAME MODES
              </Link>
              <Link
                href="/rules"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[13px] font-semibold tracking-[2px] text-[var(--text-muted)] font-mono hover:text-[var(--text-primary)] py-3 border-b border-[var(--border-subtle)]"
              >
                RULES
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[13px] font-semibold tracking-[2px] text-[var(--text-muted)] font-mono hover:text-[var(--text-primary)] py-3 border-b border-[var(--border-subtle)]"
              >
                ABOUT
              </Link>
              <div className="flex flex-col gap-3 pt-4">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center h-[48px] border border-[var(--border-default)] rounded text-[12px] font-semibold tracking-[1.5px] text-[var(--text-primary)] font-mono"
                >
                  LOG IN
                </Link>
                <Link
                  href="/lobby/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center h-[48px] bg-[#FF0000] rounded text-[12px] font-bold tracking-[1.5px] text-[#0C0C0C] font-mono"
                >
                  CREATE LOBBY
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section - padding [120, 64], gap 32 */}
      <section className="w-full min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-8 lg:px-16 py-16 sm:py-[120px]">
        <motion.div
          className="flex flex-col items-center gap-6 sm:gap-8 text-center max-w-5xl"
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          {/* Hero Tag */}
          <motion.div
            variants={fadeInUp}
            className="px-4 sm:px-6 py-2 sm:py-3 border border-[#FF0000]"
          >
            <span className="text-[9px] sm:text-[11px] font-semibold tracking-[2px] sm:tracking-[3px] text-[#FF0000] font-mono">
              VALORANT DRINKING GAME + STRAT ROULETTE
            </span>
          </motion.div>

          {/* Hero Headline */}
          <motion.div variants={fadeInUp} className="flex flex-col items-center gap-2 sm:gap-4">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[96px] font-extrabold text-[var(--text-primary)] leading-none" style={{ letterSpacing: '-2px' }}>
              SELECT YOUR
            </h1>
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[132px] font-extrabold text-[#FF0000] leading-none" style={{ letterSpacing: '-3px' }}>
              POISON
            </h1>
          </motion.div>

          {/* Hero Sub */}
          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg md:text-xl text-[var(--text-muted)] font-mono max-w-md px-4"
            style={{ letterSpacing: '1px' }}
          >
            Cold rules. Chaotic outcomes. No mercy.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center w-full sm:w-auto px-4 sm:px-0" style={{ gap: '16px', marginTop: '32px' }}>
            <Link
              href="/lobby/create"
              className="group hover:bg-[#E50000] hover:shadow-[0_0_30px_rgba(255,0,0,0.4)] hover:scale-[1.02] transition-all duration-200 w-full sm:w-auto"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                height: '56px',
                minWidth: '200px',
                paddingLeft: '32px',
                paddingRight: '32px',
                backgroundColor: '#FF0000',
                borderRadius: '3px',
                textDecoration: 'none',
              }}
            >
              <Play style={{ width: '20px', height: '20px', color: '#0C0C0C', fill: '#0C0C0C' }} />
              <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2px', color: '#0C0C0C', fontFamily: 'var(--font-space-mono), monospace', whiteSpace: 'nowrap' }}>START GAME</span>
            </Link>
            <Link
              href="#how"
              className="hover:border-[#FF0000] hover:bg-[#FF0000]/5 transition-all duration-200 w-full sm:w-auto"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '56px',
                minWidth: '200px',
                paddingLeft: '32px',
                paddingRight: '32px',
                border: '1px solid var(--border-default)',
                borderRadius: '3px',
                textDecoration: 'none',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '2px', color: 'var(--text-primary)', fontFamily: 'var(--font-space-mono), monospace', whiteSpace: 'nowrap' }}>HOW IT WORKS</span>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Game Modes Section */}
      <section id="modes" className="py-20 sm:py-32 lg:py-40 bg-[var(--bg-primary)]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          <motion.div
            className="flex flex-col items-center text-center mb-12 sm:mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[3px] sm:tracking-[4px] text-[#FF0000] font-mono mb-4 sm:mb-5">
              GAME MODES
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-[var(--text-primary)] mb-4 sm:mb-6" style={{ letterSpacing: '-2px' }}>
              CHOOSE YOUR CHAOS
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] font-mono leading-relaxed max-w-[600px] px-4">
              Four ways to suffer. Pick your poison or combine them for maximum destruction.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {gameModes.map((mode, index) => (
              <motion.div
                key={mode.id}
                className="border border-[var(--border-default)] hover:border-[var(--border-hover)] p-6 sm:p-8 lg:p-10 flex flex-col gap-5 sm:gap-6 transition-colors duration-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: mode.iconBg }}>
                    {mode.icon}
                  </div>
                  <span className="text-[10px] font-semibold tracking-[2px] text-[var(--text-muted)] font-mono">
                    MODE {String.fromCharCode(65 + index)}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-[22px] font-bold text-[var(--text-primary)]" style={{ letterSpacing: '1px' }}>{mode.title}</h3>
                <p className="text-[13px] sm:text-[14px] text-[var(--text-muted)] font-mono leading-relaxed">
                  {mode.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="py-20 sm:py-32 lg:py-40 bg-[var(--bg-secondary)]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          <motion.div
            className="flex flex-col items-center text-center mb-12 sm:mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[3px] sm:tracking-[4px] text-[#FF0000] font-mono mb-4 sm:mb-5">
              HOW IT WORKS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-[var(--text-primary)]" style={{ letterSpacing: '-2px' }}>
              FROM LOBBY TO CHAOS
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="flex flex-col gap-4 sm:gap-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-[#FF0000] leading-none" style={{ letterSpacing: '-2px' }}>
                  {step.number}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]" style={{ letterSpacing: '1px' }}>{step.title}</h3>
                <p className="text-[13px] sm:text-[14px] text-[var(--text-muted)] font-mono leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent Rules Section */}
      <section id="agents" className="py-20 sm:py-32 lg:py-40 bg-[var(--bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12">
          <motion.div
            className="flex flex-col items-center text-center mb-12 sm:mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[3px] sm:tracking-[4px] text-[#FF0000] font-mono mb-4 sm:mb-5">
              AGENT RULES
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-[var(--text-primary)] mb-4 sm:mb-6" style={{ letterSpacing: '-2px' }}>
              EVERY AGENT HAS A PRICE
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] font-mono leading-relaxed max-w-[600px] px-4">
              Your main determines your pain. Lock in your agent or roll a Poison Agent for chaos.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {agentExamples.map((agent, index) => (
              <motion.div
                key={agent.name}
                className="border border-[var(--border-default)] overflow-hidden rounded transition-colors duration-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Agent header */}
                <div className="h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6" style={{ backgroundColor: agent.color }}>
                  <span className="text-sm sm:text-base font-extrabold tracking-[2px]" style={{ color: agent.textColor }}>
                    {agent.name.toUpperCase()}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-semibold tracking-[1px] font-mono opacity-70" style={{ color: agent.textColor }}>
                    {agent.role}
                  </span>
                </div>
                {/* Agent rules */}
                <div className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 bg-[var(--bg-tertiary)]">
                  {agent.rules.map((rule, i) => (
                    <div key={i} className="flex items-start sm:items-center gap-3">
                      <div className="w-1 h-1 rounded-full flex-shrink-0 mt-2 sm:mt-0" style={{ backgroundColor: agent.color }} />
                      <span className="text-[12px] sm:text-[13px] text-[var(--text-secondary)] font-mono leading-relaxed">{rule}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Intensity Presets Section */}
      <section className="py-20 sm:py-32 lg:py-40 bg-[var(--bg-secondary)]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          <motion.div
            className="flex flex-col items-center text-center mb-12 sm:mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[3px] sm:tracking-[4px] text-[#FF0000] font-mono mb-4 sm:mb-5">
              INTENSITY LEVELS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-[var(--text-primary)] mb-4 sm:mb-6" style={{ letterSpacing: '-2px' }}>
              PICK YOUR PAIN THRESHOLD
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] font-mono leading-relaxed max-w-[600px] px-4">
              From casual night to absolute destruction. One click setup.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {presets.map((preset, index) => (
              <motion.div
                key={preset.id}
                className="p-6 sm:p-8 lg:p-10 flex flex-col gap-4 sm:gap-5"
                style={{
                  border: preset.isPopular ? '2px solid #FF0000' : '1px solid var(--border-default)',
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-[12px] sm:text-[13px] font-bold tracking-[3px]" style={{ color: preset.rankColor }}>
                  {preset.rank}
                </span>
                <h3 className="text-lg sm:text-xl lg:text-[22px] font-bold text-[var(--text-primary)]" style={{ letterSpacing: '1px' }}>{preset.title}</h3>
                <p className="text-[13px] sm:text-[14px] text-[var(--text-muted)] font-mono leading-relaxed">{preset.description}</p>
                {preset.isPopular && (
                  <div className="mt-auto pt-4 sm:pt-6">
                    <span className="inline-block px-4 py-2 sm:px-5 sm:py-2.5 bg-[#FF0000] text-[10px] sm:text-[11px] font-bold text-[#0C0C0C] font-mono tracking-[1px]">
                      RECOMMENDED FOR CHAOS
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 sm:py-32 lg:py-48 bg-[var(--bg-primary)]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center gap-6 sm:gap-8 lg:gap-10"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-[var(--text-primary)]" style={{ letterSpacing: '-2px' }}>
              READY TO SUFFER?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-[var(--text-muted)] font-mono leading-relaxed max-w-[500px] px-4">
              Create a lobby. Invite your squad. No mercy.
            </p>
            <Link
              href="/lobby/create"
              className="group hover:bg-[#E50000] hover:shadow-[0_0_40px_rgba(255,0,0,0.5)] hover:scale-[1.02] transition-all duration-200 w-full sm:w-auto"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                height: '56px',
                minWidth: '220px',
                paddingLeft: '32px',
                paddingRight: '32px',
                backgroundColor: '#FF0000',
                borderRadius: '3px',
                marginTop: '16px',
                textDecoration: 'none',
              }}
            >
              <Zap style={{ width: '20px', height: '20px', color: '#0C0C0C' }} />
              <span className="text-[13px] sm:text-[14px] font-bold tracking-[2px] text-[#0C0C0C] font-mono whitespace-nowrap">CREATE LOBBY NOW</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 lg:py-20 bg-[var(--bg-secondary)] border-t border-[var(--border-default)]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-10 sm:gap-12 lg:gap-14">
            <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-16">
              {/* footerBrand */}
              <div className="flex flex-col gap-4 sm:gap-5">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FF0000] flex items-center justify-center">
                    <Skull className="w-5 h-5 sm:w-6 sm:h-6 text-[#0C0C0C]" />
                  </div>
                  <span className="text-sm sm:text-base font-bold text-[var(--text-primary)] tracking-[2px]">
                    SELECT YOUR POISON
                  </span>
                </div>
                <p className="text-[13px] sm:text-[14px] text-[var(--text-muted)] font-mono leading-relaxed">
                  Cold rules. Chaotic outcomes.
                </p>
              </div>

              {/* footerLinks */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-20">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-[#FF0000] font-mono tracking-[2px] mb-1">GAME</span>
                  <Link href="#modes" className="text-[13px] sm:text-[14px] text-[var(--text-muted)] font-mono hover:text-[var(--text-primary)] transition-colors">Game Modes</Link>
                  <Link href="#agents" className="text-[13px] sm:text-[14px] text-[var(--text-muted)] font-mono hover:text-[var(--text-primary)] transition-colors">Agent Rules</Link>
                  <Link href="/rules" className="text-[13px] sm:text-[14px] text-[var(--text-muted)] font-mono hover:text-[var(--text-primary)] transition-colors">Strat Library</Link>
                </div>
                <div className="flex flex-col gap-3 sm:gap-4">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-[#FF0000] font-mono tracking-[2px] mb-1">SUPPORT</span>
                  <Link href="#how" className="text-[13px] sm:text-[14px] text-[var(--text-muted)] font-mono hover:text-[var(--text-primary)] transition-colors">How to Play</Link>
                  <Link href="/about" className="text-[13px] sm:text-[14px] text-[var(--text-muted)] font-mono hover:text-[var(--text-primary)] transition-colors">FAQ</Link>
                  <Link href="/about" className="text-[13px] sm:text-[14px] text-[var(--text-muted)] font-mono hover:text-[var(--text-primary)] transition-colors">Contact</Link>
                </div>
                <div className="flex flex-col gap-3 sm:gap-4 col-span-2 sm:col-span-1">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-[#FF0000] font-mono tracking-[2px] mb-1">LEGAL</span>
                  <Link href="/terms" className="text-[13px] sm:text-[14px] text-[var(--text-muted)] font-mono hover:text-[var(--text-primary)] transition-colors">Terms of Service</Link>
                  <Link href="/privacy" className="text-[13px] sm:text-[14px] text-[var(--text-muted)] font-mono hover:text-[var(--text-primary)] transition-colors">Privacy Policy</Link>
                  <Link href="/responsible" className="text-[13px] sm:text-[14px] text-[var(--text-muted)] font-mono hover:text-[var(--text-primary)] transition-colors">Drink Responsibly</Link>
                </div>
              </div>
            </div>

            {/* footerBottom */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-5 pt-8 sm:pt-10 border-t border-[var(--border-default)]">
              <span className="text-[11px] sm:text-[12px] text-[var(--text-muted)] font-mono text-center sm:text-left">
                © {new Date().getFullYear()} SELECT YOUR POISON. Valorant is a trademark of Riot Games, Inc. Not affiliated with or endorsed by Riot Games.
              </span>
              <span className="text-[11px] sm:text-[12px] font-semibold text-[#FF0000] font-mono tracking-[1px]">
                21+ ONLY. PLEASE DRINK RESPONSIBLY.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

// Data
const gameModes = [
  {
    id: 'agent_poison',
    title: 'AGENT POISON',
    icon: <User className="w-6 h-6 text-white" />,
    iconBg: '#7C3AED',
    description: 'Each agent defines how pain is distributed. Jett mains drink double. Reyna players kill or suffer. Cypher gets secret punishments.',
  },
  {
    id: 'strat_roulette',
    title: 'STRAT ROULETTE',
    icon: <Dices className="w-6 h-6 text-white" />,
    iconBg: '#FF0000',
    description: 'Roll cursed strats before each round. "Knife out until first contact." "All utils used instantly." Failure = drinks.',
  },
  {
    id: 'challenges',
    title: 'CHALLENGES',
    icon: <Target className="w-6 h-6 text-[#0C0C0C]" />,
    iconBg: '#F59E0B',
    description: 'Optional side chaos. "Get a kill while flashed." "Ace attempt." "Clutch or finish drink." Personal or team-wide.',
  },
  {
    id: 'punishment',
    title: 'PUNISHMENT',
    icon: <Skull className="w-6 h-6 text-white" />,
    iconBg: '#EF4444',
    description: 'Post-round or post-game. Bottom frag drinks X. Most deaths = finish. Least damage = truth or drink. No mercy.',
  },
];

const steps = [
  {
    number: '01',
    title: 'CREATE LOBBY',
    description: 'Host creates a session, picks game modes, sets intensity level, and shares the lobby code.',
  },
  {
    number: '02',
    title: 'PICK YOUR POISON',
    description: 'Players join, select their agent, choose drink type (shot/sip/beer), and lock in.',
  },
  {
    number: '03',
    title: 'PLAY VALORANT',
    description: 'Roll strats, track deaths in real-time, assign punishments. Everything syncs across all phones.',
  },
  {
    number: '04',
    title: 'SUFFER TOGETHER',
    description: 'End-game stats, hall of shame leaderboards, and bragging rights. Until next time.',
  },
];

const agentExamples = [
  {
    name: 'Jett',
    role: 'DUELIST',
    color: '#7DD3FC',
    textColor: '#0C0C0C',
    rules: [
      'Die first → double drink',
      'Miss Op shot → sip',
      'Dash into death → finish',
    ],
  },
  {
    name: 'Reyna',
    role: 'DUELIST',
    color: '#A855F7',
    textColor: '#FFFFFF',
    rules: [
      'No kill in round → drink',
      'Dismiss without kill → drink',
      '"Watch this" then die → finish',
    ],
  },
  {
    name: 'Phoenix',
    role: 'DUELIST',
    color: '#F97316',
    textColor: '#0C0C0C',
    rules: [
      'Ult dies → finish drink',
      'Flash teammates → sip each',
      '"Come on, let\'s go!" → drink',
    ],
  },
  {
    name: 'Cypher',
    role: 'SENTINEL',
    color: '#E5E5E5',
    textColor: '#0C0C0C',
    rules: [
      'One secret rule revealed mid-game',
      'Cam destroyed → drink',
      '"I know exactly where you are" → sip',
    ],
  },
];

const presets = [
  {
    id: 'iron',
    rank: 'IRON',
    rankColor: '#78716C',
    title: 'CASUAL NIGHT',
    description: 'Light rules, easy pace. Perfect for beginners or chill sessions.',
    isPopular: false,
  },
  {
    id: 'gold',
    rank: 'GOLD',
    rankColor: '#EAB308',
    title: 'LAN PARTY',
    description: 'Balanced chaos. Strats every few rounds, moderate punishments.',
    isPopular: false,
  },
  {
    id: 'diamond',
    rank: 'DIAMOND',
    rankColor: '#A855F7',
    title: 'UNHINGED',
    description: 'Strats every round, harsh punishments, challenges active. Not for the weak.',
    isPopular: false,
  },
  {
    id: 'radiant',
    rank: 'RADIANT',
    rankColor: '#FF0000',
    title: 'RADIANT PAIN',
    description: 'Maximum suffering. All modes active. Multiplied punishments. Proceed with caution.',
    isPopular: true,
  },
];
