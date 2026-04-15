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
      <aside className="hidden lg:flex w-[380px] bg-[#0A0A0A] flex-col gap-6 p-6 border-r border-[#444444] h-screen overflow-y-auto">
        {/* Logo Row */}
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 bg-[#FF0000] flex items-center justify-center">
              <Skull className="w-5 h-5 text-[#0C0C0C]" />
            </div>
            <span className="text-base font-extrabold tracking-[2px] text-white">
              SYP
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="w-9 h-9 border border-[#555555] bg-transparent flex items-center justify-center cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-[#CCCCCC]" />
            </button>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#FF0000]/15 border border-[#FF0000]">
              <div className="w-2 h-2 bg-[#FF0000] animate-pulse" />
              <span className="text-[10px] font-bold tracking-[2px] text-[#FF0000] font-mono">
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
              className="bg-[#1A1A1A] border border-[#444444] p-4 flex flex-col gap-3 overflow-hidden"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-cyan-400 tracking-[1px]">HOW TO PLAY</span>
              </div>
              <div className="flex flex-col gap-2 text-xs text-[#DDDDDD] font-mono leading-relaxed">
                <p><span className="text-green-500 font-bold">1.</span> Track deaths by clicking + DEATH on player cards</p>
                <p><span className="text-green-500 font-bold">2.</span> Drinks auto-calculate based on game mode</p>
                <p><span className="text-green-500 font-bold">3.</span> Mark round results with WIN/LOSS buttons</p>
                <p><span className="text-green-500 font-bold">4.</span> Use ROLL STRAT for random challenges</p>
                <p className="text-[#FF0000] font-semibold mt-2">Remember: Drink responsibly!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Round Section */}
        <div className="py-5 border-t border-b border-[#444444] flex flex-col gap-3">
          <span className="text-[11px] font-semibold tracking-[2px] text-[#CCCCCC] font-mono">
            CURRENT ROUND
          </span>
          <div className="text-[64px] font-extrabold text-white tracking-[-2px] leading-none">
            {formatRound(game.round)}
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-[#FF0000]/20 border border-[#FF0000] text-xs font-bold tracking-[1px] text-[#FF0000] font-mono">
              {game.side.toUpperCase()}
            </span>
            <span className="text-lg font-bold tracking-[1px] text-white font-mono">
              {formatScore(game.teamScore, game.enemyScore)}
            </span>
          </div>

          {/* Overtime Multiplier Indicator */}
          {isOvertime && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 px-4 bg-[#FF0000]/30 border-2 border-[#FF0000] flex items-center gap-3 mt-2"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-3 h-3 bg-[#FF0000] rounded-full"
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-bold tracking-[2px] text-[#FF0000] font-mono">
                  SUDDEN DEATH ACTIVE
                </span>
                <span className="text-[13px] font-extrabold text-white">
                  {currentMultiplier}X DRINK MULTIPLIER
                </span>
              </div>
            </motion.div>
          )}

          {/* Round Controls */}
          {isHost && (
            <div className="flex flex-col gap-2 pt-4">
              <button
                type="button"
                onClick={roundWon}
                className="h-14 bg-green-500 border-none flex items-center justify-center gap-3 cursor-pointer hover:bg-green-600 transition-colors"
              >
                <Trophy className="w-5 h-5 text-[#0C0C0C]" />
                <span className="text-sm font-bold tracking-[2px] text-[#0C0C0C]">
                  ROUND WON
                </span>
              </button>
              <button
                type="button"
                onClick={roundLost}
                className="h-14 bg-red-500 border-none flex items-center justify-center gap-3 cursor-pointer hover:bg-red-600 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
                <span className="text-sm font-bold tracking-[2px] text-white">
                  ROUND LOST
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-semibold tracking-[2px] text-[#CCCCCC] font-mono">
            QUICK ACTIONS
          </span>
          {hasStratRoulette && (
            <button
              type="button"
              onClick={() => {
                rollStrat();
                setShowStratModal(true);
              }}
              className="h-14 bg-[#FF0000] border-none flex items-center justify-center gap-3 cursor-pointer hover:bg-[#DC2626] transition-colors"
            >
              <Dices className="w-5 h-5 text-[#0C0C0C]" />
              <span className="text-sm font-bold tracking-[2px] text-[#0C0C0C]">
                ROLL STRAT
              </span>
            </button>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={switchSides}
              className="flex-1 h-12 bg-[#2A2A2A] border-2 border-[#666666] flex items-center justify-center cursor-pointer hover:border-[#888888] hover:bg-[#333333] transition-colors"
            >
              <span className="text-xs font-bold tracking-[1px] text-white font-mono">
                SWITCH SIDES
              </span>
            </button>
            <button
              type="button"
              onClick={endGame}
              className="flex-1 h-12 bg-red-500/25 border-2 border-red-500 flex items-center justify-center cursor-pointer hover:bg-red-500/40 transition-colors"
            >
              <span className="text-xs font-bold tracking-[1px] text-red-500 font-mono">
                END GAME
              </span>
            </button>
          </div>
        </div>

        {/* Agent Rules Section - Always show if Agent Poison mode is enabled */}
        {hasAgentPoison && (
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setShowAgentRules(!showAgentRules)}
              className="flex items-center justify-between w-full bg-transparent border-none cursor-pointer p-0"
            >
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-500" />
                <span className="text-[11px] font-semibold tracking-[2px] text-purple-500 font-mono">
                  YOUR AGENT RULES
                </span>
              </div>
              {showAgentRules ? (
                <ChevronUp className="w-4 h-4 text-purple-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-purple-500" />
              )}
            </button>
            <AnimatePresence>
              {showAgentRules && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-purple-500/10 border border-purple-500 p-4 flex flex-col gap-3 overflow-hidden"
                >
                  {currentPlayer?.agent ? (
                    <>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6"
                          style={{
                            backgroundColor: agentColors[currentPlayer.agent.toLowerCase()] || '#7DD3FC'
                          }}
                        />
                        <span className="text-sm font-bold text-white tracking-[1px]">
                          {currentPlayer.agent.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {(agentRules[currentPlayer.agent.toLowerCase()] || []).map((rule, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-purple-500 mt-1.5 shrink-0" />
                            <span className="text-xs text-[#DDDDDD] font-mono leading-normal">
                              {rule}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <span className="text-xs text-amber-500 font-mono">
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
          <div className="flex items-center gap-2 p-3 bg-[#1A1A1A] border border-[#444444]">
            <Target className="w-4 h-4 text-[#888888]" />
            <span className="text-[11px] text-[#888888] font-mono">
              Enable AGENT POISON mode for agent-specific rules
            </span>
          </div>
        )}

        {/* Current Strat */}
        {hasStratRoulette && game.currentStrat && (
          <div className="bg-[#FF0000]/10 border border-[#FF0000] p-4 flex flex-col gap-3">
            <span className="text-[10px] font-semibold tracking-[2px] text-[#FF0000] font-mono">
              ACTIVE STRAT
            </span>
            <p className="text-sm font-semibold text-white leading-normal">
              &quot;{game.currentStrat.text}&quot;
            </p>
            <div className="flex items-center gap-3">
              <div
                className="px-3 py-1"
                style={{
                  backgroundColor: stratCategoryColors[game.currentStrat.category]
                }}
              >
                <span className="text-[10px] font-bold tracking-[1px] text-[#0C0C0C] font-mono">
                  {stratCategoryLabels[game.currentStrat.category]}
                </span>
              </div>
              <span className="text-xs font-medium text-[#CCCCCC] font-mono">
                Fail = {game.currentStrat.penalty} drinks
              </span>
            </div>
          </div>
        )}

        {/* Lobby Code */}
        <div className="mt-auto pt-4 border-t border-[#444444]">
          <button
            type="button"
            onClick={handleCopyCode}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#1A1A1A] border border-[#555555] cursor-pointer hover:bg-[#222222] hover:border-[#666666] transition-colors"
          >
            <span className="text-[10px] font-semibold tracking-[1px] text-[#CCCCCC] font-mono">
              LOBBY CODE
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-[2px] text-[#FF0000]">
                {lobbyId}
              </span>
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-[#888888]" />
              )}
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-8 gap-6 overflow-y-auto pt-20 pb-20 lg:pt-8 lg:pb-0">
        {/* Header - Responsive */}
        <header className="flex flex-col gap-6 w-full lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-[28px] font-extrabold tracking-[1px] text-white">
              LIVE TRACKER
            </h1>
            <p className="text-[13px] text-[#999999] font-mono">
              Click player cards to track deaths and drinks
            </p>
          </div>

          {/* Stats Summary - Grid on mobile, flex on desktop */}
          <div className="grid grid-cols-2 gap-4 lg:flex lg:gap-8">
            <div className="flex flex-col gap-1 items-center px-6 py-4 bg-[#1A1A1A] border border-[#333333]">
              <span className="text-[10px] font-semibold tracking-[1px] text-[#999999] font-mono">
                TOTAL DEATHS
              </span>
              <span className="text-[32px] font-extrabold text-white">
                {totalDeaths}
              </span>
            </div>
            <div className="flex flex-col gap-1 items-center px-6 py-4 bg-[#FF0000]/10 border border-[#FF0000]">
              <span className="text-[10px] font-semibold tracking-[1px] text-[#FF0000] font-mono">
                TOTAL DRINKS
              </span>
              <span className="text-[32px] font-extrabold text-[#FF0000]">
                {totalDrinks}
              </span>
            </div>
          </div>
        </header>

        {/* Active Modes Indicator */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[10px] font-semibold tracking-[1px] text-[#666666] font-mono">
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
                className="px-3 py-1.5 text-[10px] font-bold tracking-[1px] font-mono"
                style={{
                  backgroundColor: `${color}15`,
                  border: `1px solid ${color}`,
                  color: color,
                }}
              >
                {mode.toUpperCase().replace('_', ' ')}
              </span>
            );
          })}
        </div>

        {/* Player Cards - Responsive Grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 flex-1 content-start">
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
            <div className="col-span-full flex items-center justify-center border-2 border-dashed border-[#333333] min-h-[400px] p-10">
              <div className="text-center flex flex-col gap-4">
                <AlertCircle className="w-16 h-16 text-[#FF0000] mx-auto" />
                <p className="text-[#CCCCCC] font-mono text-sm">No players in lobby</p>
                <p className="text-[#666666] font-mono text-xs">Create a new lobby to start tracking</p>
                <Link
                  href="/lobby/create"
                  className="px-6 py-3 bg-[#FF0000] text-[#0C0C0C] font-bold text-xs tracking-[1px] no-underline inline-block hover:bg-[#DC2626] transition-colors"
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
      className="flex-1 min-w-[280px] flex flex-col overflow-hidden transition-[background-color,box-shadow] duration-200 ease-out"
      style={{
        backgroundColor: deathFlash ? 'rgba(239, 68, 68, 0.15)' : drinkFlash ? 'rgba(245, 158, 11, 0.15)' : '#0C0C0C',
        border: `2px solid ${agentColor}`,
        boxShadow: isCurrentPlayer ? `0 0 20px ${agentColor}40, inset 0 0 30px ${agentColor}10` : 'none',
      }}
    >
      {/* Header with gradient */}
      <div
        className="h-[60px] px-5 flex items-center justify-between relative"
        style={{
          background: `linear-gradient(135deg, ${agentColor} 0%, ${agentColor}CC 100%)`,
          borderBottom: `3px solid ${agentColor}`,
        }}
      >
        {/* You indicator */}
        {isCurrentPlayer && (
          <div
            className="absolute top-2 right-2 px-2 py-0.5 opacity-90"
            style={{ backgroundColor: headerTextColor }}
          >
            <span
              className="text-[8px] font-bold tracking-[1px] font-mono"
              style={{ color: agentColor }}
            >
              YOU
            </span>
          </div>
        )}
        <span
          className="text-[15px] font-extrabold tracking-[2px]"
          style={{ color: headerTextColor }}
        >
          {player.name || 'PLAYER'}
        </span>
        <span
          className="text-[11px] font-bold tracking-[1px] opacity-80 font-mono"
          style={{ color: headerTextColor }}
        >
          {player.agent?.toUpperCase() || 'AGENT'}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col p-5 gap-5">
        {/* Stats - Side by side with cleaner look */}
        <div className="flex gap-4">
          {/* Deaths stat */}
          <div className="flex-1 p-4 bg-[#1A1A1A] border border-[#333333] flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-white/30" />
            <span className="text-[10px] font-semibold tracking-[2px] text-[#888888] font-mono">
              DEATHS
            </span>
            <span className="text-[44px] font-extrabold text-white leading-none tracking-[-2px]">
              {player.deaths}
            </span>
          </div>
          {/* Drinks stat */}
          <div className="flex-1 p-4 bg-[#FF0000]/[0.08] border border-[#FF0000]/30 flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#FF0000]" />
            <span className="text-[10px] font-semibold tracking-[2px] text-[#FF0000] font-mono">
              DRINKS
            </span>
            <span className="text-[44px] font-extrabold text-[#FF0000] leading-none tracking-[-2px]">
              {player.drinks}
            </span>
          </div>
        </div>

        {/* Action Buttons - Improved styling */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            type="button"
            onClick={handleDeath}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-14 bg-[#1A1A1A] border-2 border-[#555555] border-l-4 border-l-white flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-150 ease-in-out hover:bg-[#252525] hover:border-[#888888] hover:shadow-[0_4px_12px_rgba(255,255,255,0.1)]"
          >
            <Skull className="w-[22px] h-[22px] text-white" />
            <span className="text-[13px] font-bold tracking-[1px] text-white font-mono">
              + DEATH
            </span>
          </motion.button>
          <motion.button
            type="button"
            onClick={handleDrink}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-14 bg-[#FF0000] border-t-0 border-r-0 border-b-0 border-l-4 border-l-[#CC0000] flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-150 ease-in-out hover:bg-[#DC2626] hover:shadow-[0_4px_12px_rgba(255,0,0,0.3)]"
          >
            <Beer className="w-[22px] h-[22px] text-[#0C0C0C]" />
            <span className="text-[13px] font-bold tracking-[1px] text-[#0C0C0C] font-mono">
              + DRINK
            </span>
          </motion.button>
        </div>

        {/* Agent Rules Toggle (if Agent Poison mode) */}
        {hasAgentPoison && playerRules.length > 0 && (
          <div className="border-t border-[#333333] pt-4">
            <button
              type="button"
              onClick={() => setShowRules(!showRules)}
              className="w-full flex items-center justify-between text-left bg-transparent border-none cursor-pointer py-2 px-0"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2"
                  style={{ backgroundColor: agentColor }}
                />
                <span className="text-[10px] font-semibold tracking-[2px] text-[#888888] font-mono">
                  AGENT RULES
                </span>
              </div>
              {showRules ? (
                <ChevronUp className="w-4 h-4 text-[#666666]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#666666]" />
              )}
            </button>
            <AnimatePresence>
              {showRules && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-2.5 mt-3 overflow-hidden pl-4"
                >
                  {playerRules.slice(0, 3).map((rule, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div
                        className="w-1 h-1 mt-1.5 shrink-0"
                        style={{ backgroundColor: agentColor }}
                      />
                      <span className="text-[11px] text-[#BBBBBB] font-mono leading-normal">
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
      className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="max-w-[600px] w-full flex flex-col items-center gap-8 text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <span className="text-xs font-semibold tracking-[4px] text-[#FF0000] font-mono">
          STRAT ROULETTE
        </span>

        <div
          className="px-6 py-3"
          style={{ backgroundColor: stratCategoryColors[strat.category] }}
        >
          <span className="text-sm font-bold tracking-[2px] text-[#0C0C0C] font-mono">
            {stratCategoryLabels[strat.category]}
          </span>
        </div>

        <h2 className="text-4xl font-extrabold text-white leading-tight tracking-[-2px] px-4">
          &quot;{strat.text}&quot;
        </h2>

        <p className="text-base text-[#CCCCCC] max-w-[400px] px-4 leading-relaxed">
          {strat.description}
        </p>

        <div className="flex items-center gap-8 flex-wrap justify-center">
          <div className="flex items-center gap-2">
            <Beer className="w-5 h-5 text-[#FF0000]" />
            <span className="text-sm text-[#CCCCCC] font-mono">
              +{strat.penalty} drinks if failed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#999999]" />
            <span className="text-sm text-[#CCCCCC] font-mono">
              {strat.duration === 'round' ? 'This round' : strat.duration === 'half' ? 'This half' : 'Entire game'}
            </span>
          </div>
        </div>

        <div className="flex gap-4 mt-4 flex-wrap justify-center">
          <button
            type="button"
            onClick={onAccept}
            className="h-[60px] px-8 bg-[#FF0000] border-none flex items-center justify-center gap-3 cursor-pointer hover:bg-[#DC2626] transition-colors"
          >
            <Check className="w-[22px] h-[22px] text-[#0C0C0C]" />
            <span className="text-[15px] font-bold tracking-[2px] text-[#0C0C0C]">
              ACCEPT FATE
            </span>
          </button>
          <button
            type="button"
            onClick={onReroll}
            disabled={rerollsLeft <= 0}
            className={`h-[60px] px-8 bg-[#2A2A2A] border-2 border-[#666666] flex items-center justify-center gap-3 transition-colors ${
              rerollsLeft > 0
                ? 'cursor-pointer opacity-100 hover:bg-[#333333] hover:border-[#888888]'
                : 'cursor-not-allowed opacity-50'
            }`}
          >
            <Dices className="w-[22px] h-[22px] text-white" />
            <span className="text-[15px] font-semibold tracking-[1px] text-white font-mono">
              REROLL ({rerollsLeft})
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={onSkip}
          className="text-[13px] text-[#999999] font-mono bg-none border-none cursor-pointer px-4 py-2 mt-2 hover:text-[#CCCCCC] transition-colors"
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
    <main className="min-h-screen bg-[#0C0C0C] flex items-center justify-center p-8">
      <motion.div
        className="max-w-[700px] w-full flex flex-col items-center gap-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="px-8 py-3 bg-amber-500">
          <span className="text-sm font-bold tracking-[2px] text-[#0C0C0C] font-mono">
            HALF TIME
          </span>
        </div>

        <h1 className="text-[56px] font-extrabold text-white tracking-[-2px]">
          SIDE SWAP
        </h1>

        <p className="text-lg text-[#CCCCCC] font-mono">
          Take a break. Grab a drink. Regroup.
        </p>

        <div className="flex items-center gap-8 mt-4">
          <div className="text-center">
            <span className="text-xs font-mono text-[#999999]">TEAM</span>
            <div className="text-[64px] font-extrabold text-green-500">
              {game.teamScore}
            </div>
          </div>
          <span className="text-[40px] font-light text-[#666666]">-</span>
          <div className="text-center">
            <span className="text-xs font-mono text-[#999999]">ENEMY</span>
            <div className="text-[64px] font-extrabold text-red-500">
              {game.enemyScore}
            </div>
          </div>
        </div>

        <div className="text-sm font-semibold tracking-[2px] text-amber-500 font-mono">
          {game.side === 'defense' ? 'ATTACK' : 'DEFENSE'} → {game.side.toUpperCase()}
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 mt-4 w-full">
          {players.map((player) => (
            <div key={player.id} className="p-4 bg-[#1A1A1A] border border-[#444444]">
              <span className="text-xs font-mono text-[#CCCCCC]">{player.name}</span>
              <div className="flex items-center justify-center gap-4 mt-2">
                <span className="text-xl font-bold text-white">{player.deaths}</span>
                <span className="text-xl font-bold text-[#FF0000]">{player.drinks}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="h-[60px] px-10 bg-[#FF0000] border-none flex items-center justify-center gap-3 cursor-pointer mt-4 hover:bg-[#DC2626] transition-colors"
        >
          <Play className="w-[22px] h-[22px] text-[#0C0C0C]" />
          <span className="text-[15px] font-bold tracking-[2px] text-[#0C0C0C]">
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
    <main className="min-h-screen bg-[#0C0C0C] flex items-center justify-center p-8">
      <motion.div
        className="max-w-[600px] w-full flex flex-col items-center gap-8 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="w-32 h-32 rounded-full bg-[#FF0000]/20 border-2 border-[#FF0000] flex items-center justify-center">
          <Trophy className="w-16 h-16 text-[#FF0000]" />
        </div>

        <div className="px-6 py-2 bg-[#FF0000]">
          <span className="text-sm font-bold tracking-[4px] text-[#0C0C0C] font-mono">
            OVERTIME
          </span>
        </div>

        <h1 className="text-[56px] font-extrabold text-white tracking-[-2px]">
          SUDDEN DEATH
        </h1>

        <p className="text-lg text-[#CCCCCC] font-mono">
          Score tied 12-12. First to win 2 rounds takes the match.
        </p>

        <div className="flex items-center gap-6 mt-4">
          <span className="text-[64px] font-extrabold text-green-500">12</span>
          <span className="text-[48px] font-light text-[#666666]">-</span>
          <span className="text-[64px] font-extrabold text-red-500">12</span>
        </div>

        <div className="p-6 bg-[#1A1A1A] border border-[#444444] w-full mt-4">
          <span className="text-[11px] font-semibold tracking-[2px] text-[#999999] font-mono">
            OVERTIME RULES
          </span>
          <ul className="flex flex-col gap-3 mt-4 text-left list-none p-0 m-0">
            <li className="text-sm text-[#CCCCCC] flex items-center gap-2 font-mono">
              <span className="text-[#FF0000]">•</span>
              2X DRINK MULTIPLIER on all deaths
            </li>
            <li className="text-sm text-[#CCCCCC] flex items-center gap-2 font-mono">
              <span className="text-[#FF0000]">•</span>
              First team to 14 wins
            </li>
            <li className="text-sm text-[#CCCCCC] flex items-center gap-2 font-mono">
              <span className="text-[#FF0000]">•</span>
              No mercy. Full send only.
            </li>
          </ul>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="h-[60px] px-10 bg-[#FF0000] border-none flex items-center justify-center gap-3 cursor-pointer mt-4 hover:bg-[#DC2626] transition-colors"
        >
          <Play className="w-[22px] h-[22px] text-[#0C0C0C]" />
          <span className="text-[15px] font-bold tracking-[2px] text-[#0C0C0C]">
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
    <main className="min-h-screen bg-[#0C0C0C] flex items-center justify-center p-8">
      <motion.div
        className="max-w-[700px] w-full flex flex-col items-center gap-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div
          className="px-8 py-3"
          style={{ backgroundColor: isVictory ? '#22C55E' : '#EF4444' }}
        >
          <span className="text-sm font-bold tracking-[2px] text-[#0C0C0C] font-mono">
            {isVictory ? 'VICTORY' : 'DEFEAT'}
          </span>
        </div>

        <h1 className="text-[56px] font-extrabold text-white tracking-[-2px]">
          GAME OVER
        </h1>

        {/* Final Score */}
        <div className="flex items-center gap-8 mt-4">
          <div className="text-center">
            <span className="text-xs font-mono text-[#999999]">TEAM</span>
            <div
              className="text-[72px] font-extrabold"
              style={{ color: isVictory ? '#22C55E' : '#FFFFFF' }}
            >
              {game.teamScore}
            </div>
          </div>
          <span className="text-[40px] font-light text-[#666666]">-</span>
          <div className="text-center">
            <span className="text-xs font-mono text-[#999999]">ENEMY</span>
            <div
              className="text-[72px] font-extrabold"
              style={{ color: !isVictory ? '#EF4444' : '#FFFFFF' }}
            >
              {game.enemyScore}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4 w-full">
          <div className="p-4 bg-[#1A1A1A] border border-[#444444]">
            <span className="text-[11px] font-mono text-[#999999]">TOTAL DEATHS</span>
            <div className="text-[28px] font-bold text-white mt-2">
              {totalDeaths}
            </div>
          </div>
          <div className="p-4 bg-[#FF0000]/10 border border-[#FF0000]/30">
            <span className="text-[11px] font-mono text-[#FF0000]">TOTAL DRINKS</span>
            <div className="text-[28px] font-bold text-[#FF0000] mt-2">
              {totalDrinks}
            </div>
          </div>
          <div className="p-4 bg-[#1A1A1A] border border-[#444444]">
            <span className="text-[11px] font-mono text-[#999999]">MOST DEATHS</span>
            <div className="text-base font-bold text-white mt-2">
              {mostDeaths?.name || 'N/A'}
            </div>
            {mostDeaths && (
              <span className="text-xs text-[#999999] font-mono">
                {mostDeaths.deaths} deaths
              </span>
            )}
          </div>
          <div className="p-4 bg-[#1A1A1A] border border-[#444444]">
            <span className="text-[11px] font-mono text-[#999999]">MOST DRINKS</span>
            <div className="text-base font-bold text-[#FF0000] mt-2">
              {mostDrinks?.name || 'N/A'}
            </div>
            {mostDrinks && (
              <span className="text-xs text-[#999999] font-mono">
                {mostDrinks.drinks} drinks
              </span>
            )}
          </div>
        </div>

        {/* Player Summary */}
        {players.length > 0 && (
          <div className="w-full mt-4">
            <span className="text-[11px] font-mono text-[#999999]">PLAYER RANKINGS</span>
            <div className="flex flex-col gap-2 mt-4">
              {sortedByDrinks.map((player, index) => {
                const playerAgentColor = agentColors[player.agent?.toLowerCase() || ''] || '#7DD3FC';
                return (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-4 bg-[#1A1A1A]"
                    style={{ borderLeft: `4px solid ${playerAgentColor}` }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-base font-bold text-[#999999]">#{index + 1}</span>
                      <div className="flex flex-col items-start">
                        <span className="font-bold text-white">{player.name}</span>
                        <span className="text-[10px] text-[#999999] font-mono">
                          {player.agent?.toUpperCase() || 'AGENT'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-[10px] text-[#999999] font-mono block">DEATHS</span>
                        <span className="text-lg font-bold text-white">{player.deaths}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#FF0000] font-mono block">DRINKS</span>
                        <span className="text-lg font-bold text-[#FF0000]">{player.drinks}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 mt-4 flex-wrap justify-center">
          <button
            type="button"
            onClick={handleNewGame}
            className="h-[60px] px-8 bg-[#FF0000] border-none flex items-center justify-center gap-3 cursor-pointer hover:bg-[#DC2626] transition-colors"
          >
            <Play className="w-[22px] h-[22px] text-[#0C0C0C]" />
            <span className="text-[15px] font-bold tracking-[2px] text-[#0C0C0C]">
              NEW GAME
            </span>
          </button>
          <button
            type="button"
            onClick={handleHome}
            className="h-[60px] px-8 bg-[#2A2A2A] border-2 border-[#666666] flex items-center justify-center gap-3 cursor-pointer hover:bg-[#333333] hover:border-[#888888] transition-colors"
          >
            <Home className="w-[22px] h-[22px] text-white" />
            <span className="text-[15px] font-semibold tracking-[1px] text-white font-mono">
              HOME
            </span>
          </button>
        </div>
      </motion.div>
    </main>
  );
}
