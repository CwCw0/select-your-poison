'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Skull, Beer, Check, X, Dices, Clock, Trophy, Copy, Play,
  HelpCircle, Target, ChevronDown, ChevronUp, AlertCircle,
} from 'lucide-react';
import { useGameStore, useCurrentPlayer, useIsHost, useHasMode, useIsOvertime, useCurrentMultiplier } from '@/store/game-store';
import { formatRound } from '@/lib/utils';
import { stratCategoryColors, stratCategoryLabels } from '@/lib/strats';
import { AGENT_DRINKING_RULES, getAgentColor } from '@/lib/constants';
import { hapticWin, hapticLoss, hapticSuccess, hapticWarning } from '@/lib/haptics';

import PlayerCard from '@/components/game/PlayerCard';
import StratRouletteModal from '@/components/game/StratRouletteModal';
import HalftimeScreen from '@/components/game/HalftimeScreen';
import OvertimeScreen from '@/components/game/OvertimeScreen';
import GameEndScreen from '@/components/game/GameEndScreen';

export default function GamePage() {
  const params = useParams();
  const lobbyId = params.id as string;

  const {
    lobbyCode, settings, game, players, fetchLobby, endGameOnServer,
    switchSidesOnServer, roundWonOnServer, roundLostOnServer,
    addDeathOnServer, addDrinkOnServer, rollStratOnServer,
    rerollStratOnServer, skipStratOnServer, connectSSE, disconnectSSE,
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
  const [stratNotification, setStratNotification] = useState<{ type: 'success' | 'failure'; message: string } | null>(null);
  const [roundOutcomeStep, setRoundOutcomeStep] = useState<'round' | 'strat' | null>(null);
  const [selectedRoundWon, setSelectedRoundWon] = useState<boolean | null>(null);
  const [capturedStratPenalty, setCapturedStratPenalty] = useState<number>(0);
  const [overtimeAnnouncementSeen, setOvertimeAnnouncementSeen] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  useEffect(() => {
    if (!lobbyCode) fetchLobby();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // SSE for real-time updates, with slow polling fallback
  useEffect(() => {
    connectSSE();
    // Fallback polling at 10s in case SSE drops
    const interval = setInterval(() => fetchLobby(), 10000);
    return () => {
      disconnectSSE();
      clearInterval(interval);
    };
  }, [connectSSE, disconnectSSE, fetchLobby]);

  useEffect(() => {
    if (game.currentStrat && hasStratRoulette && game.currentStrat.id !== lastSeenStratId) {
      setShowStratModal(true);
      setLastSeenStratId(game.currentStrat.id);
    } else if (!game.currentStrat && lastSeenStratId) {
      setLastSeenStratId(null);
    }
  }, [game.currentStrat, hasStratRoulette, lastSeenStratId]);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(lobbyId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAcceptStrat = () => setShowStratModal(false);
  const handleReroll = () => { if (game.rerollsLeft > 0) rerollStratOnServer(); };
  const handleSkipStrat = () => { skipStratOnServer(); setShowStratModal(false); };

  const handleRoundOutcomeSelection = (roundWon: boolean) => {
    roundWon ? hapticWin() : hapticLoss();
    setCapturedStratPenalty(game.currentStrat?.penalty ?? 0);
    setSelectedRoundWon(roundWon);
    setRoundOutcomeStep('strat');
  };

  const handleStratOutcomeSelection = async (stratCompleted: boolean) => {
    if (selectedRoundWon === null) return;

    if (selectedRoundWon) await roundWonOnServer();
    else await roundLostOnServer();

    if (stratCompleted) {
      hapticSuccess();
      setStratNotification({ type: 'success', message: "Strat completed! Safe from penalty drinks..." });
      setTimeout(() => setStratNotification(null), 3000);
    } else if (capturedStratPenalty > 0) {
      hapticWarning();
      setStratNotification({ type: 'failure', message: `Strat failed! Everyone drinks ${capturedStratPenalty}x!` });
      for (const player of players) {
        await addDrinkOnServer(player.id, capturedStratPenalty);
      }
      setTimeout(() => setStratNotification(null), 4000);
    }

    skipStratOnServer();
    setTimeout(() => rollStratOnServer(), stratCompleted ? 2000 : 3000);
    setRoundOutcomeStep(null);
    setSelectedRoundWon(null);
    setCapturedStratPenalty(0);
  };

  const totalDeaths = players.reduce((sum, p) => sum + p.deaths, 0);
  const totalDrinks = players.reduce((sum, p) => sum + p.drinks, 0);

  if (game.status === 'ended') return <GameEndScreen />;
  if (game.status === 'halftime') return <HalftimeScreen />;
  if (game.status === 'overtime' && !overtimeAnnouncementSeen) {
    return <OvertimeScreen onDismiss={() => setOvertimeAnnouncementSeen(true)} />;
  }

  const modeColors: Record<string, string> = {
    classic: '#EF4444', agent_poison: '#A855F7', strat_roulette: '#FF0000',
    challenges: '#F59E0B', punishment: '#EF4444',
  };

  return (
    <main className="min-h-screen h-screen bg-[#0C0C0C] flex overflow-hidden">
      {/* ─── Desktop Sidebar ─── */}
      <aside className="hidden lg:flex" style={{
        width: '380px', backgroundColor: '#0A0A0A', flexDirection: 'column',
        gap: '24px', padding: '24px', borderRight: '1px solid #444444',
        height: '100vh', overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Skull style={{ width: '20px', height: '20px', color: '#0C0C0C' }} />
            </div>
            <span style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '2px', color: '#FFFFFF' }}>SYP</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button type="button" onClick={() => setShowHelp(!showHelp)} style={{
              width: '36px', height: '36px', border: '1px solid #555555', backgroundColor: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <HelpCircle style={{ width: '16px', height: '16px', color: '#CCCCCC' }} />
            </button>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
              backgroundColor: 'rgba(255, 0, 0, 0.15)', border: '1px solid #FF0000',
            }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#FF0000', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', color: '#FF0000', fontFamily: 'var(--font-space-mono), monospace' }}>LIVE</span>
            </div>
          </div>
        </div>

        {/* Help */}
        <AnimatePresence>
          {showHelp && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ backgroundColor: '#1A1A1A', border: '1px solid #444444', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle style={{ width: '16px', height: '16px', color: '#22D3EE' }} />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#22D3EE', letterSpacing: '1px' }}>HOW TO PLAY</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#DDDDDD', fontFamily: 'var(--font-space-mono), monospace', lineHeight: 1.6 }}>
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
        <div style={{ padding: '20px 0', borderTop: '1px solid #444444', borderBottom: '1px solid #444444', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#CCCCCC', fontFamily: 'var(--font-space-mono), monospace' }}>ROUND</span>
            <span style={{ padding: '6px 12px', backgroundColor: 'rgba(255, 0, 0, 0.2)', border: '1px solid #FF0000', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color: '#FF0000', fontFamily: 'var(--font-space-mono), monospace' }}>
              {game.side.toUpperCase()} SIDE
            </span>
          </div>
          <div style={{ fontSize: '64px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-2px', lineHeight: 1 }}>{formatRound(game.round)}</div>

          {/* Score Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: game.teamScore >= game.enemyScore ? '#22C55E' : '#FFFFFF' }}>{game.teamScore}</span>
              <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', color: '#555555', fontFamily: 'var(--font-space-mono), monospace' }}>SCORE</span>
              <span style={{ fontSize: '28px', fontWeight: 800, color: game.enemyScore >= game.teamScore ? '#EF4444' : '#FFFFFF' }}>{game.enemyScore}</span>
            </div>
            <div style={{ display: 'flex', height: '6px', gap: '2px', overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${Math.max(5, (game.teamScore / Math.max(game.teamScore + game.enemyScore, 1)) * 100)}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{ backgroundColor: '#22C55E', minWidth: '4px' }}
              />
              <motion.div
                animate={{ width: `${Math.max(5, (game.enemyScore / Math.max(game.teamScore + game.enemyScore, 1)) * 100)}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{ backgroundColor: '#EF4444', minWidth: '4px' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '1px', color: '#22C55E', fontFamily: 'var(--font-space-mono), monospace' }}>TEAM</span>
              <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '1px', color: '#EF4444', fontFamily: 'var(--font-space-mono), monospace' }}>ENEMY</span>
            </div>
          </div>

          {isOvertime && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              style={{ padding: '12px 16px', backgroundColor: 'rgba(255, 0, 0, 0.3)', border: '2px solid #FF0000', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
              <motion.div animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                style={{ width: '12px', height: '12px', backgroundColor: '#FF0000', borderRadius: '50%' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', color: '#FF0000', fontFamily: 'var(--font-space-mono), monospace' }}>SUDDEN DEATH ACTIVE</span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>{currentMultiplier}X DRINK MULTIPLIER</span>
              </div>
            </motion.div>
          )}

          {isHost && !hasStratRoulette && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px' }}>
              <button type="button" onClick={roundWonOnServer} style={{ height: '56px', backgroundColor: '#22C55E', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer' }}>
                <Trophy style={{ width: '20px', height: '20px', color: '#0C0C0C' }} />
                <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '2px', color: '#0C0C0C' }}>ROUND WON</span>
              </button>
              <button type="button" onClick={roundLostOnServer} style={{ height: '56px', backgroundColor: '#EF4444', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px', color: '#FFFFFF' }} />
                <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '2px', color: '#FFFFFF' }}>ROUND LOST</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#CCCCCC', fontFamily: 'var(--font-space-mono), monospace' }}>QUICK ACTIONS</span>
          {hasStratRoulette && (
            <button type="button" onClick={() => { rollStratOnServer(); setShowStratModal(true); }}
              style={{ height: '56px', backgroundColor: '#FF0000', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer' }}>
              <Dices style={{ width: '20px', height: '20px', color: '#0C0C0C' }} />
              <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '2px', color: '#0C0C0C' }}>ROLL STRAT</span>
            </button>
          )}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" onClick={switchSidesOnServer} style={{ flex: 1, height: '48px', backgroundColor: '#2A2A2A', border: '2px solid #666666', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px', color: '#FFFFFF', fontFamily: 'var(--font-space-mono), monospace' }}>SWITCH SIDES</span>
            </button>
            <button type="button" onClick={() => setShowEndConfirm(true)} style={{ flex: 1, height: '48px', backgroundColor: 'rgba(239, 68, 68, 0.25)', border: '2px solid #EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px', color: '#EF4444', fontFamily: 'var(--font-space-mono), monospace' }}>END GAME</span>
            </button>
          </div>
        </div>

        {/* Agent Rules */}
        {hasAgentPoison && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button type="button" onClick={() => setShowAgentRules(!showAgentRules)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
              background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target style={{ width: '16px', height: '16px', color: '#A855F7' }} />
                <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#A855F7', fontFamily: 'var(--font-space-mono), monospace' }}>YOUR AGENT RULES</span>
              </div>
              {showAgentRules ? <ChevronUp style={{ width: '16px', height: '16px', color: '#A855F7' }} /> : <ChevronDown style={{ width: '16px', height: '16px', color: '#A855F7' }} />}
            </button>
            <AnimatePresence>
              {showAgentRules && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', border: '1px solid #A855F7', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>
                  {currentPlayer?.agent ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '24px', height: '24px', backgroundColor: getAgentColor(currentPlayer.agent) }} />
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '1px' }}>{currentPlayer.agent.toUpperCase()}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(AGENT_DRINKING_RULES[currentPlayer.agent.toLowerCase()] || []).map((rule, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                            <div style={{ width: '6px', height: '6px', backgroundColor: '#A855F7', marginTop: '6px', flexShrink: 0 }} />
                            <span style={{ fontSize: '12px', color: '#DDDDDD', fontFamily: 'var(--font-space-mono), monospace', lineHeight: 1.5 }}>{rule}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle style={{ width: '16px', height: '16px', color: '#F59E0B' }} />
                      <span style={{ fontSize: '12px', color: '#F59E0B', fontFamily: 'var(--font-space-mono), monospace' }}>No agent selected - select an agent in lobby to see rules</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {!hasAgentPoison && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: '#1A1A1A', border: '1px solid #444444' }}>
            <Target style={{ width: '16px', height: '16px', color: '#888888' }} />
            <span style={{ fontSize: '11px', color: '#888888', fontFamily: 'var(--font-space-mono), monospace' }}>Enable AGENT POISON mode for agent-specific rules</span>
          </div>
        )}

        {/* Current Strat */}
        {hasStratRoulette && game.currentStrat && (
          <div style={{ backgroundColor: 'rgba(255, 0, 0, 0.1)', border: '1px solid #FF0000', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '2px', color: '#FF0000', fontFamily: 'var(--font-space-mono), monospace' }}>ACTIVE STRAT</span>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.5 }}>&quot;{game.currentStrat.text}&quot;</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '4px 12px', backgroundColor: stratCategoryColors[game.currentStrat.category] }}>
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color: '#0C0C0C', fontFamily: 'var(--font-space-mono), monospace' }}>{stratCategoryLabels[game.currentStrat.category]}</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#CCCCCC', fontFamily: 'var(--font-space-mono), monospace' }}>Fail = {game.currentStrat.penalty} drinks</span>
            </div>
          </div>
        )}

        {/* Lobby Code */}
        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #444444' }}>
          <button type="button" onClick={handleCopyCode} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', backgroundColor: '#1A1A1A', border: '1px solid #555555', cursor: 'pointer',
          }}>
            <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', color: '#CCCCCC', fontFamily: 'var(--font-space-mono), monospace' }}>LOBBY CODE</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '2px', color: '#FF0000' }}>{lobbyId}</span>
              {copied ? <Check style={{ width: '16px', height: '16px', color: '#22C55E' }} /> : <Copy style={{ width: '16px', height: '16px', color: '#888888' }} />}
            </div>
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px', gap: '24px', overflowY: 'auto' }} className="pt-20 lg:pt-8 pb-24 lg:pb-8">
        <header style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }} className="lg:flex-row lg:items-center lg:justify-between">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '1px', color: '#FFFFFF' }}>LIVE TRACKER</h1>
            <p style={{ fontSize: '13px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace' }}>Click player cards to track deaths and drinks</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="lg:flex lg:gap-8">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', padding: '16px 24px', backgroundColor: '#1A1A1A', border: '1px solid #333333' }}>
              <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace' }}>TOTAL DEATHS</span>
              <span style={{ fontSize: '32px', fontWeight: 800, color: '#FFFFFF' }}>{totalDeaths}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', padding: '16px 24px', backgroundColor: 'rgba(255, 0, 0, 0.1)', border: '1px solid #FF0000' }}>
              <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', color: '#FF0000', fontFamily: 'var(--font-space-mono), monospace' }}>TOTAL DRINKS</span>
              <span style={{ fontSize: '32px', fontWeight: 800, color: '#FF0000' }}>{totalDrinks}</span>
            </div>
          </div>
        </header>

        {/* Active Modes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', color: '#666666', fontFamily: 'var(--font-space-mono), monospace' }}>ACTIVE MODES:</span>
          {settings.modes.map((mode) => {
            const color = modeColors[mode] || '#CCCCCC';
            return (
              <span key={mode} style={{ padding: '6px 12px', backgroundColor: `${color}15`, border: `1px solid ${color}`, fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color, fontFamily: 'var(--font-space-mono), monospace' }}>
                {mode.toUpperCase().replace('_', ' ')}
              </span>
            );
          })}
        </div>

        {/* Active Strat Banner */}
        {hasStratRoulette && game.currentStrat && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            style={{
              width: '100%', padding: '32px',
              background: `linear-gradient(135deg, ${stratCategoryColors[game.currentStrat.category]}15 0%, ${stratCategoryColors[game.currentStrat.category]}08 100%)`,
              border: `2px solid ${stratCategoryColors[game.currentStrat.category]}`, position: 'relative', overflow: 'hidden',
            }}>
            <motion.div animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `radial-gradient(circle at 50% 50%, ${stratCategoryColors[game.currentStrat.category]}20 0%, transparent 70%)`, pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                    <Target style={{ width: '28px', height: '28px', color: stratCategoryColors[game.currentStrat.category] }} />
                  </motion.div>
                  <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '3px', color: stratCategoryColors[game.currentStrat.category], fontFamily: 'var(--font-space-mono), monospace' }}>ACTIVE STRAT</span>
                </div>
                <div style={{ padding: '8px 20px', backgroundColor: stratCategoryColors[game.currentStrat.category] }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '2px', color: '#0C0C0C', fontFamily: 'var(--font-space-mono), monospace' }}>{stratCategoryLabels[game.currentStrat.category]}</span>
                </div>
              </div>

              <h3 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.3, letterSpacing: '-1px', margin: 0 }}>&quot;{game.currentStrat.text}&quot;</h3>
              <p style={{ fontSize: '16px', color: '#CCCCCC', lineHeight: 1.6, margin: 0, maxWidth: '800px' }}>{game.currentStrat.description}</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', backgroundColor: 'rgba(255, 0, 0, 0.2)', border: '1px solid #FF0000' }}>
                  <Beer style={{ width: '20px', height: '20px', color: '#FF0000' }} />
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#FF0000', fontFamily: 'var(--font-space-mono), monospace' }}>+{game.currentStrat.penalty} DRINKS IF FAILED</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock style={{ width: '18px', height: '18px', color: '#999999' }} />
                  <span style={{ fontSize: '14px', color: '#CCCCCC', fontFamily: 'var(--font-space-mono), monospace' }}>
                    {game.currentStrat.duration === 'round' ? 'THIS ROUND' : game.currentStrat.duration === 'half' ? 'THIS HALF' : 'ENTIRE GAME'}
                  </span>
                </div>

                {isHost && (
                  <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {roundOutcomeStep === 'strat' ? (
                      <>
                        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace', textAlign: 'center' }}>DID YOU COMPLETE THE STRAT?</span>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <button type="button" onClick={() => handleStratOutcomeSelection(true)} className="hover:scale-105 transition-transform"
                            style={{ padding: '14px 20px', backgroundColor: '#22C55E', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', minHeight: '72px' }}>
                            <Check style={{ width: '20px', height: '20px', color: '#0C0C0C' }} />
                            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px', color: '#0C0C0C', fontFamily: 'var(--font-space-mono), monospace' }}>YES</span>
                            <span style={{ fontSize: '9px', color: '#0C0C0C', fontFamily: 'var(--font-space-mono), monospace', opacity: 0.7 }}>No drinks</span>
                          </button>
                          <button type="button" onClick={() => handleStratOutcomeSelection(false)} className="hover:scale-105 transition-transform"
                            style={{ padding: '14px 20px', backgroundColor: '#EF4444', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', minHeight: '72px' }}>
                            <X style={{ width: '20px', height: '20px', color: '#0C0C0C' }} />
                            <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px', color: '#0C0C0C', fontFamily: 'var(--font-space-mono), monospace' }}>NO</span>
                            <span style={{ fontSize: '9px', color: '#0C0C0C', fontFamily: 'var(--font-space-mono), monospace', opacity: 0.7 }}>+{capturedStratPenalty} drinks</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace', textAlign: 'center' }}>ROUND OUTCOME</span>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <button type="button" onClick={() => handleRoundOutcomeSelection(true)} className="hover:scale-105 transition-transform"
                            style={{ padding: '14px 20px', backgroundColor: '#22C55E', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', minHeight: '72px' }}>
                            <Trophy style={{ width: '20px', height: '20px', color: '#0C0C0C' }} />
                            <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '1.5px', color: '#0C0C0C', fontFamily: 'var(--font-space-mono), monospace' }}>WON</span>
                          </button>
                          <button type="button" onClick={() => handleRoundOutcomeSelection(false)} className="hover:scale-105 transition-transform"
                            style={{ padding: '14px 20px', backgroundColor: '#EF4444', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', minHeight: '72px' }}>
                            <Skull style={{ width: '20px', height: '20px', color: '#0C0C0C' }} />
                            <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '1.5px', color: '#0C0C0C', fontFamily: 'var(--font-space-mono), monospace' }}>LOST</span>
                          </button>
                        </div>
                      </>
                    )}
                    <button type="button" onClick={() => { setRoundOutcomeStep(null); setSelectedRoundWon(null); rollStratOnServer(); setShowStratModal(true); }}
                      style={{ padding: '10px 16px', backgroundColor: '#2A2A2A', border: '2px solid #666666', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                      <Dices style={{ width: '16px', height: '16px', color: '#FFFFFF' }} />
                      <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1px', color: '#FFFFFF', fontFamily: 'var(--font-space-mono), monospace' }}>NEW STRAT</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Player Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', flex: 1, alignContent: 'start' }}>
          {players.length > 0 ? (
            players.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                isCurrentPlayer={player.id === currentPlayer?.id}
                onAddDeath={() => addDeathOnServer(player.id)}
                onAddDrink={() => addDrinkOnServer(player.id, 1)}
                agentColor={getAgentColor(player.agent)}
                hasAgentPoison={hasAgentPoison}
              />
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #333333', minHeight: '400px', padding: '40px' }}>
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <AlertCircle style={{ width: '64px', height: '64px', color: '#FF0000', margin: '0 auto' }} />
                <p style={{ color: '#CCCCCC', fontFamily: 'var(--font-space-mono), monospace', fontSize: '14px' }}>No players in lobby</p>
                <Link href="/lobby/create" style={{ padding: '12px 24px', backgroundColor: '#FF0000', color: '#0C0C0C', fontWeight: 700, fontSize: '12px', letterSpacing: '1px', textDecoration: 'none', display: 'inline-block' }}>
                  CREATE NEW LOBBY
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Mobile Header ─── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#0A0A0A] border-b border-[#333333] z-50" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="h-14 flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF0000] flex items-center justify-center">
              <Skull className="w-4 h-4 text-[#0C0C0C]" />
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-bold text-white font-mono">R{game.round}</span>
            <div className="flex items-center gap-1">
              <span className="text-[18px] font-extrabold font-mono" style={{ color: game.teamScore >= game.enemyScore ? '#22C55E' : '#FFFFFF' }}>{game.teamScore}</span>
              <span className="text-[14px] font-light text-[#555555]">-</span>
              <span className="text-[18px] font-extrabold font-mono" style={{ color: game.enemyScore >= game.teamScore ? '#EF4444' : '#FFFFFF' }}>{game.enemyScore}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-[#FF0000]/13 border border-[#FF0000]">
              <div className="w-2 h-2 bg-[#FF0000] animate-pulse" />
              <span className="text-[9px] font-bold tracking-[1px] text-[#FF0000] font-mono">LIVE</span>
            </div>
          </div>
        </div>
        {/* Mini score bar */}
        <div style={{ display: 'flex', height: '3px' }}>
          <div style={{ width: `${Math.max(5, (game.teamScore / Math.max(game.teamScore + game.enemyScore, 1)) * 100)}%`, backgroundColor: '#22C55E', transition: 'width 0.5s ease-out' }} />
          <div style={{ flex: 1, backgroundColor: '#EF4444' }} />
        </div>
      </div>

      {/* ─── Mobile Controls FAB ─── */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {showMobileControls && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="flex flex-col gap-2 mb-2"
              style={{ width: '200px' }}
            >
              {isHost && !hasStratRoulette && (
                <>
                  <button type="button" onClick={() => { roundWonOnServer(); setShowMobileControls(false); }}
                    className="w-full h-12 bg-[#22C55E] flex items-center justify-center gap-2 active:scale-95 transition-transform">
                    <Trophy className="w-5 h-5 text-[#0C0C0C]" />
                    <span className="text-sm font-bold tracking-wider text-[#0C0C0C]">ROUND WON</span>
                  </button>
                  <button type="button" onClick={() => { roundLostOnServer(); setShowMobileControls(false); }}
                    className="w-full h-12 bg-[#EF4444] flex items-center justify-center gap-2 active:scale-95 transition-transform">
                    <X className="w-5 h-5 text-white" />
                    <span className="text-sm font-bold tracking-wider text-white">ROUND LOST</span>
                  </button>
                </>
              )}
              {hasStratRoulette && (
                <button type="button" onClick={() => { rollStratOnServer(); setShowStratModal(true); setShowMobileControls(false); }}
                  className="w-full h-12 bg-[#FF0000] flex items-center justify-center gap-2 active:scale-95 transition-transform">
                  <Dices className="w-5 h-5 text-[#0C0C0C]" />
                  <span className="text-sm font-bold tracking-wider text-[#0C0C0C]">ROLL STRAT</span>
                </button>
              )}
              <button type="button" onClick={() => { switchSidesOnServer(); setShowMobileControls(false); }}
                className="w-full h-12 bg-[#2A2A2A] border-2 border-[#666666] flex items-center justify-center active:scale-95 transition-transform">
                <span className="text-xs font-bold tracking-wider text-white font-mono">SWITCH SIDES</span>
              </button>
              <button type="button" onClick={() => { setShowEndConfirm(true); setShowMobileControls(false); }}
                className="w-full h-12 bg-[#EF4444]/25 border-2 border-[#EF4444] flex items-center justify-center active:scale-95 transition-transform">
                <span className="text-xs font-bold tracking-wider text-[#EF4444] font-mono">END GAME</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setShowMobileControls(!showMobileControls)}
          className="w-14 h-14 bg-[#FF0000] rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 active:scale-95 transition-transform"
        >
          <motion.div animate={{ rotate: showMobileControls ? 45 : 0 }} transition={{ duration: 0.2 }}>
            <Play className="w-6 h-6 text-[#0C0C0C]" />
          </motion.div>
        </button>
      </div>

      {/* ─── Strat Modal ─── */}
      <AnimatePresence>
        {showStratModal && game.currentStrat && (
          <StratRouletteModal strat={game.currentStrat} rerollsLeft={game.rerollsLeft} onAccept={handleAcceptStrat} onReroll={handleReroll} onSkip={handleSkipStrat} />
        )}
      </AnimatePresence>

      {/* ─── Strat Notification ─── */}
      <AnimatePresence>
        {stratNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-100 px-10 py-6 min-w-75 md:min-w-100 max-w-[90vw] text-center"
            style={{
              backgroundColor: stratNotification.type === 'success' ? '#22C55E' : '#EF4444',
              border: `3px solid ${stratNotification.type === 'success' ? '#16A34A' : '#DC2626'}`,
              boxShadow: stratNotification.type === 'success'
                ? '0 10px 40px rgba(34, 197, 94, 0.4)'
                : '0 10px 40px rgba(239, 68, 68, 0.4)',
            }}
          >
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 0.5, repeat: stratNotification.type === 'failure' ? 2 : 0 }}>
              <span className="text-xl md:text-[28px] font-extrabold tracking-wider text-[#0C0C0C] font-mono uppercase">
                {stratNotification.message}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── End Game Confirmation ─── */}
      <AnimatePresence>
        {showEndConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '32px',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                maxWidth: '400px', width: '100%', backgroundColor: '#1A1A1A',
                border: '2px solid #EF4444', padding: '32px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', textAlign: 'center',
              }}
            >
              <AlertCircle style={{ width: '48px', height: '48px', color: '#EF4444' }} />
              <div>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-1px' }}>END GAME?</h3>
                <p style={{ fontSize: '14px', color: '#999999', marginTop: '8px', fontFamily: 'var(--font-space-mono), monospace' }}>
                  This will end the match for everyone. This cannot be undone.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                <button
                  type="button"
                  onClick={() => setShowEndConfirm(false)}
                  style={{
                    flex: 1, height: '48px', backgroundColor: '#2A2A2A', border: '2px solid #666666',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '1px', color: '#FFFFFF', fontFamily: 'var(--font-space-mono), monospace' }}>CANCEL</span>
                </button>
                <button
                  type="button"
                  onClick={() => { endGameOnServer(); setShowEndConfirm(false); }}
                  style={{
                    flex: 1, height: '48px', backgroundColor: '#EF4444', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '1px', color: '#0C0C0C', fontFamily: 'var(--font-space-mono), monospace' }}>END IT</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
