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
import { agentColors as importedColors, agents } from '@/lib/agents';
import MobileControls from '@/components/game/MobileControls';

// Use agent data from lib instead of inline duplicates
const agentColors: Record<string, string> = importedColors as Record<string, string>;

// Build agentRules lookup from lib/agents.ts
const agentRules: Record<string, string[]> = {};
agents.forEach(a => {
  agentRules[a.id] = a.rules.map(r => `${r.rule} → ${r.drinks} drink${r.drinks > 1 ? 's' : ''}`);
});


export default function GamePage() {
  const params = useParams();
  const lobbyId = params.id as string;

  const {
    status,
    settings,
    game,
    players,
    startGame,
    endGame,
    switchSides,
    roundWon,
    roundLost,
    addDeath,
    addDrink,
    rollStrat,
    acceptStrat,
    rerollStrat,
    skipStrat,
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

  // Start game if not started
  useEffect(() => {
    if (status === 'waiting') {
      startGame();
    }
  }, [status, startGame]);

  // Show strat modal when new strat is rolled
  useEffect(() => {
    if (game.currentStrat && hasStratRoulette) {
      setShowStratModal(true);
    }
  }, [game.round, hasStratRoulette, game.currentStrat]);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(lobbyId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAcceptStrat = () => {
    acceptStrat();
    setShowStratModal(false);
  };

  const handleReroll = () => {
    if (game.rerollsLeft > 0) {
      rerollStrat();
    }
  };

  const handleSkipStrat = () => {
    skipStrat();
    setShowStratModal(false);
  };

  // Calculate totals
  const totalDeaths = players.reduce((sum, p) => sum + p.deaths, 0);
  const totalDrinks = players.reduce((sum, p) => sum + p.drinks, 0);

  // If game ended, show summary
  if (status === 'ended') {
    return <GameEndScreen />;
  }

  // If halftime, show halftime screen
  if (status === 'halftime') {
    return <HalftimeScreen />;
  }

  // If overtime, show overlay
  if (status === 'overtime' && game.round === 25) {
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
                onClick={roundWon}
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
                onClick={roundLost}
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
                rollStrat();
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
              onClick={switchSides}
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
              onClick={endGame}
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
      }} className="pt-20 pb-20 lg:pt-8 lg:pb-0">
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
                onAddDeath={() => addDeath(player.id)}
                onAddDrink={() => addDrink(player.id)}
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

      {/* Mobile Controls */}
      <MobileControls
        round={game.round}
        teamScore={game.teamScore}
        enemyScore={game.enemyScore}
        isHost={isHost}
        hasStratRoulette={hasStratRoulette}
        rerollsLeft={game.rerollsLeft}
        isOvertime={isOvertime}
        currentMultiplier={currentMultiplier}
        onRoundWon={roundWon}
        onRoundLost={roundLost}
        onRollStrat={() => {
          rollStrat();
          setShowStratModal(true);
        }}
        onSwitchSides={switchSides}
        onEndGame={endGame}
      />

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
        {/* You indicator */}
        {isCurrentPlayer && (
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            padding: '2px 8px',
            backgroundColor: headerTextColor,
            opacity: 0.9,
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
  const { game, players } = useGameStore();

  const handleContinue = () => {
    useGameStore.setState({ status: 'in_progress' });
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
      </motion.div>
    </main>
  );
}

// Overtime Screen
function OvertimeScreen() {
  const handleContinue = () => {
    useGameStore.setState({ status: 'in_progress' });
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
      </motion.div>
    </main>
  );
}

// Game End Screen
function GameEndScreen() {
  const { game, players, leaveLobby } = useGameStore();
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
    leaveLobby();
    router.push('/lobby/create');
  };

  const handleHome = () => {
    leaveLobby();
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
