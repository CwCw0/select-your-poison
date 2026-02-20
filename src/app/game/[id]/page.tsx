'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Skull,
  Beer,
  Check,
  X,
  Dices,
  Clock,
  Trophy,
  Copy,
  Home,
  Play,
  HelpCircle,
  Target,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';
import { useGameStore, useCurrentPlayer, useIsHost, useHasMode, useIsOvertime, useCurrentMultiplier } from '@/store/game-store';
import { formatRound, formatScore } from '@/lib/utils';
import { stratCategoryColors, stratCategoryLabels } from '@/lib/strats';

// Agent colors from Pencil design
const agentColors: Record<string, string> = {
  jett: '#7DD3FC',
  reyna: '#A855F7',
  phoenix: '#F97316',
  cypher: '#E5E5E5',
  sage: '#22D3EE',
  omen: '#6366F1',
  brimstone: '#EF4444',
  sova: '#3B82F6',
  viper: '#22C55E',
  killjoy: '#EAB308',
  raze: '#F97316',
  breach: '#F59E0B',
  skye: '#84CC16',
  yoru: '#8B5CF6',
  astra: '#A855F7',
  kayo: '#6B7280',
  chamber: '#D4AF37',
  neon: '#06B6D4',
  fade: '#78716C',
  harbor: '#0EA5E9',
  gekko: '#84CC16',
  deadlock: '#9CA3AF',
  iso: '#A855F7',
  clove: '#EC4899',
  vyse: '#8B5CF6',
};

// Agent-specific drinking rules
const agentRules: Record<string, string[]> = {
  jett: [
    'Say "Watch this" and die \u2192 2 drinks',
    'Updraft into enemies and die \u2192 1 drink',
    'Whiff all 5 knives \u2192 2 drinks',
    'Dash into site and get traded \u2192 1 drink',
  ],
  reyna: [
    'Die without getting a soul orb \u2192 1 drink',
    'Dismiss into 3+ enemies \u2192 2 drinks',
    'Ult and get 0 kills \u2192 2 drinks',
    'Leer yourself accidentally \u2192 1 drink',
  ],
  phoenix: [
    'Flash yourself \u2192 1 drink',
    'Flash your team \u2192 1 drink per teammate',
    'Die in your ult \u2192 1 drink',
    'Molly yourself to death \u2192 2 drinks',
  ],
  raze: [
    'Kill yourself with satchel \u2192 2 drinks',
    'Boombot finds 0 enemies \u2192 1 drink',
    'Whiff the showstopper \u2192 3 drinks',
    'Grenade yourself \u2192 1 drink',
  ],
  yoru: [
    'TP into 3+ enemies \u2192 2 drinks',
    'Clone gets killed instantly \u2192 1 drink',
    'Die during ult \u2192 2 drinks',
    'Fake TP outplay fails \u2192 1 drink',
  ],
  neon: [
    'Sprint into 5 enemies and die \u2192 1 drink',
    'Stun yourself with wall \u2192 1 drink',
    'Ult for 0 kills \u2192 2 drinks',
    'Run out of energy mid-fight \u2192 1 drink',
  ],
  iso: [
    'Lose the 1v1 in your ult \u2192 3 drinks',
    'Shield pops and you still die \u2192 1 drink',
    'Ult the wrong enemy \u2192 2 drinks',
    'Wall blocks nothing useful \u2192 1 drink',
  ],
  sova: [
    'Recon dart reveals 0 enemies \u2192 1 drink',
    'Shock dart yourself \u2192 1 drink',
    'Lineups take so long round ends \u2192 2 drinks',
    'Hunter\'s Fury hits nothing \u2192 2 drinks',
  ],
  breach: [
    'Flash your entire team \u2192 2 drinks',
    'Stun yourself \u2192 1 drink',
    'Ult misses everyone \u2192 2 drinks',
    'Aftershock kills teammate \u2192 2 drinks',
  ],
  skye: [
    'Dog finds nothing \u2192 1 drink',
    'Flash your own team \u2192 1 drink per teammate',
    'Heal full HP teammate \u2192 1 drink',
    'Ult finds 0 enemies \u2192 2 drinks',
  ],
  kayo: [
    'Knife suppresses 0 enemies \u2192 1 drink',
    'Flash your team \u2192 1 drink per teammate',
    'Die in ult without rez \u2192 2 drinks',
    'Molly yourself \u2192 1 drink',
  ],
  fade: [
    'Prowler finds nothing \u2192 1 drink',
    'Haunt reveals 0 enemies \u2192 1 drink',
    'Tether catches teammates \u2192 1 drink',
    'Ult catches only 1 enemy \u2192 1 drink',
  ],
  gekko: [
    'Dizzy blinds 0 enemies \u2192 1 drink',
    'Forget to pick up buddies \u2192 1 drink each',
    'Wingman fails plant/defuse \u2192 2 drinks',
    'Thrash catches no one \u2192 1 drink',
  ],
  brimstone: [
    'Smoke your own team \u2192 1 drink',
    'Molly a teammate \u2192 1 drink',
    'Ult your own team \u2192 2 drinks',
    'Stim beacon in spawn \u2192 1 drink',
  ],
  omen: [
    'TP into 5 enemies \u2192 2 drinks',
    'TP gets canceled \u2192 1 drink',
    'Flash yourself \u2192 1 drink',
    'Ult to enemy spawn and die \u2192 3 drinks',
  ],
  viper: [
    'Molly your own team \u2192 1 drink',
    'Wall blocks your team \u2192 1 drink',
    'Run out of fuel at worst time \u2192 2 drinks',
    'Ult and no one enters \u2192 1 drink',
  ],
  astra: [
    'Spend 30 seconds in astral form \u2192 1 drink',
    'Suck your own team \u2192 1 drink',
    'Stun your teammates \u2192 1 drink',
    'Ult blocks team\'s push \u2192 2 drinks',
  ],
  harbor: [
    'Wall blocks your team \u2192 1 drink',
    'Cascade hits no one \u2192 1 drink',
    'Cove gets destroyed instantly \u2192 1 drink',
    'Ult catches 0 enemies \u2192 2 drinks',
  ],
  clove: [
    'Self-res then die again \u2192 2 drinks',
    'Smoke your own team \u2192 1 drink',
    'Ult and get 0 kills \u2192 2 drinks',
    'Forget you can self-res \u2192 1 drink',
  ],
  sage: [
    'MUST res someone or drink 3 at end',
    'Res in open, they die again \u2192 2 drinks',
    'Wall blocks your team \u2192 1 drink',
    'Slow your own team \u2192 1 drink',
  ],
  cypher: [
    'Tripwire catches nothing all game \u2192 2 drinks',
    'Cam gets destroyed instantly \u2192 1 drink',
    'Ult reveals 0 useful info \u2192 2 drinks',
    'Die and lose all util \u2192 1 drink',
  ],
  killjoy: [
    'Turret gets destroyed instantly \u2192 1 drink',
    'Alarmbot catches nothing \u2192 1 drink',
    'Lockdown gets destroyed \u2192 2 drinks',
    'Swarm grenades hit teammates \u2192 1 drink',
  ],
  chamber: [
    'TP and still die \u2192 1 drink',
    'Whiff with headhunter \u2192 1 drink per whiff',
    'Tour de Force whiff \u2192 2 drinks',
    'Trademark catches nothing \u2192 2 drinks',
  ],
  deadlock: [
    'Cocoon catches no one \u2192 1 drink',
    'Barrier mesh gets ignored \u2192 1 drink',
    'Ult catches teammate \u2192 2 drinks',
    'Sonic sensor reveals nothing \u2192 1 drink',
  ],
  vyse: [
    'Arc Rose catches nothing \u2192 1 drink',
    'Shear gets destroyed immediately \u2192 1 drink',
    'Steel Garden hits teammates \u2192 1 drink',
    'Die with all utility available \u2192 1 drink',
  ],
};

