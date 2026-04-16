'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Heart,
  Coffee,
  Github,
  Mail,
  Sparkles,
  Skull,
  ExternalLink,
  Rocket,
  Code2,
  Briefcase,
  Zap,
  Globe,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0C0C0C]">
      {/* Header */}
      <header className="h-[72px] flex items-center justify-between px-6 sm:px-10 lg:px-16 border-b border-[#222222]">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF0000] flex items-center justify-center">
            <Skull className="w-6 h-6 text-[#0C0C0C]" />
          </div>
          <span className="text-sm font-bold tracking-[3px] text-white">SYP</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2.5 px-6 py-3 border border-[#333333] text-white text-[11px] font-semibold tracking-[2px] font-mono hover:border-[#FF0000] active:scale-[0.97] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK
        </Link>
      </header>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-36 pb-20 sm:pb-28">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center gap-8"
          >
            <span className="text-[11px] font-semibold tracking-[5px] text-[#FF0000] font-mono">
              THE STORY
            </span>
            <h1 className="text-[clamp(3rem,8vw,5rem)] font-extrabold text-white tracking-tight leading-none">
              ABOUT SYP
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Personal Message */}
      <section className="pb-24 sm:pb-32">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 sm:p-12 lg:p-16 bg-[#1A1A1A] border border-[#2A2A2A]"
          >
            <div className="flex flex-col gap-8">
              <p className="text-xl sm:text-2xl text-white leading-relaxed">Hey there!</p>
              <p className="text-[15px] sm:text-base text-[#999999] leading-[2]">
                I&apos;m a developer and creator on a mission to build things that matter.
                Select Your Poison is just one part of a bigger picture — a passion project
                born from my love for gaming and bringing people together.
              </p>
              <p className="text-[15px] sm:text-base text-[#999999] leading-[2]">
                At its core, this app is about one thing: <span className="text-white font-semibold">having fun</span>.
                Whether you&apos;re running it back with the squad after a long day, or trying
                to convince your Jett main friend that they&apos;re actually a liability when
                they&apos;re three drinks deep — I just want people to enjoy themselves.
              </p>
              <p className="text-[15px] sm:text-base text-[#999999] leading-[2]">
                But SYP is just the beginning. I&apos;m actively building more projects, working
                towards starting a company that creates products that genuinely help people.
                Every bit of support helps me move closer to that dream.
              </p>
              <p className="text-xl sm:text-2xl text-white leading-relaxed mt-4">
                Thanks for being here. Now go queue up and get ready to drink.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Vision Section */}
      <section className="py-24 sm:py-32 bg-[#0A0A0A]">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col gap-10 sm:gap-12"
          >
            <div className="flex items-center gap-5">
              <Rocket className="w-7 h-7 text-[#7C3AED]" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                The Bigger Picture
              </h2>
            </div>
            <p className="text-[15px] sm:text-base text-[#999999] leading-[2]">
              SYP is just one of many projects I&apos;m building. I love creating things
              that people actually enjoy using — whether it&apos;s apps, tools, or experiences.
              Every project teaches me something new and brings me closer to my goals.
            </p>
            <p className="text-sm text-[#777777] leading-[2] italic max-w-[640px]">
              More projects are always in the works. Supporting me helps bring these ideas to life
              and lets me continue building things that people love.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Nimbus - Portfolio & Services Section */}
      <section className="py-24 sm:py-32">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-10 sm:gap-12"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-[#22D3EE] flex items-center justify-center">
                <Zap className="w-7 h-7 text-[#0C0C0C]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Nimbus
                </h2>
                <span className="text-xs font-semibold tracking-[2px] text-[#22D3EE] font-mono">
                  PORTFOLIO & SERVICES
                </span>
              </div>
            </div>

            <p className="text-[15px] sm:text-base text-[#999999] leading-[2]">
              <span className="text-white font-semibold">Nimbus</span> is my personal portfolio
              and freelance service. I specialize in building SaaS products, web applications,
              and custom software solutions. If you need something built, let&apos;s talk.
            </p>

            <div className="p-8 sm:p-12 bg-[#1A1A1A] border-2 border-[#22D3EE] flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <Code2 className="w-6 h-6 text-[#22D3EE]" />
                <span className="text-base sm:text-lg font-bold text-white">What I Can Build For You</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  'SaaS Products',
                  'Full-stack Web Apps',
                  'MVP Development',
                  'Product Design & UI/UX',
                  'API Design & Integration',
                  'Technical Consulting'
                ].map((skill) => (
                  <div key={skill} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-[#22D3EE] shrink-0" />
                    <span className="text-sm text-[#CCCCCC] font-mono">{skill}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-4 mt-4">
                <a
                  href="mailto:hello@selectyourpoison.gg"
                  className="inline-flex items-center justify-center gap-3.5 py-4.5 px-10 bg-[#22D3EE] text-[#0C0C0C] text-sm font-bold tracking-[2px] no-underline self-start hover:bg-[#06B6D4] active:scale-[0.97] transition-all"
                >
                  <Briefcase className="w-[18px] h-[18px]" />
                  WORK WITH ME
                </a>
                <span className="text-xs text-[#777777] font-mono">
                  Let&apos;s build something amazing together
                </span>
              </div>
            </div>

            <a
              href="https://nimbus-studio-1.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 py-5 px-8 border border-[#333333] text-white text-sm font-semibold tracking-[1px] font-mono no-underline self-start hover:border-[#7C3AED] active:scale-[0.97] transition-all"
            >
              <Globe className="w-5 h-5 text-[#7C3AED]" />
              VIEW NIMBUS PORTFOLIO
              <ExternalLink className="w-4 h-4 text-[#666666]" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-24 sm:py-32 bg-[#0A0A0A]">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-col gap-10 sm:gap-12"
          >
            <div className="flex items-center gap-5">
              <Heart className="w-7 h-7 text-[#FF0000]" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Support My Journey
              </h2>
            </div>
            <p className="text-[15px] sm:text-base text-[#999999] leading-[2]">
              If you enjoy using SYP or any of my projects, consider supporting the journey.
              Every contribution helps me dedicate more time to building useful tools,
              shipping more projects, and growing Nimbus into a company that creates
              products that genuinely help people.
            </p>

            <div className="p-8 bg-[rgba(255,0,0,0.05)] border border-[rgba(255,0,0,0.3)] flex flex-col gap-5">
              <span className="text-[13px] font-semibold text-[#FF0000] font-mono tracking-[1px]">
                YOUR SUPPORT ENABLES:
              </span>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-6">
                {[
                  'More free projects like SYP',
                  'Better features & updates',
                  'Growing Nimbus into a full company',
                  'Building products that help people'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-[#FF0000] shrink-0" />
                    <span className="text-[13px] text-[#CCCCCC] font-mono">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <a
                href="https://ko-fi.com/heyitsnimbus"
                target="_blank"
                rel="noopener noreferrer"
                className="p-10 sm:p-12 bg-[#1A1A1A] border border-[#2A2A2A] flex flex-col items-center gap-6 no-underline hover:border-[#F59E0B] active:scale-[0.98] transition-all"
              >
                <Coffee className="w-14 h-14 text-[#F59E0B]" />
                <div className="text-center">
                  <span className="block text-lg font-bold text-white mb-2">Buy Me a Coffee</span>
                  <span className="text-sm text-[#777777]">One-time support</span>
                </div>
                <ExternalLink className="w-4 h-4 text-[#555555]" />
              </a>
              <a
                href="https://ko-fi.com/heyitsnimbus"
                target="_blank"
                rel="noopener noreferrer"
                className="p-10 sm:p-12 bg-[#1A1A1A] border border-[#2A2A2A] flex flex-col items-center gap-6 no-underline hover:border-[#FF0000] active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-14 h-14 text-[#FF0000]" />
                <div className="text-center">
                  <span className="block text-lg font-bold text-white mb-2">Monthly Support</span>
                  <span className="text-sm text-[#777777]">Recurring via Ko-fi</span>
                </div>
                <ExternalLink className="w-4 h-4 text-[#555555]" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Spread the Word */}
      <section className="py-24 sm:py-32">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-8 sm:gap-10"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Spread the Word
            </h2>
            <p className="text-[15px] sm:text-base text-[#999999] leading-[2]">
              Not in a position to donate? No worries! Sharing SYP with your
              friends and community helps just as much. The more people playing,
              the more fun we all have.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 sm:py-32 bg-[#0A0A0A]">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-8 sm:gap-10"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Get in Touch
            </h2>
            <p className="text-[15px] sm:text-base text-[#999999] leading-[2]">
              Have feedback, suggestions, or just want to say hi? I&apos;d love to hear from you.
            </p>
            <div className="flex gap-5 flex-wrap">
              <a
                href="mailto:hello@selectyourpoison.gg"
                className="flex items-center gap-3 py-4 px-7 border border-[#333333] text-white text-[13px] font-semibold tracking-[1px] font-mono no-underline hover:border-[#FF0000] active:scale-[0.97] transition-all"
              >
                <Mail className="w-[18px] h-[18px] text-[#FF0000]" />
                EMAIL ME
              </a>
              <a
                href="https://github.com/CwCw0"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 py-4 px-7 border border-[#333333] text-white text-[13px] font-semibold tracking-[1px] font-mono no-underline hover:border-white active:scale-[0.97] transition-all"
              >
                <Github className="w-[18px] h-[18px]" />
                GITHUB
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-16 sm:py-24 border-t border-[#222222]">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-12 text-center">
          <p className="text-sm text-[#777777] flex items-center justify-center gap-2.5">
            Made with <Heart className="w-4 h-4 text-[#FF0000]" /> and way too many late nights
          </p>
          <p className="text-xs text-[#555555] mt-5">
            &copy; {new Date().getFullYear()} Select Your Poison. Not affiliated with Riot Games.
          </p>
        </div>
      </section>
    </main>
  );
}
