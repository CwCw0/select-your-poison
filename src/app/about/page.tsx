'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Heart,
  Coffee,
  Github,
  Twitter,
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
    <main style={{ minHeight: '100vh', backgroundColor: '#0C0C0C' }}>
      {/* Header */}
      <header style={{
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(16px, 4vw, 48px)',
        borderBottom: '1px solid #333333'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Skull style={{ width: '24px', height: '24px', color: '#0C0C0C' }} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '3px', color: '#FFFFFF' }}>
            SYP
          </span>
        </Link>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', border: '1px solid #333333', color: '#FFFFFF', fontSize: '11px', fontWeight: 600, letterSpacing: '2px', fontFamily: 'var(--font-space-mono), monospace' }}>
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          BACK
        </Link>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '100px 0 80px', backgroundColor: '#0C0C0C' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 48px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '4px', color: '#FF0000', fontFamily: 'var(--font-space-mono), monospace' }}>
              THE STORY
            </span>
            <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-3px', lineHeight: 1 }}>
              ABOUT SYP
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Personal Message */}
      <section style={{ padding: '0 0 100px', backgroundColor: '#0C0C0C' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 48px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              padding: 'clamp(24px, 4vw, 48px)',
              backgroundColor: '#1A1A1A',
              border: '1px solid #333333'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <p style={{ fontSize: '20px', color: '#FFFFFF', lineHeight: 1.8 }}>
                Hey there! 👋
              </p>
              <p style={{ fontSize: '16px', color: '#999999', lineHeight: 1.9 }}>
                I&apos;m a developer and creator on a mission to build things that matter.
                Select Your Poison is just one part of a bigger picture — a passion project
                born from my love for gaming and bringing people together.
              </p>
              <p style={{ fontSize: '16px', color: '#999999', lineHeight: 1.9 }}>
                At its core, this app is about one thing: <span style={{ color: '#FFFFFF', fontWeight: 600 }}>having fun</span>.
                Whether you&apos;re running it back with the squad after a long day, or trying
                to convince your Jett main friend that they&apos;re actually a liability when
                they&apos;re three drinks deep — I just want people to enjoy themselves.
              </p>
              <p style={{ fontSize: '16px', color: '#999999', lineHeight: 1.9 }}>
                But SYP is just the beginning. I&apos;m actively building more projects, working
                towards starting a company that creates products that genuinely help people.
                Every bit of support helps me move closer to that dream.
              </p>
              <p style={{ fontSize: '20px', color: '#FFFFFF', lineHeight: 1.8, marginTop: '8px' }}>
                Thanks for being here. Now go queue up and get ready to drink. 🍻
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Vision Section */}
      <section style={{ padding: '100px 0', backgroundColor: '#0A0A0A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 48px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Rocket style={{ width: '28px', height: '28px', color: '#7C3AED' }} />
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-1px' }}>
                The Bigger Picture
              </h2>
            </div>
            <p style={{ fontSize: '16px', color: '#999999', lineHeight: 1.8, maxWidth: '600px' }}>
              SYP is just one of many projects I&apos;m building. I love creating things
              that people actually enjoy using — whether it&apos;s apps, tools, or experiences.
              Every project teaches me something new and brings me closer to my goals.
            </p>

            <p style={{ fontSize: '14px', color: '#999999', lineHeight: 1.8, fontStyle: 'italic' }}>
              More projects are always in the works. Supporting me helps bring these ideas to life
              and lets me continue building things that people love.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Nimbus - Portfolio & Services Section */}
      <section style={{ padding: '100px 0', backgroundColor: '#0C0C0C' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 48px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#22D3EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap style={{ width: '26px', height: '26px', color: '#0C0C0C' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-1px' }}>
                  Nimbus
                </h2>
                <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', color: '#22D3EE', fontFamily: 'var(--font-space-mono), monospace' }}>
                  PORTFOLIO & SERVICES
                </span>
              </div>
            </div>

            <p style={{ fontSize: '16px', color: '#999999', lineHeight: 1.8, maxWidth: '600px' }}>
              <span style={{ color: '#FFFFFF', fontWeight: 600 }}>Nimbus</span> is my personal portfolio
              and freelance service. I specialize in building SaaS products, web applications,
              and custom software solutions. If you need something built, let&apos;s talk.
            </p>

            <div
              style={{
                padding: '40px',
                backgroundColor: '#1A1A1A',
                border: '2px solid #22D3EE',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Code2 style={{ width: '24px', height: '24px', color: '#22D3EE' }} />
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>
                  What I Can Build For You
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '16px' }}>
                {[
                  'SaaS Products',
                  'Full-stack Web Apps',
                  'MVP Development',
                  'Product Design & UI/UX',
                  'API Design & Integration',
                  'Technical Consulting'
                ].map((skill) => (
                  <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#22D3EE' }} />
                    <span style={{ fontSize: '14px', color: '#CCCCCC', fontFamily: 'var(--font-space-mono), monospace' }}>
                      {skill}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                <a
                  href="mailto:heyitsnimbus@gmail.com"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    padding: '16px 32px',
                    backgroundColor: '#22D3EE',
                    color: '#0C0C0C',
                    fontSize: '14px',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    textDecoration: 'none',
                    alignSelf: 'flex-start',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <Briefcase style={{ width: '18px', height: '18px' }} />
                  WORK WITH ME
                </a>
                <span style={{ fontSize: '12px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace' }}>
                  Let&apos;s build something amazing together
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '20px 28px',
                border: '1px solid #333333',
                color: '#666666',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '1px',
                fontFamily: 'var(--font-space-mono), monospace',
                alignSelf: 'flex-start',
                opacity: 0.6,
                cursor: 'default',
              }}
            >
              <Globe style={{ width: '20px', height: '20px', color: '#555555' }} />
              NIMBUS PORTFOLIO — COMING SOON
            </div>
          </motion.div>
        </div>
      </section>

      {/* Support Section */}
      <section style={{ padding: '100px 0', backgroundColor: '#0A0A0A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 48px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Heart style={{ width: '28px', height: '28px', color: '#FF0000' }} />
              <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-1px' }}>
                Support My Journey
              </h2>
            </div>
            <p style={{ fontSize: '16px', color: '#999999', lineHeight: 1.8, maxWidth: '600px' }}>
              If you enjoy using SYP or any of my projects, consider supporting the journey.
              Every contribution helps me dedicate more time to building useful tools,
              shipping more projects, and growing Nimbus into a company that creates
              products that genuinely help people.
            </p>

            <div
              style={{
                padding: '24px',
                backgroundColor: 'rgba(255, 0, 0, 0.06)',
                border: '1px solid #FF0000',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#FF0000', fontFamily: 'var(--font-space-mono), monospace' }}>
                YOUR SUPPORT ENABLES:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {[
                  'More free projects like SYP',
                  'Better features & updates',
                  'Growing Nimbus into a full company',
                  'Building products that help people'
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '6px', height: '6px', backgroundColor: '#FF0000' }} />
                    <span style={{ fontSize: '13px', color: '#CCCCCC', fontFamily: 'var(--font-space-mono), monospace' }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '24px' }}>
              <a
                href="https://ko-fi.com/heyitsnimbus"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '40px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333333',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#F59E0B'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#333333'}
              >
                <Coffee style={{ width: '48px', height: '48px', color: '#F59E0B' }} />
                <div style={{ textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '18px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                    Buy Me a Coffee
                  </span>
                  <span style={{ fontSize: '13px', color: '#999999' }}>One-time support</span>
                </div>
                <ExternalLink style={{ width: '16px', height: '16px', color: '#999999' }} />
              </a>
              <a
                href="https://patreon.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '40px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333333',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '20px',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#FF0000'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#333333'}
              >
                <Sparkles style={{ width: '48px', height: '48px', color: '#FF0000' }} />
                <div style={{ textAlign: 'center' }}>
                  <span style={{ display: 'block', fontSize: '18px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                    Become a Patron
                  </span>
                  <span style={{ fontSize: '13px', color: '#999999' }}>Monthly support</span>
                </div>
                <ExternalLink style={{ width: '16px', height: '16px', color: '#999999' }} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Spread the Word */}
      <section style={{ padding: '100px 0', backgroundColor: '#0C0C0C' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 48px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-1px' }}>
              Spread the Word
            </h2>
            <p style={{ fontSize: '16px', color: '#999999', lineHeight: 1.8, maxWidth: '600px' }}>
              Not in a position to donate? No worries! Sharing SYP with your
              friends and community helps just as much. The more people playing,
              the more fun we all have.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a
                href="https://twitter.com/intent/tweet?text=Check%20out%20Select%20Your%20Poison%20-%20a%20Valorant%20drinking%20game%20tracker!&url=https://selectyourpoison.gg"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 24px',
                  border: '1px solid #333333',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '1px',
                  fontFamily: 'var(--font-space-mono), monospace',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#1DA1F2'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#333333'}
              >
                <Twitter style={{ width: '18px', height: '18px', color: '#1DA1F2' }} />
                SHARE ON TWITTER
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ padding: '100px 0', backgroundColor: '#0A0A0A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 48px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-1px' }}>
              Get in Touch
            </h2>
            <p style={{ fontSize: '16px', color: '#999999', lineHeight: 1.8, maxWidth: '600px' }}>
              Have feedback, suggestions, or just want to say hi? I&apos;d love to hear from you.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a
                href="mailto:heyitsnimbus@gmail.com"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 24px',
                  border: '1px solid #333333',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '1px',
                  fontFamily: 'var(--font-space-mono), monospace',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#FF0000'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#333333'}
              >
                <Mail style={{ width: '18px', height: '18px', color: '#FF0000' }} />
                EMAIL ME
              </a>
              <a
                href="https://github.com/CwCw0"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 24px',
                  border: '1px solid #333333',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '1px',
                  fontFamily: 'var(--font-space-mono), monospace',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#FFFFFF'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#333333'}
              >
                <Github style={{ width: '18px', height: '18px' }} />
                GITHUB
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 24px',
                  border: '1px solid #333333',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '1px',
                  fontFamily: 'var(--font-space-mono), monospace',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#1DA1F2'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#333333'}
              >
                <Twitter style={{ width: '18px', height: '18px', color: '#1DA1F2' }} />
                TWITTER
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <section style={{ padding: '80px 0', backgroundColor: '#0C0C0C', borderTop: '1px solid #333333' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 48px)', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#999999', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            Made with <Heart style={{ width: '16px', height: '16px', color: '#FF0000' }} /> and way too many late nights
          </p>
          <p style={{ fontSize: '12px', color: '#999999', marginTop: '16px' }}>
            © {new Date().getFullYear()} Select Your Poison. Not affiliated with Riot Games.
          </p>
        </div>
      </section>
    </main>
  );
}