export default function GamePage() {
  const params = useParams();
  const lobbyId = params.id as string;

  const {
    lobbyCode,
    settings,
    game,
    players,
    fetchLobby,
    endGameOnServer,
    switchSidesOnServer,
    roundWonOnServer,
    roundLostOnServer,
    addDeathOnServer,
    addDrinkOnServer,
    rollStratOnServer,
    rerollStratOnServer,
    skipStratOnServer,
  } = useGameStore();

  const currentPlayer = useCurrentPlayer();
  const isHost = useIsHost();
  const hasStratRoulette = useHasMode('strat_roulette');
  const hasAgentPoison = useHasMode('agent_poison');
  const isOvertime = useIsOvertime();
  const currentMultiplier = useCurrentMultiplier();

  const [showStratModal, setShowStratModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showAgentRules, setShowAgentRules] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastSeenStratId, setLastSeenStratId] = useState<string | null>(null);

  // On mount, if no lobbyCode in the store, try to recover state
  useEffect(() => {
    if (!lobbyCode) {
      fetchLobby();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Poll server every 2 seconds for latest game state
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLobby();
    }, 2000);

    return () => clearInterval(interval);
  }, [fetchLobby]);

  // Show strat modal when new strat is rolled (only if it's different from last seen)
  useEffect(() => {
    if (game.currentStrat && hasStratRoulette && game.currentStrat.id !== lastSeenStratId) {
      setShowStratModal(true);
      setLastSeenStratId(game.currentStrat.id);
    } else if (!game.currentStrat && lastSeenStratId) {
      // Reset when strat is cleared/skipped
      setLastSeenStratId(null);
    }
  }, [game.currentStrat, hasStratRoulette, lastSeenStratId]);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(lobbyId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAcceptStrat = () => {
    // No server action needed - just close the modal
    setShowStratModal(false);
  };

  const handleReroll = () => {
    if (game.rerollsLeft > 0) {
      rerollStratOnServer();
    }
  };

  const handleSkipStrat = () => {
    skipStratOnServer();
    setShowStratModal(false);
  };

  // Calculate totals
  const totalDeaths = players.reduce((sum, p) => sum + p.deaths, 0);
  const totalDrinks = players.reduce((sum, p) => sum + p.drinks, 0);

  // If game ended, show summary
  if (game.status === 'ended') {
    return <GameEndScreen />;
  }

  // If halftime, show halftime screen
  if (game.status === 'halftime') {
    return <HalftimeScreen />;
  }

  // If overtime, show overlay
  if (game.status === 'overtime' && game.round === 25) {
    return <OvertimeScreen />;
  }

  return (
    <main className="min-h-screen h-screen bg-[#0C0C0C] flex overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex" style={{
        width: '380px',
        backgroundColor: '#0A0A0A',
        flexDirection: 'column',
        gap: '24px',
        padding: '24px',
        borderRight: '1px solid #444444',
        height: '100vh',
        overflowY: 'auto'
      }}>
        {/* Logo Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#FF0000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Skull style={{ width: '20px', height: '20px', color: '#0C0C0C' }} />
            </div>
            <span style={{
              fontSize: '16px',
              fontWeight: 800,
              letterSpacing: '2px',
              color: '#FFFFFF'
            }}>
              SYP
            </span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              style={{
                width: '36px',
                height: '36px',
                border: '1px solid #555555',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <HelpCircle style={{ width: '16px', height: '16px', color: '#CCCCCC' }} />
            </button>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: 'rgba(255, 0, 0, 0.15)',
              border: '1px solid #FF0000'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#FF0000',
                animation: 'pulse 2s infinite'
              }} />
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '2px',
                color: '#FF0000',
                fontFamily: 'var(--font-space-mono), monospace'
              }}>
                LIVE
              </span>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <AnimatePresence>
          {showHelp && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                backgroundColor: '#1A1A1A',
                border: '1px solid #444444',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle style={{ width: '16px', height: '16px', color: '#22D3EE' }} />
                <span style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#22D3EE',
                  letterSpacing: '1px'
                }}>HOW TO PLAY</span>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '12px',
                color: '#DDDDDD',
                fontFamily: 'var(--font-space-mono), monospace',
                lineHeight: 1.6
              }}>
                <p><span style={{ color: '#22C55E', fontWeight: 700 }}>1.</span> Track deaths by clicking + DEATH on player cards</p>
                <p><span style={{ color: '#22C55E', fontWeight: 700 }}>2.</span> Drinks auto-calculate based on game mode</p>
                <p><span style={{ color: '#22C55E', fontWeight: 700 }}>3.</span> Mark round results with WIN/LOSS buttons</p>
                <p><span style={{ color: '#22C55E', fontWeight: 700 }}>4.</span> Use ROLL STRAT for random challenges</p>
                <p style={{ color: '#FF0000', fontWeight: 600, marginTop: '8px' }}>Remember: Drink responsibly!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Round Section */}
        <div style={{
          padding: '20px 0',
          borderTop: '1px solid #444444',
          borderBottom: '1px solid #444444',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '2px',
            color: '#CCCCCC',
            fontFamily: 'var(--font-space-mono), monospace'
          }}>
            CURRENT ROUND
          </span>
          <div style={{
            fontSize: '64px',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-2px',
            lineHeight: 1
          }}>
            {formatRound(game.round)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              padding: '6px 12px',
              backgroundColor: 'rgba(255, 0, 0, 0.2)',
              border: '1px solid #FF0000',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '1px',
              color: '#FF0000',
              fontFamily: 'var(--font-space-mono), monospace'
            }}>
              {game.side.toUpperCase()}
            </span>
            <span style={{
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '1px',
              color: '#FFFFFF',
              fontFamily: 'var(--font-space-mono), monospace'
            }}>
              {formatScore(game.teamScore, game.enemyScore)}
            </span>
          </div>

          {/* Overtime Multiplier Indicator */}
          {isOvertime && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(255, 0, 0, 0.3)',
                border: '2px solid #FF0000',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '8px'
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#FF0000',
                  borderRadius: '50%'
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  color: '#FF0000',
                  fontFamily: 'var(--font-space-mono), monospace'
                }}>
                  SUDDEN DEATH ACTIVE
                </span>
                <span style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  color: '#FFFFFF'
                }}>
                  {currentMultiplier}X DRINK MULTIPLIER
                </span>
              </div>
            </motion.div>
          )}

          {/* Round Controls */}
          {isHost && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px' }}>
              <button
                type="button"
                onClick={roundWonOnServer}
                style={{
                  height: '56px',
                  backgroundColor: '#22C55E',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  cursor: 'pointer'
                }}
              >
                <Trophy style={{ width: '20px', height: '20px', color: '#0C0C0C' }} />
                <span style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  color: '#0C0C0C'
                }}>
                  ROUND WON
                </span>
              </button>
              <button
                type="button"
                onClick={roundLostOnServer}
                style={{
                  height: '56px',
                  backgroundColor: '#EF4444',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  cursor: 'pointer'
                }}
              >
                <X style={{ width: '20px', height: '20px', color: '#FFFFFF' }} />
                <span style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  color: '#FFFFFF'
                }}>
                  ROUND LOST
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '2px',
            color: '#CCCCCC',
            fontFamily: 'var(--font-space-mono), monospace'
          }}>
            QUICK ACTIONS
          </span>
          {hasStratRoulette && (
            <button
              type="button"
              onClick={() => {
                rollStratOnServer();
                setShowStratModal(true);
              }}
              style={{
                height: '56px',
                backgroundColor: '#FF0000',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                cursor: 'pointer'
              }}
            >
              <Dices style={{ width: '20px', height: '20px', color: '#0C0C0C' }} />
              <span style={{
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '2px',
                color: '#0C0C0C'
              }}>
                ROLL STRAT
              </span>
            </button>
          )}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={switchSidesOnServer}
              style={{
                flex: 1,
                height: '48px',
                backgroundColor: '#2A2A2A',
                border: '2px solid #666666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <span style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '1px',
                color: '#FFFFFF',
                fontFamily: 'var(--font-space-mono), monospace'
              }}>
                SWITCH SIDES
              </span>
            </button>
            <button
              type="button"
              onClick={endGameOnServer}
              style={{
                flex: 1,
                height: '48px',
                backgroundColor: 'rgba(239, 68, 68, 0.25)',
                border: '2px solid #EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <span style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '1px',
                color: '#EF4444',
                fontFamily: 'var(--font-space-mono), monospace'
              }}>
                END GAME
              </span>
            </button>
          </div>
        </div>

        {/* Agent Rules Section - Always show if Agent Poison mode is enabled */}
        {hasAgentPoison && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setShowAgentRules(!showAgentRules)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target style={{ width: '16px', height: '16px', color: '#A855F7' }} />
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '2px',
                  color: '#A855F7',
                  fontFamily: 'var(--font-space-mono), monospace'
                }}>
                  YOUR AGENT RULES
                </span>
              </div>
              {showAgentRules ? (
                <ChevronUp style={{ width: '16px', height: '16px', color: '#A855F7' }} />
              ) : (
                <ChevronDown style={{ width: '16px', height: '16px', color: '#A855F7' }} />
              )}
            </button>
            <AnimatePresence>
              {showAgentRules && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    border: '1px solid #A855F7',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    overflow: 'hidden'
                  }}
                >
                  {currentPlayer?.agent ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: agentColors[currentPlayer.agent.toLowerCase()] || '#7DD3FC'
                          }}
                        />
                        <span style={{
                          fontSize: '14px',
                          fontWeight: 700,
                          color: '#FFFFFF',
                          letterSpacing: '1px'
                        }}>
                          {currentPlayer.agent.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(agentRules[currentPlayer.agent.toLowerCase()] || []).map((rule, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                            <div style={{
                              width: '6px',
                              height: '6px',
                              backgroundColor: '#A855F7',
                              marginTop: '6px',
                              flexShrink: 0
                            }} />
                            <span style={{
                              fontSize: '12px',
                              color: '#DDDDDD',
                              fontFamily: 'var(--font-space-mono), monospace',
                              lineHeight: 1.5
                            }}>
                              {rule}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle style={{ width: '16px', height: '16px', color: '#F59E0B' }} />
                      <span style={{
                        fontSize: '12px',
                        color: '#F59E0B',
                        fontFamily: 'var(--font-space-mono), monospace'
                      }}>
                        No agent selected - select an agent in lobby to see rules
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Show mode not enabled hint if Agent Poison not selected */}
        {!hasAgentPoison && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            backgroundColor: '#1A1A1A',
            border: '1px solid #444444'
          }}>
            <Target style={{ width: '16px', height: '16px', color: '#888888' }} />
            <span style={{
              fontSize: '11px',
              color: '#888888',
              fontFamily: 'var(--font-space-mono), monospace'
            }}>
              Enable AGENT POISON mode for agent-specific rules
            </span>
          </div>
        )}

        {/* Current Strat */}
        {hasStratRoulette && game.currentStrat && (
          <div style={{
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            border: '1px solid #FF0000',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <span style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '2px',
              color: '#FF0000',
              fontFamily: 'var(--font-space-mono), monospace'
            }}>
              ACTIVE STRAT
            </span>
            <p style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#FFFFFF',
              lineHeight: 1.5
            }}>
              &quot;{game.currentStrat.text}&quot;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  padding: '4px 12px',
                  backgroundColor: stratCategoryColors[game.currentStrat.category]
                }}
              >
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  color: '#0C0C0C',
                  fontFamily: 'var(--font-space-mono), monospace'
                }}>
                  {stratCategoryLabels[game.currentStrat.category]}
                </span>
              </div>
              <span style={{
                fontSize: '12px',
                fontWeight: 500,
                color: '#CCCCCC',
                fontFamily: 'var(--font-space-mono), monospace'
              }}>
                Fail = {game.currentStrat.penalty} drinks
              </span>
            </div>
          </div>
        )}

        {/* Lobby Code */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '16px',
          borderTop: '1px solid #444444'
        }}>
          <button
            type="button"
            onClick={handleCopyCode}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: '#1A1A1A',
              border: '1px solid #555555',
              cursor: 'pointer'
            }}
          >
            <span style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '1px',
              color: '#CCCCCC',
              fontFamily: 'var(--font-space-mono), monospace'
            }}>
              LOBBY CODE
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '2px',
                color: '#FF0000'
              }}>
                {lobbyId}
              </span>
              {copied ? (
                <Check style={{ width: '16px', height: '16px', color: '#22C55E' }} />
              ) : (
                <Copy style={{ width: '16px', height: '16px', color: '#888888' }} />
              )}
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '32px',
        gap: '24px',
        overflowY: 'auto'
      }} className="pt-20 lg:pt-8">
        {/* Header - Responsive */}
        <header style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          width: '100%'
        }} className="lg:flex-row lg:items-center lg:justify-between">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 800,
              letterSpacing: '1px',
              color: '#FFFFFF'
            }}>
              LIVE TRACKER
            </h1>
            <p style={{
              fontSize: '13px',
              color: '#999999',
              fontFamily: 'var(--font-space-mono), monospace'
            }}>
              Click player cards to track deaths and drinks
            </p>
          </div>

          {/* Stats Summary - Grid on mobile, flex on desktop */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }} className="lg:flex lg:gap-8">
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              alignItems: 'center',
              padding: '16px 24px',
              backgroundColor: '#1A1A1A',
              border: '1px solid #333333'
            }}>
              <span style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '1px',
                color: '#999999',
                fontFamily: 'var(--font-space-mono), monospace'
              }}>
                TOTAL DEATHS
              </span>
              <span style={{
                fontSize: '32px',
                fontWeight: 800,
                color: '#FFFFFF'
              }}>
                {totalDeaths}
              </span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              alignItems: 'center',
              padding: '16px 24px',
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              border: '1px solid #FF0000'
            }}>
              <span style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '1px',
                color: '#FF0000',
                fontFamily: 'var(--font-space-mono), monospace'
              }}>
                TOTAL DRINKS
              </span>
              <span style={{
                fontSize: '32px',
                fontWeight: 800,
                color: '#FF0000'
              }}>
                {totalDrinks}
              </span>
            </div>
          </div>
        </header>

        {/* Active Modes Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <span style={{
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '1px',
            color: '#666666',
            fontFamily: 'var(--font-space-mono), monospace'
          }}>
            ACTIVE MODES:
          </span>
          {settings.modes.map((mode) => {
            const modeColors: Record<string, string> = {
              'classic': '#EF4444',
              'agent_poison': '#A855F7',
              'strat_roulette': '#FF0000',
              'challenges': '#F59E0B',
              'punishment': '#EF4444',
            };
            const color = modeColors[mode] || '#CCCCCC';
            return (
              <span
                key={mode}
                style={{
                  padding: '6px 12px',
                  backgroundColor: `${color}15`,
                  border: `1px solid ${color}`,
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  color: color,
                  fontFamily: 'var(--font-space-mono), monospace'
                }}
              >
                {mode.toUpperCase().replace('_', ' ')}
              </span>
            );
          })}
        </div>

        {/* Active Strat Banner - Prominent display when strat is active */}
        {hasStratRoulette && game.currentStrat && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              width: '100%',
              padding: '32px',
              background: `linear-gradient(135deg, ${stratCategoryColors[game.currentStrat.category]}15 0%, ${stratCategoryColors[game.currentStrat.category]}08 100%)`,
              border: `2px solid ${stratCategoryColors[game.currentStrat.category]}`,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Animated background pulse */}
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `radial-gradient(circle at 50% 50%, ${stratCategoryColors[game.currentStrat.category]}20 0%, transparent 70%)`,
                pointerEvents: 'none'
              }}
            />

            <div style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  >
                    <Target style={{ width: '28px', height: '28px', color: stratCategoryColors[game.currentStrat.category] }} />
                  </motion.div>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    letterSpacing: '3px',
                    color: stratCategoryColors[game.currentStrat.category],
                    fontFamily: 'var(--font-space-mono), monospace'
                  }}>
                    ACTIVE STRAT
                  </span>
                </div>
                <div
                  style={{
                    padding: '8px 20px',
                    backgroundColor: stratCategoryColors[game.currentStrat.category]
                  }}
                >
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    color: '#0C0C0C',
                    fontFamily: 'var(--font-space-mono), monospace'
                  }}>
                    {stratCategoryLabels[game.currentStrat.category]}
                  </span>
                </div>
              </div>

              {/* Strat Text */}
              <h3 style={{
                fontSize: '28px',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.3,
                letterSpacing: '-1px',
                margin: 0
              }}>
                &quot;{game.currentStrat.text}&quot;
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '16px',
                color: '#CCCCCC',
                lineHeight: 1.6,
                margin: 0,
                maxWidth: '800px'
              }}>
                {game.currentStrat.description}
              </p>

              {/* Stats Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(255, 0, 0, 0.2)',
                  border: '1px solid #FF0000'
                }}>
                  <Beer style={{ width: '20px', height: '20px', color: '#FF0000' }} />
                  <span style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#FF0000',
                    fontFamily: 'var(--font-space-mono), monospace'
                  }}>
                    +{game.currentStrat.penalty} DRINKS IF FAILED
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Clock style={{ width: '18px', height: '18px', color: '#999999' }} />
                  <span style={{
                    fontSize: '14px',
                    color: '#CCCCCC',
                    fontFamily: 'var(--font-space-mono), monospace'
                  }}>
                    {game.currentStrat.duration === 'round' ? 'THIS ROUND' : game.currentStrat.duration === 'half' ? 'THIS HALF' : 'ENTIRE GAME'}
                  </span>
                </div>
                <div style={{
                  marginLeft: 'auto',
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}>
                  <button
                    type="button"
                    onClick={() => skipStratOnServer()}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: '#22C55E',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <Check style={{ width: '16px', height: '16px', color: '#0C0C0C' }} />
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      color: '#0C0C0C',
                      fontFamily: 'var(--font-space-mono), monospace'
                    }}>
                      COMPLETED
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => skipStratOnServer()}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                      border: '2px solid #EF4444',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <X style={{ width: '16px', height: '16px', color: '#EF4444' }} />
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      color: '#EF4444',
                      fontFamily: 'var(--font-space-mono), monospace'
                    }}>
                      FAILED
                    </span>
                  </button>
                  {isHost && (
                    <button
                      type="button"
                      onClick={() => {
                        rollStratOnServer();
                        setShowStratModal(true);
                      }}
                      style={{
                        padding: '12px 20px',
                        backgroundColor: '#2A2A2A',
                        border: '2px solid #666666',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      <Dices style={{ width: '16px', height: '16px', color: '#FFFFFF' }} />
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '1px',
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-space-mono), monospace'
                      }}>
                        NEW STRAT
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Player Cards - Responsive Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          flex: 1,
          alignContent: 'start'
        }}>
          {players.length > 0 ? (
            players.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                isCurrentPlayer={player.id === currentPlayer?.id}
                onAddDeath={() => addDeathOnServer(player.id)}
                onAddDrink={() => addDrinkOnServer(player.id, 1)}
                agentColor={agentColors[player.agent?.toLowerCase() || ''] || '#7DD3FC'}
                hasAgentPoison={hasAgentPoison}
              />
            ))
          ) : (
            <div style={{
              gridColumn: '1 / -1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed #333333',
              minHeight: '400px',
              padding: '40px'
            }}>
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <AlertCircle style={{ width: '64px', height: '64px', color: '#FF0000', margin: '0 auto' }} />
                <p style={{ color: '#CCCCCC', fontFamily: 'var(--font-space-mono), monospace', fontSize: '14px' }}>No players in lobby</p>
                <p style={{ color: '#666666', fontFamily: 'var(--font-space-mono), monospace', fontSize: '12px' }}>Create a new lobby to start tracking</p>
                <Link
                  href="/lobby/create"
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#FF0000',
                    color: '#0C0C0C',
                    fontWeight: 700,
                    fontSize: '12px',
                    letterSpacing: '1px',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                >
                  CREATE NEW LOBBY
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#0A0A0A] border-b border-[#333333] flex items-center justify-between px-4 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF0000] flex items-center justify-center">
            <Skull className="w-4 h-4 text-[#0C0C0C]" />
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-[14px] font-bold text-white font-mono">
            R{game.round}
          </span>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-[#FF0000]/[0.13] border border-[#FF0000]">
            <div className="w-2 h-2 bg-[#FF0000] animate-pulse" />
            <span className="text-[9px] font-bold tracking-[1px] text-[#FF0000] font-mono">
              LIVE
            </span>
          </div>
        </div>
      </div>

      {/* Strat Modal */}
      <AnimatePresence>
        {showStratModal && game.currentStrat && (
          <StratRouletteModal
            strat={game.currentStrat}
            rerollsLeft={game.rerollsLeft}
            onAccept={handleAcceptStrat}
            onReroll={handleReroll}
            onSkip={handleSkipStrat}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

// Player Card Component
function PlayerCard({
  player,
  isCurrentPlayer,
  onAddDeath,
  onAddDrink,
  agentColor,
  hasAgentPoison,
}: {
  player: any;
  isCurrentPlayer: boolean;
  onAddDeath: () => void;
  onAddDrink: () => void;
  agentColor: string;
  hasAgentPoison: boolean;
}) {
  const [deathFlash, setDeathFlash] = useState(false);
  const [drinkFlash, setDrinkFlash] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const handleDeath = () => {
    onAddDeath();
    setDeathFlash(true);
    setTimeout(() => setDeathFlash(false), 300);
  };

  const handleDrink = () => {
    onAddDrink();
    setDrinkFlash(true);
    setTimeout(() => setDrinkFlash(false), 300);
  };

  // Determine text color based on background brightness
  const isLightColor = ['#7DD3FC', '#E5E5E5', '#22D3EE', '#84CC16', '#EAB308', '#F59E0B', '#D4AF37'].includes(agentColor);
  const headerTextColor = isLightColor ? '#0C0C0C' : '#FFFFFF';

  const playerRules = agentRules[player.agent?.toLowerCase() || ''] || [];

  return (
    <motion.div
      layout
      style={{
        flex: 1,
        minWidth: '280px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: deathFlash ? 'rgba(239, 68, 68, 0.15)' : drinkFlash ? 'rgba(245, 158, 11, 0.15)' : '#0C0C0C',
        border: `2px solid ${agentColor}`,
        boxShadow: isCurrentPlayer ? `0 0 20px ${agentColor}40, inset 0 0 30px ${agentColor}10` : 'none',
        transition: 'background-color 0.2s ease, box-shadow 0.3s ease',
      }}
    >
      {/* Header with gradient */}
      <div
        style={{
          height: '60px',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: `linear-gradient(135deg, ${agentColor} 0%, ${agentColor}CC 100%)`,
          borderBottom: `3px solid ${agentColor}`,
          position: 'relative',
        }}
      >
        {/* You indicator - positioned on the left to avoid overlap */}
        {isCurrentPlayer && (
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            padding: '2px 8px',
            backgroundColor: headerTextColor,
            opacity: 0.9,
            zIndex: 1,
          }}>
            <span style={{
              fontSize: '8px',
              fontWeight: 700,
              letterSpacing: '1px',
              color: agentColor,
              fontFamily: 'var(--font-space-mono), monospace',
            }}>
              YOU
            </span>
          </div>
        )}
        <span
          style={{
            fontSize: '15px',
            fontWeight: 800,
            letterSpacing: '2px',
            color: headerTextColor,
            paddingTop: isCurrentPlayer ? '16px' : '0',
          }}
        >
          {player.name || 'PLAYER'}
        </span>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1px',
            color: headerTextColor,
            opacity: 0.8,
            fontFamily: 'var(--font-space-mono), monospace',
          }}
        >
          {player.agent?.toUpperCase() || 'AGENT'}
        </span>
      </div>

      {/* Body */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        gap: '20px',
      }}>
        {/* Stats - Side by side with cleaner look */}
        <div style={{ display: 'flex', gap: '16px' }}>
          {/* Deaths stat */}
          <div style={{
            flex: 1,
            padding: '16px',
            backgroundColor: '#1A1A1A',
            border: '1px solid #333333',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              backgroundColor: '#FFFFFF',
              opacity: 0.3,
            }} />
            <span style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '2px',
              color: '#888888',
              fontFamily: 'var(--font-space-mono), monospace',
            }}>
              DEATHS
            </span>
            <span style={{
              fontSize: '44px',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1,
              letterSpacing: '-2px',
            }}>
              {player.deaths}
            </span>
          </div>
          {/* Drinks stat */}
          <div style={{
            flex: 1,
            padding: '16px',
            backgroundColor: 'rgba(255, 0, 0, 0.08)',
            border: '1px solid rgba(255, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              backgroundColor: '#FF0000',
            }} />
            <span style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '2px',
              color: '#FF0000',
              fontFamily: 'var(--font-space-mono), monospace',
            }}>
              DRINKS
            </span>
            <span style={{
              fontSize: '44px',
              fontWeight: 800,
              color: '#FF0000',
              lineHeight: 1,
              letterSpacing: '-2px',
            }}>
              {player.drinks}
            </span>
          </div>
        </div>

        {/* Action Buttons - Improved styling */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <motion.button
            type="button"
            onClick={handleDeath}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              height: '56px',
              backgroundColor: '#1A1A1A',
              border: '2px solid #555555',
              borderLeft: '4px solid #FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#252525';
              e.currentTarget.style.borderColor = '#888888';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1A1A1A';
              e.currentTarget.style.borderColor = '#555555';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Skull style={{ width: '22px', height: '22px', color: '#FFFFFF' }} />
            <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '1px', color: '#FFFFFF', fontFamily: 'var(--font-space-mono), monospace' }}>
              + DEATH
            </span>
          </motion.button>
          <motion.button
            type="button"
            onClick={handleDrink}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              height: '56px',
              backgroundColor: '#FF0000',
              borderTop: 'none',
              borderRight: 'none',
              borderBottom: 'none',
              borderLeft: '4px solid #CC0000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#DC2626';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FF0000';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Beer style={{ width: '22px', height: '22px', color: '#0C0C0C' }} />
            <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '1px', color: '#0C0C0C', fontFamily: 'var(--font-space-mono), monospace' }}>
              + DRINK
            </span>
          </motion.button>
        </div>

        {/* Agent Rules Toggle (if Agent Poison mode) */}
        {hasAgentPoison && playerRules.length > 0 && (
          <div style={{
            borderTop: '1px solid #333333',
            paddingTop: '16px',
          }}>
            <button
              type="button"
              onClick={() => setShowRules(!showRules)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textAlign: 'left',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px 0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: agentColor,
                }} />
                <span style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '2px',
                  color: '#888888',
                  fontFamily: 'var(--font-space-mono), monospace',
                }}>
                  AGENT RULES
                </span>
              </div>
              {showRules ? (
                <ChevronUp style={{ width: '16px', height: '16px', color: '#666666' }} />
              ) : (
                <ChevronDown style={{ width: '16px', height: '16px', color: '#666666' }} />
              )}
            </button>
            <AnimatePresence>
              {showRules && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    marginTop: '12px',
                    overflow: 'hidden',
                    paddingLeft: '16px',
                  }}
                >
                  {playerRules.slice(0, 3).map((rule, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{
                        width: '4px',
                        height: '4px',
                        marginTop: '6px',
                        flexShrink: 0,
                        backgroundColor: agentColor,
                      }} />
                      <span style={{
                        fontSize: '11px',
                        color: '#BBBBBB',
                        fontFamily: 'var(--font-space-mono), monospace',
                        lineHeight: 1.5,
                      }}>
                        {rule}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Strat Roulette Modal
function StratRouletteModal({
  strat,
  rerollsLeft,
  onAccept,
  onReroll,
  onSkip,
}: {
  strat: { text: string; description: string; category: 'easy' | 'medium' | 'hard' | 'stupid'; penalty: number; duration: string };
  rerollsLeft: number;
  onAccept: () => void;
  onReroll: () => void;
  onSkip: () => void;
}) {
  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '32px'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        style={{
          maxWidth: '600px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px',
          textAlign: 'center'
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <span style={{
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '4px',
          color: '#FF0000',
          fontFamily: 'var(--font-space-mono), monospace'
        }}>
          STRAT ROULETTE
        </span>

        <div style={{
          padding: '12px 24px',
          backgroundColor: stratCategoryColors[strat.category]
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '2px',
            color: '#0C0C0C',
            fontFamily: 'var(--font-space-mono), monospace'
          }}>
            {stratCategoryLabels[strat.category]}
          </span>
        </div>

        <h2 style={{
          fontSize: '36px',
          fontWeight: 800,
          color: '#FFFFFF',
          lineHeight: 1.2,
          letterSpacing: '-2px',
          padding: '0 16px'
        }}>
          &quot;{strat.text}&quot;
        </h2>

        <p style={{
          fontSize: '16px',
          color: '#CCCCCC',
          maxWidth: '400px',
          padding: '0 16px',
          lineHeight: 1.6
        }}>
          {strat.description}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Beer style={{ width: '20px', height: '20px', color: '#FF0000' }} />
            <span style={{
              fontSize: '14px',
              color: '#CCCCCC',
              fontFamily: 'var(--font-space-mono), monospace'
            }}>
              +{strat.penalty} drinks if failed
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock style={{ width: '20px', height: '20px', color: '#999999' }} />
            <span style={{
              fontSize: '14px',
              color: '#CCCCCC',
              fontFamily: 'var(--font-space-mono), monospace'
            }}>
              {strat.duration === 'round' ? 'This round' : strat.duration === 'half' ? 'This half' : 'Entire game'}
            </span>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '16px',
          marginTop: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button
            type="button"
            onClick={onAccept}
            style={{
              height: '60px',
              padding: '0 32px',
              backgroundColor: '#FF0000',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: 'pointer'
            }}
          >
            <Check style={{ width: '22px', height: '22px', color: '#0C0C0C' }} />
            <span style={{
              fontSize: '15px',
              fontWeight: 700,
              letterSpacing: '2px',
              color: '#0C0C0C'
            }}>
              ACCEPT FATE
            </span>
          </button>
          <button
            type="button"
            onClick={onReroll}
            disabled={rerollsLeft <= 0}
            style={{
              height: '60px',
              padding: '0 32px',
              backgroundColor: '#2A2A2A',
              border: '2px solid #666666',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: rerollsLeft > 0 ? 'pointer' : 'not-allowed',
              opacity: rerollsLeft > 0 ? 1 : 0.5
            }}
          >
            <Dices style={{ width: '22px', height: '22px', color: '#FFFFFF' }} />
            <span style={{
              fontSize: '15px',
              fontWeight: 600,
              letterSpacing: '1px',
              color: '#FFFFFF',
              fontFamily: 'var(--font-space-mono), monospace'
            }}>
              REROLL ({rerollsLeft})
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={onSkip}
          style={{
            fontSize: '13px',
            color: '#999999',
            fontFamily: 'var(--font-space-mono), monospace',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 16px',
            marginTop: '8px'
          }}
        >
          Skip this round
        </button>
      </motion.div>
    </motion.div>
  );
}

// Halftime Screen
function HalftimeScreen() {
  const { game, players, resumeFromHalftimeOnServer } = useGameStore();
  const isHost = useIsHost();

  const handleContinue = () => {
    resumeFromHalftimeOnServer();
  };

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0C0C0C',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px'
    }}>
      <motion.div
        style={{
          maxWidth: '700px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px',
          textAlign: 'center'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{
          padding: '12px 32px',
          backgroundColor: '#F59E0B'
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '2px',
            color: '#0C0C0C',
            fontFamily: 'var(--font-space-mono), monospace'
          }}>
            HALF TIME
          </span>
        </div>

        <h1 style={{
          fontSize: '56px',
          fontWeight: 800,
          color: '#FFFFFF',
          letterSpacing: '-2px'
        }}>
          SIDE SWAP
        </h1>

        <p style={{
          fontSize: '18px',
          color: '#CCCCCC',
          fontFamily: 'var(--font-space-mono), monospace'
        }}>
          Take a break. Grab a drink. Regroup.
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
          marginTop: '16px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{
              fontSize: '12px',
              fontFamily: 'var(--font-space-mono), monospace',
              color: '#999999'
            }}>TEAM</span>
            <div style={{
              fontSize: '64px',
              fontWeight: 800,
              color: '#22C55E'
            }}>
              {game.teamScore}
            </div>
          </div>
          <span style={{
            fontSize: '40px',
            fontWeight: 300,
            color: '#666666'
          }}>-</span>
          <div style={{ textAlign: 'center' }}>
            <span style={{
              fontSize: '12px',
              fontFamily: 'var(--font-space-mono), monospace',
              color: '#999999'
            }}>ENEMY</span>
            <div style={{
              fontSize: '64px',
              fontWeight: 800,
              color: '#EF4444'
            }}>
              {game.enemyScore}
            </div>
          </div>
        </div>

        <div style={{
          fontSize: '14px',
          fontWeight: 600,
          letterSpacing: '2px',
          color: '#F59E0B',
          fontFamily: 'var(--font-space-mono), monospace'
        }}>
          {game.side === 'defense' ? 'ATTACK' : 'DEFENSE'} → {game.side.toUpperCase()}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginTop: '16px',
          width: '100%'
        }}>
          {players.map((player) => (
            <div key={player.id} style={{
              padding: '16px',
              backgroundColor: '#1A1A1A',
              border: '1px solid #444444'
            }}>
              <span style={{
                fontSize: '12px',
                fontFamily: 'var(--font-space-mono), monospace',
                color: '#CCCCCC'
              }}>{player.name}</span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                marginTop: '8px'
              }}>
                <span style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#FFFFFF'
                }}>{player.deaths}</span>
                <span style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#FF0000'
                }}>{player.drinks}</span>
              </div>
            </div>
          ))}
        </div>

        {isHost && (
          <button
            type="button"
            onClick={handleContinue}
            style={{
              height: '60px',
              padding: '0 40px',
              backgroundColor: '#FF0000',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: 'pointer',
              marginTop: '16px'
            }}
          >
            <Play style={{ width: '22px', height: '22px', color: '#0C0C0C' }} />
            <span style={{
              fontSize: '15px',
              fontWeight: 700,
              letterSpacing: '2px',
              color: '#0C0C0C'
            }}>
              CONTINUE TO SECOND HALF
            </span>
          </button>
        )}
      </motion.div>
    </main>
  );
}

