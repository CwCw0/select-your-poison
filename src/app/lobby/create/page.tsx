'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Copy, Check, Play } from 'lucide-react';
import { useGameStore } from '@/store/game-store';
import { GameMode, IntensityLevel, AgentType } from '@/types';
import WizardProgress from '@/components/lobby/WizardProgress';
import ModeSelector from '@/components/lobby/ModeSelector';
import IntensitySelector from '@/components/lobby/IntensitySelector';
import AgentSelector from '@/components/lobby/AgentSelector';

export default function CreateLobbyPage() {
  const router = useRouter();
  const { createLobby } = useGameStore();

  // Wizard state
  const [step, setStep] = useState(0);
  const [lobbyCreated, setLobbyCreated] = useState(false);
  const [lobbyId, setLobbyId] = useState<string | null>(null);

  // Form state
  const [playerName, setPlayerName] = useState('');
  const [selectedModes, setSelectedModes] = useState<GameMode[]>(['classic']);
  const [intensity, setIntensity] = useState<IntensityLevel>('ranked');
  const [maxPlayers, setMaxPlayers] = useState(5);
  const [selectedAgent, setSelectedAgent] = useState<AgentType | null>(null);

  // UI state
  const [copied, setCopied] = useState(false);

  const needsAgentStep = selectedModes.includes('agent_poison');
  const totalSteps = needsAgentStep ? 3 : 2;
  const stepLabels = needsAgentStep
    ? ['Modes', 'Settings', 'Agent']
    : ['Modes', 'Settings'];

  const handleToggleMode = (mode: GameMode) => {
    setSelectedModes((prev) => {
      if (prev.includes(mode)) {
        const next = prev.filter((m) => m !== mode);
        return next.length === 0 ? ['classic'] : next;
      }
      return [...prev, mode];
    });
  };

  const handleCreate = () => {
    if (!playerName.trim()) return;

    const newLobbyId = createLobby({
      modes: selectedModes,
      intensity,
      maxPlayers,
    });

    // Update host player name and agent
    useGameStore.setState((state) => ({
      players: state.players.map((p) =>
        p.isHost
          ? { ...p, name: playerName.trim().toUpperCase(), agent: selectedAgent }
          : p
      ),
    }));

    setLobbyId(newLobbyId);
    setLobbyCreated(true);
  };

  const handleCopy = async () => {
    if (!lobbyId) return;
    await navigator.clipboard.writeText(lobbyId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canProceed = () => {
    if (step === totalSteps - 1) {
      return playerName.trim().length >= 2;
    }
    return true;
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      handleCreate();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  // Lobby created — show code + invite
  if (lobbyCreated && lobbyId) {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center space-y-8"
        >
          <div>
            <div
              className="font-mono text-[10px] uppercase tracking-widest mb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              Lobby Created
            </div>
            <div
              className="font-mono text-4xl sm:text-5xl font-black tracking-tighter"
              style={{ color: 'var(--text-primary)' }}
            >
              {lobbyId}
            </div>
          </div>

          <div className="space-y-3">
            <motion.button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-lg border font-mono text-xs uppercase tracking-widest transition-colors"
              style={{
                backgroundColor: copied ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                borderColor: copied ? 'var(--accent-green)' : 'var(--border-default)',
                color: copied ? 'var(--accent-green)' : 'var(--text-secondary)',
              }}
              whileTap={{ scale: 0.97 }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Lobby Code'}
            </motion.button>

            <motion.button
              onClick={() => router.push(`/game/${lobbyId}`)}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-lg font-mono text-xs uppercase tracking-widest font-bold"
              style={{
                backgroundColor: 'var(--accent-red)',
                color: '#FFFFFF',
              }}
              whileTap={{ scale: 0.97 }}
            >
              <Play size={14} />
              Start Game
            </motion.button>
          </div>

          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Share the lobby code with your squad to join
          </div>
        </motion.div>
      </main>
    );
  }

  // Wizard steps
  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between p-4 border-b"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border-default)',
        }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest transition-colors hover:opacity-80"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={14} />
          Back
        </Link>
        <WizardProgress currentStep={step} totalSteps={totalSteps} labels={stepLabels} />
        <div className="w-16" /> {/* Spacer for centering */}
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {/* Step 0: Game Modes */}
            {step === 0 && (
              <motion.div
                key="modes"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h1
                    className="text-2xl sm:text-3xl font-black tracking-tight"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Choose Your Poison
                  </h1>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                    Select one or more game modes. They stack.
                  </p>
                </div>
                <ModeSelector selectedModes={selectedModes} onToggleMode={handleToggleMode} />
              </motion.div>
            )}

            {/* Step 1: Intensity + Players + Name */}
            {step === 1 && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h1
                    className="text-2xl sm:text-3xl font-black tracking-tight"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Game Settings
                  </h1>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                    Set your intensity and squad size.
                  </p>
                </div>

                <IntensitySelector
                  selected={intensity}
                  onSelect={setIntensity}
                  maxPlayers={maxPlayers}
                  onMaxPlayersChange={setMaxPlayers}
                />

                {/* Player Name (always on this step) */}
                <div>
                  <label
                    className="block font-mono text-[10px] uppercase tracking-widest mb-2"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Your Gamertag
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value.slice(0, 16))}
                    placeholder="Enter your name"
                    className="w-full p-3 rounded-lg border text-sm font-mono uppercase tracking-wider outline-none transition-colors focus:border-[var(--accent-red)]"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-default)',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <div className="text-right mt-1">
                    <span className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {playerName.length}/16
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Agent Selection (only if Agent Poison mode) */}
            {step === 2 && needsAgentStep && (
              <motion.div
                key="agent"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h1
                    className="text-2xl sm:text-3xl font-black tracking-tight"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Pick Your Agent
                  </h1>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                    Each agent has unique drink rules.
                  </p>
                </div>
                <AgentSelector selected={selectedAgent} onSelect={setSelectedAgent} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Navigation */}
      <footer
        className="sticky bottom-0 flex items-center justify-between p-4 border-t"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border-default)',
        }}
      >
        <motion.button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-3 rounded-lg font-mono text-xs uppercase tracking-widest transition-opacity"
          style={{
            color: 'var(--text-muted)',
            opacity: step === 0 ? 0.3 : 1,
            pointerEvents: step === 0 ? 'none' : 'auto',
          }}
          whileTap={{ scale: 0.97 }}
        >
          <ArrowLeft size={14} />
          Back
        </motion.button>

        <motion.button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-xs uppercase tracking-widest font-bold transition-opacity"
          style={{
            backgroundColor: canProceed() ? 'var(--accent-red)' : 'var(--bg-tertiary)',
            color: canProceed() ? '#FFFFFF' : 'var(--text-muted)',
          }}
          whileTap={canProceed() ? { scale: 0.97 } : {}}
        >
          {step === totalSteps - 1 ? 'Create Lobby' : 'Next'}
          {step < totalSteps - 1 && <ArrowRight size={14} />}
        </motion.button>
      </footer>
    </main>
  );
}
