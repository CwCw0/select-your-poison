import type { Metadata } from 'next';
import Link from 'next/link';
import { Skull, ArrowLeft, Heart, Droplets, Car, Coffee, Phone, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Drink Responsibly | SELECT YOUR POISON',
};

export default function ResponsiblePage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0C0C0C' }}>
      {/* Header */}
      <header style={{
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(16px, 4vw, 48px)',
        borderBottom: '1px solid #333333',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#FF0000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Skull style={{ width: '24px', height: '24px', color: '#0C0C0C' }} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '3px', color: '#FFFFFF' }}>
            SYP
          </span>
        </Link>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            border: '1px solid #333333',
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '2px',
            fontFamily: 'var(--font-space-mono), monospace',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          BACK
        </Link>
      </header>

      {/* Hero */}
      <section style={{ padding: '100px 0 80px', backgroundColor: '#0C0C0C' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 48px)' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '4px',
            color: '#FF0000',
            fontFamily: 'var(--font-space-mono), monospace',
            display: 'block',
            marginBottom: '24px',
          }}>
            IMPORTANT
          </span>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 4rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-3px',
            lineHeight: 1,
            marginBottom: '24px',
          }}>
            DRINK RESPONSIBLY
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#999999',
            lineHeight: 1.8,
            maxWidth: '600px',
            fontFamily: 'var(--font-space-mono), monospace',
          }}>
            Select Your Poison is about having fun with your squad. Your health and safety always come first.
          </p>
        </div>
      </section>

      {/* Safety Warning Banner */}
      <section style={{ padding: '0 0 80px', backgroundColor: '#0C0C0C' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 48px)' }}>
          <div style={{
            padding: '32px',
            backgroundColor: 'rgba(255, 0, 0, 0.06)',
            border: '2px solid #FF0000',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '20px',
          }}>
            <Heart style={{ width: '28px', height: '28px', color: '#FF0000', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#FF0000', letterSpacing: '2px' }}>
                LEGAL DRINKING AGE ONLY
              </span>
              <p style={{ fontSize: '15px', color: '#CCCCCC', lineHeight: 1.8, fontFamily: 'var(--font-space-mono), monospace' }}>
                This service is intended exclusively for adults of legal drinking age in your jurisdiction (18+ in most countries, 21+ in USA, 20+ in Japan/Thailand, 19+ in South Korea, etc.). If you are underage, please do not use this service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guidelines */}
      <section style={{ padding: '80px 0', backgroundColor: '#0A0A0A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 48px)' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-1px', marginBottom: '48px' }}>
            Guidelines for Safe Play
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Know Your Limits */}
            <div style={{
              padding: '32px',
              backgroundColor: '#1A1A1A',
              border: '1px solid #333333',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '24px',
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Users style={{ width: '28px', height: '28px', color: '#FF0000' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '1px' }}>
                  KNOW YOUR LIMITS
                </h3>
                <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.8, fontFamily: 'var(--font-space-mono), monospace' }}>
                  Everyone has different tolerances. There is no shame in skipping a drink, switching to water, or tapping out entirely. The game adapts to you, not the other way around. Use the Casual intensity mode if you want a lighter experience.
                </p>
              </div>
            </div>

            {/* Stay Hydrated */}
            <div style={{
              padding: '32px',
              backgroundColor: '#1A1A1A',
              border: '1px solid #333333',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '24px',
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Droplets style={{ width: '28px', height: '28px', color: '#3B82F6' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '1px' }}>
                  STAY HYDRATED
                </h3>
                <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.8, fontFamily: 'var(--font-space-mono), monospace' }}>
                  Drink water between rounds. Eat food before and during your session. Dehydration makes everything worse. Keep a water bottle next to your setup and take sips regularly.
                </p>
              </div>
            </div>

            {/* Never Drink and Drive */}
            <div style={{
              padding: '32px',
              backgroundColor: '#1A1A1A',
              border: '2px solid #F59E0B',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '24px',
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Car style={{ width: '28px', height: '28px', color: '#F59E0B' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#F59E0B', letterSpacing: '1px' }}>
                  NEVER DRINK AND DRIVE
                </h3>
                <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.8, fontFamily: 'var(--font-space-mono), monospace' }}>
                  This is non-negotiable. If you have been drinking, do not operate a vehicle. Use a rideshare service, call a friend, or stay where you are. Plan your transportation before you start playing. No game is worth risking your life or the lives of others.
                </p>
              </div>
            </div>

            {/* Non-Alcoholic Alternatives */}
            <div style={{
              padding: '32px',
              backgroundColor: '#1A1A1A',
              border: '1px solid #333333',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '24px',
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Coffee style={{ width: '28px', height: '28px', color: '#22C55E' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '1px' }}>
                  NON-ALCOHOLIC ALTERNATIVES WORK TOO
                </h3>
                <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.8, fontFamily: 'var(--font-space-mono), monospace' }}>
                  You do not need alcohol to play SYP. Swap drinks for water, soda, juice, energy drinks, or anything else. The game mechanics work the same regardless of what is in your cup. The chaos is in the rules, not the beverage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Point */}
      <section style={{ padding: '100px 0', backgroundColor: '#0C0C0C' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 48px)' }}>
          <div style={{
            padding: 'clamp(24px, 4vw, 48px)',
            backgroundColor: '#1A1A1A',
            border: '1px solid #333333',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#FF0000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Heart style={{ width: '32px', height: '32px', color: '#0C0C0C' }} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px' }}>
              THE POINT IS TO HAVE FUN WITH YOUR SQUAD
            </h2>
            <p style={{ fontSize: '16px', color: '#999999', lineHeight: 1.8, fontFamily: 'var(--font-space-mono), monospace', maxWidth: '500px' }}>
              SYP exists to make game nights more memorable, not more dangerous. Look out for your friends, check in on each other, and make sure everyone is having a good time. The best nights are the ones everyone remembers.
            </p>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section style={{ padding: '80px 0 100px', backgroundColor: '#0A0A0A' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 48px)' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-1px', marginBottom: '16px' }}>
            Global Resources
          </h2>
          <p style={{ fontSize: '15px', color: '#999999', lineHeight: 1.8, fontFamily: 'var(--font-space-mono), monospace', marginBottom: '40px' }}>
            If you or someone you know is struggling with alcohol, help is available worldwide. You are not alone.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Global/International */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FF0000', letterSpacing: '1px', marginBottom: '20px' }}>
                INTERNATIONAL
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  padding: '24px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333333',
                }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                    Alcoholics Anonymous (AA) Worldwide
                  </h4>
                  <a
                    href="https://www.aa.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '14px', fontWeight: 700, color: '#A855F7', fontFamily: 'var(--font-space-mono), monospace', textDecoration: 'none', display: 'block', marginBottom: '8px' }}
                  >
                    www.aa.org
                  </a>
                  <p style={{ fontSize: '13px', color: '#999999', lineHeight: 1.7, fontFamily: 'var(--font-space-mono), monospace' }}>
                    Find AA meetings in 180+ countries. Available in multiple languages.
                  </p>
                </div>
              </div>
            </div>

            {/* Asia-Pacific */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FF0000', letterSpacing: '1px', marginBottom: '20px' }}>
                ASIA-PACIFIC
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  padding: '24px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333333',
                }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                    Singapore • National Addictions Management Service
                  </h4>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#A855F7', fontFamily: 'var(--font-space-mono), monospace', marginBottom: '8px' }}>
                    6-732-6837
                  </p>
                </div>

                <div style={{
                  padding: '24px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333333',
                }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                    Malaysia • Talian Kasih Helpline
                  </h4>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#A855F7', fontFamily: 'var(--font-space-mono), monospace', marginBottom: '8px' }}>
                    15999
                  </p>
                </div>

                <div style={{
                  padding: '24px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333333',
                }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                    Philippines • DOH National Crisis Hotline
                  </h4>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#A855F7', fontFamily: 'var(--font-space-mono), monospace', marginBottom: '8px' }}>
                    1553 or 0917-899-8727
                  </p>
                </div>

                <div style={{
                  padding: '24px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333333',
                }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                    Thailand • Thanyarak Institute
                  </h4>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#A855F7', fontFamily: 'var(--font-space-mono), monospace', marginBottom: '8px' }}>
                    1165
                  </p>
                </div>

                <div style={{
                  padding: '24px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333333',
                }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                    Australia • National Alcohol and Drug Hotline
                  </h4>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#A855F7', fontFamily: 'var(--font-space-mono), monospace', marginBottom: '8px' }}>
                    1800-250-015
                  </p>
                </div>

                <div style={{
                  padding: '24px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333333',
                }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                    New Zealand • Alcohol Drug Helpline
                  </h4>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#A855F7', fontFamily: 'var(--font-space-mono), monospace', marginBottom: '8px' }}>
                    0800-787-797
                  </p>
                </div>
              </div>
            </div>

            {/* Europe */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FF0000', letterSpacing: '1px', marginBottom: '20px' }}>
                EUROPE
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  padding: '24px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333333',
                }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                    UK • Drinkline
                  </h4>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#A855F7', fontFamily: 'var(--font-space-mono), monospace', marginBottom: '8px' }}>
                    0300-123-1110
                  </p>
                </div>

                <div style={{
                  padding: '24px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333333',
                }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                    Germany • Sucht & Drogen Hotline
                  </h4>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#A855F7', fontFamily: 'var(--font-space-mono), monospace', marginBottom: '8px' }}>
                    01805-313-031
                  </p>
                </div>

                <div style={{
                  padding: '24px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333333',
                }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                    France • Alcool Info Service
                  </h4>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#A855F7', fontFamily: 'var(--font-space-mono), monospace', marginBottom: '8px' }}>
                    0980-980-930
                  </p>
                </div>
              </div>
            </div>

            {/* Americas */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FF0000', letterSpacing: '1px', marginBottom: '20px' }}>
                AMERICAS
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  padding: '24px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333333',
                }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                    USA • SAMHSA National Helpline
                  </h4>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#A855F7', fontFamily: 'var(--font-space-mono), monospace', marginBottom: '8px' }}>
                    1-800-662-4357
                  </p>
                  <p style={{ fontSize: '13px', color: '#999999', lineHeight: 1.7, fontFamily: 'var(--font-space-mono), monospace' }}>
                    Free, confidential, 24/7, 365-day treatment referral and information service
                  </p>
                </div>

                <div style={{
                  padding: '24px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333333',
                }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                    Canada • Canadian Centre on Substance Use and Addiction
                  </h4>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#A855F7', fontFamily: 'var(--font-space-mono), monospace', marginBottom: '8px' }}>
                    1-833-553-6983
                  </p>
                </div>
              </div>
            </div>

            {/* Online Resources */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FF0000', letterSpacing: '1px', marginBottom: '20px' }}>
                ONLINE SUPPORT (GLOBAL)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  padding: '24px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333333',
                }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                    SMART Recovery Online
                  </h4>
                  <a
                    href="https://www.smartrecovery.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '14px', fontWeight: 700, color: '#A855F7', fontFamily: 'var(--font-space-mono), monospace', textDecoration: 'none', display: 'block', marginBottom: '8px' }}
                  >
                    www.smartrecovery.org
                  </a>
                  <p style={{ fontSize: '13px', color: '#999999', lineHeight: 1.7, fontFamily: 'var(--font-space-mono), monospace' }}>
                    Free online meetings and chat support, science-based recovery program
                  </p>
                </div>

                <div style={{
                  padding: '24px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333333',
                }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                    In The Rooms
                  </h4>
                  <a
                    href="https://www.intherooms.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '14px', fontWeight: 700, color: '#A855F7', fontFamily: 'var(--font-space-mono), monospace', textDecoration: 'none', display: 'block', marginBottom: '8px' }}
                  >
                    www.intherooms.com
                  </a>
                  <p style={{ fontSize: '13px', color: '#999999', lineHeight: 1.7, fontFamily: 'var(--font-space-mono), monospace' }}>
                    Free online recovery meetings, available 24/7 in multiple languages
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px clamp(16px, 4vw, 48px)',
        borderTop: '1px solid #333333',
        backgroundColor: '#0C0C0C',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <span style={{ fontSize: '12px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace' }}>
            Last updated: February 2025
          </span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#FF0000', fontFamily: 'var(--font-space-mono), monospace', letterSpacing: '1px' }}>
            LEGAL DRINKING AGE ONLY. PLEASE DRINK RESPONSIBLY.
          </span>
        </div>
      </footer>
    </main>
  );
}