// Overtime Screen
function OvertimeScreen() {
  const { resumeFromHalftimeOnServer } = useGameStore();
  const isHost = useIsHost();

  const handleContinue = () => {
    resumeFromHalftimeOnServer();
  };

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0C0C0C',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px'
    }}>
      <motion.div
        style={{
          maxWidth: '600px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px',
          textAlign: 'center'
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div style={{
          width: '128px',
          height: '128px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 0, 0, 0.2)',
          border: '2px solid #FF0000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Trophy style={{ width: '64px', height: '64px', color: '#FF0000' }} />
        </div>

        <div style={{
          padding: '8px 24px',
          backgroundColor: '#FF0000'
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '4px',
            color: '#0C0C0C',
            fontFamily: 'var(--font-space-mono), monospace'
          }}>
            OVERTIME
          </span>
        </div>

        <h1 style={{
          fontSize: '56px',
          fontWeight: 800,
          color: '#FFFFFF',
          letterSpacing: '-2px'
        }}>
          SUDDEN DEATH
        </h1>

        <p style={{
          fontSize: '18px',
          color: '#CCCCCC',
          fontFamily: 'var(--font-space-mono), monospace'
        }}>
          Score tied 12-12. First to win 2 rounds takes the match.
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          marginTop: '16px'
        }}>
          <span style={{
            fontSize: '64px',
            fontWeight: 800,
            color: '#22C55E'
          }}>12</span>
          <span style={{
            fontSize: '48px',
            fontWeight: 300,
            color: '#666666'
          }}>-</span>
          <span style={{
            fontSize: '64px',
            fontWeight: 800,
            color: '#EF4444'
          }}>12</span>
        </div>

        <div style={{
          padding: '24px',
          backgroundColor: '#1A1A1A',
          border: '1px solid #444444',
          width: '100%',
          marginTop: '16px'
        }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '2px',
            color: '#999999',
            fontFamily: 'var(--font-space-mono), monospace'
          }}>
            OVERTIME RULES
          </span>
          <ul style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginTop: '16px',
            textAlign: 'left',
            listStyle: 'none',
            padding: 0,
            margin: '16px 0 0 0'
          }}>
            <li style={{
              fontSize: '14px',
              color: '#CCCCCC',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-space-mono), monospace'
            }}>
              <span style={{ color: '#FF0000' }}>•</span>
              2X DRINK MULTIPLIER on all deaths
            </li>
            <li style={{
              fontSize: '14px',
              color: '#CCCCCC',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-space-mono), monospace'
            }}>
              <span style={{ color: '#FF0000' }}>•</span>
              First team to 14 wins
            </li>
            <li style={{
              fontSize: '14px',
              color: '#CCCCCC',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-space-mono), monospace'
            }}>
              <span style={{ color: '#FF0000' }}>•</span>
              No mercy. Full send only.
            </li>
          </ul>
        </div>

        {isHost && (
          <button
            type="button"
            onClick={handleContinue}
            style={{
              height: '60px',
              padding: '0 40px',
              backgroundColor: '#FF0000',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: 'pointer',
              marginTop: '16px'
            }}
          >
            <Play style={{ width: '22px', height: '22px', color: '#0C0C0C' }} />
            <span style={{
              fontSize: '15px',
              fontWeight: 700,
              letterSpacing: '2px',
              color: '#0C0C0C'
            }}>
              CONTINUE TO OVERTIME
            </span>
          </button>
        )}
      </motion.div>
    </main>
  );
}

// Game End Screen
function GameEndScreen() {
  const { game, players, leaveLobbyOnServer } = useGameStore();
  const router = useRouter();

  const isVictory = game.teamScore > game.enemyScore;

  // Properly calculate most deaths and drinks from actual players
  const sortedByDeaths = [...players].sort((a, b) => b.deaths - a.deaths);
  const sortedByDrinks = [...players].sort((a, b) => b.drinks - a.drinks);

  const mostDeaths = sortedByDeaths[0];
  const mostDrinks = sortedByDrinks[0];

  const totalDeaths = players.reduce((sum, p) => sum + p.deaths, 0);
  const totalDrinks = players.reduce((sum, p) => sum + p.drinks, 0);

  const handleNewGame = () => {
    leaveLobbyOnServer();
    router.push('/lobby/create');
  };

  const handleHome = () => {
    leaveLobbyOnServer();
    router.push('/');
  };

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#0C0C0C',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px'
    }}>
      <motion.div
        style={{
          maxWidth: '700px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px',
          textAlign: 'center'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{
          padding: '12px 32px',
          backgroundColor: isVictory ? '#22C55E' : '#EF4444'
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '2px',
            color: '#0C0C0C',
            fontFamily: 'var(--font-space-mono), monospace'
          }}>
            {isVictory ? 'VICTORY' : 'DEFEAT'}
          </span>
        </div>

        <h1 style={{
          fontSize: '56px',
          fontWeight: 800,
          color: '#FFFFFF',
          letterSpacing: '-2px'
        }}>
          GAME OVER
        </h1>

        {/* Final Score */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
          marginTop: '16px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{
              fontSize: '12px',
              fontFamily: 'var(--font-space-mono), monospace',
              color: '#999999'
            }}>TEAM</span>
            <div style={{
              fontSize: '72px',
              fontWeight: 800,
              color: isVictory ? '#22C55E' : '#FFFFFF'
            }}>
              {game.teamScore}
            </div>
          </div>
          <span style={{
            fontSize: '40px',
            fontWeight: 300,
            color: '#666666'
          }}>-</span>
          <div style={{ textAlign: 'center' }}>
            <span style={{
              fontSize: '12px',
              fontFamily: 'var(--font-space-mono), monospace',
              color: '#999999'
            }}>ENEMY</span>
            <div style={{
              fontSize: '72px',
              fontWeight: 800,
              color: !isVictory ? '#EF4444' : '#FFFFFF'
            }}>
              {game.enemyScore}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginTop: '16px',
          width: '100%'
        }}>
          <div style={{
            padding: '16px',
            backgroundColor: '#1A1A1A',
            border: '1px solid #444444'
          }}>
            <span style={{
              fontSize: '11px',
              fontFamily: 'var(--font-space-mono), monospace',
              color: '#999999'
            }}>TOTAL DEATHS</span>
            <div style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#FFFFFF',
              marginTop: '8px'
            }}>
              {totalDeaths}
            </div>
          </div>
          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            border: '1px solid rgba(255, 0, 0, 0.3)'
          }}>
            <span style={{
              fontSize: '11px',
              fontFamily: 'var(--font-space-mono), monospace',
              color: '#FF0000'
            }}>TOTAL DRINKS</span>
            <div style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#FF0000',
              marginTop: '8px'
            }}>
              {totalDrinks}
            </div>
          </div>
          <div style={{
            padding: '16px',
            backgroundColor: '#1A1A1A',
            border: '1px solid #444444'
          }}>
            <span style={{
              fontSize: '11px',
              fontFamily: 'var(--font-space-mono), monospace',
              color: '#999999'
            }}>MOST DEATHS</span>
            <div style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#FFFFFF',
              marginTop: '8px'
            }}>
              {mostDeaths?.name || 'N/A'}
            </div>
            {mostDeaths && (
              <span style={{
                fontSize: '12px',
                color: '#999999',
                fontFamily: 'var(--font-space-mono), monospace'
              }}>
                {mostDeaths.deaths} deaths
              </span>
            )}
          </div>
          <div style={{
            padding: '16px',
            backgroundColor: '#1A1A1A',
            border: '1px solid #444444'
          }}>
            <span style={{
              fontSize: '11px',
              fontFamily: 'var(--font-space-mono), monospace',
              color: '#999999'
            }}>MOST DRINKS</span>
            <div style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#FF0000',
              marginTop: '8px'
            }}>
              {mostDrinks?.name || 'N/A'}
            </div>
            {mostDrinks && (
              <span style={{
                fontSize: '12px',
                color: '#999999',
                fontFamily: 'var(--font-space-mono), monospace'
              }}>
                {mostDrinks.drinks} drinks
              </span>
            )}
          </div>
        </div>

        {/* Player Summary */}
        {players.length > 0 && (
          <div style={{ width: '100%', marginTop: '16px' }}>
            <span style={{
              fontSize: '11px',
              fontFamily: 'var(--font-space-mono), monospace',
              color: '#999999'
            }}>PLAYER RANKINGS</span>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginTop: '16px'
            }}>
              {sortedByDrinks.map((player, index) => {
                const agentColor = agentColors[player.agent?.toLowerCase() || ''] || '#7DD3FC';
                return (
                  <div
                    key={player.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      backgroundColor: '#1A1A1A',
                      borderLeft: `4px solid ${agentColor}`
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}>
                      <span style={{
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#999999'
                      }}>#{index + 1}</span>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                      }}>
                        <span style={{
                          fontWeight: 700,
                          color: '#FFFFFF'
                        }}>{player.name}</span>
                        <span style={{
                          fontSize: '10px',
                          color: '#999999',
                          fontFamily: 'var(--font-space-mono), monospace'
                        }}>
                          {player.agent?.toUpperCase() || 'AGENT'}
                        </span>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '24px'
                    }}>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          fontSize: '10px',
                          color: '#999999',
                          fontFamily: 'var(--font-space-mono), monospace',
                          display: 'block'
                        }}>DEATHS</span>
                        <span style={{
                          fontSize: '18px',
                          fontWeight: 700,
                          color: '#FFFFFF'
                        }}>{player.deaths}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          fontSize: '10px',
                          color: '#FF0000',
                          fontFamily: 'var(--font-space-mono), monospace',
                          display: 'block'
                        }}>DRINKS</span>
                        <span style={{
                          fontSize: '18px',
                          fontWeight: 700,
                          color: '#FF0000'
                        }}>{player.drinks}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginTop: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button
            type="button"
            onClick={handleNewGame}
            style={{
              height: '60px',
              padding: '0 32px',
              backgroundColor: '#FF0000',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: 'pointer'
            }}
          >
            <Play style={{ width: '22px', height: '22px', color: '#0C0C0C' }} />
            <span style={{
              fontSize: '15px',
              fontWeight: 700,
              letterSpacing: '2px',
              color: '#0C0C0C'
            }}>
              NEW GAME
            </span>
          </button>
          <button
            type="button"
            onClick={handleHome}
            style={{
              height: '60px',
              padding: '0 32px',
              backgroundColor: '#2A2A2A',
              border: '2px solid #666666',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: 'pointer'
            }}
          >
            <Home style={{ width: '22px', height: '22px', color: '#FFFFFF' }} />
            <span style={{
              fontSize: '15px',
              fontWeight: 600,
              letterSpacing: '1px',
              color: '#FFFFFF',
              fontFamily: 'var(--font-space-mono), monospace'
            }}>
              HOME
            </span>
          </button>
        </div>
      </motion.div>
    </main>
  );
}
