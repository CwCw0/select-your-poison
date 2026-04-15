'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Skull, ArrowRight, Plus, LinkIcon, ClipboardPaste, Loader2 } from 'lucide-react';
import { useGameStore } from '@/store/game-store';

function JoinLobbyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get('code');

  const { joinLobby } = useGameStore();

  const [playerName, setPlayerName] = useState('');
  const [lobbyCode, setLobbyCode] = useState(codeFromUrl || '');
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);
  const [pasteSuccess, setPasteSuccess] = useState(false);

  useEffect(() => {
    if (codeFromUrl) {
      setLobbyCode(codeFromUrl);
    }
  }, [codeFromUrl]);

  const handleJoinLobby = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!lobbyCode.trim()) {
      setError('Please enter a lobby code');
      return;
    }

    setJoining(true);
    setError('');

    try {
      joinLobby(lobbyCode.toUpperCase(), playerName.toUpperCase());
      router.push(`/game/${lobbyCode.toUpperCase()}`);
    } catch {
      setError('Failed to join lobby. Please check the code and try again.');
      setJoining(false);
    }
  };

  const handlePasteLink = async () => {
    try {
      const text = await navigator.clipboard.readText();
      // Extract lobby code from a URL like /lobby/join?code=VXR-7K9 or /game/VXR-7K9
      const codeMatch = text.match(/[?&]code=([A-Z0-9-]+)/i) || text.match(/\/game\/([A-Z0-9-]+)/i);
      if (codeMatch) {
        setLobbyCode(codeMatch[1].toUpperCase());
        setPasteSuccess(true);
        setTimeout(() => setPasteSuccess(false), 2000);
      } else {
        // Maybe it's just a raw code
        const rawCode = text.trim().toUpperCase();
        if (/^[A-Z0-9-]{3,11}$/.test(rawCode)) {
          setLobbyCode(rawCode);
          setPasteSuccess(true);
          setTimeout(() => setPasteSuccess(false), 2000);
        } else {
          setError('No valid lobby code found in clipboard');
        }
      }
    } catch {
      setError('Unable to read clipboard. Please paste the code manually.');
    }
  };

  return (
    <main className="min-h-screen bg-[#0C0C0C] flex flex-col">
      {/* Header */}
      <header className="h-[72px] flex items-center justify-between px-4 sm:px-8 lg:px-12 border-b border-[#333333]">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#FF0000] flex items-center justify-center">
            <Skull className="w-6 h-6 text-[#0C0C0C]" />
          </div>
          <span className="text-base sm:text-lg font-extrabold text-white">POISON</span>
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-10 sm:py-16 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-10 w-full max-w-[480px]"
        >
          {/* Join Section */}
          <div className="flex flex-col gap-6">
            <label className="text-xs font-semibold tracking-[2px] text-[#666666] font-mono">
              JOIN LOBBY
            </label>

            {/* Name Input */}
            <input
              type="text"
              placeholder="Your name..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value.slice(0, 16))}
              className="h-[56px] sm:h-[60px] px-5 bg-[#1A1A1A] border border-[#333333] text-white font-mono text-[15px] uppercase outline-none focus:border-[#FF0000] focus:shadow-[0_0_0_1px_#FF0000] transition-colors"
            />

            {/* Code Input Row */}
            <div className="flex gap-3 sm:gap-4">
              <input
                type="text"
                placeholder="Enter lobby code..."
                value={lobbyCode}
                onChange={(e) => setLobbyCode(e.target.value.toUpperCase().slice(0, 11))}
                className="flex-1 h-[56px] sm:h-[60px] px-5 bg-[#1A1A1A] border border-[#333333] text-white font-mono text-[15px] font-medium tracking-[2px] text-center uppercase outline-none focus:border-[#FF0000] focus:shadow-[0_0_0_1px_#FF0000] transition-colors"
              />
              <motion.button
                type="button"
                onClick={handleJoinLobby}
                disabled={joining || !lobbyCode.trim() || !playerName.trim()}
                whileHover={!joining ? { scale: 1.02 } : undefined}
                whileTap={!joining ? { scale: 0.95 } : undefined}
                className="w-16 sm:w-20 h-[56px] sm:h-[60px] bg-[#FF0000] border-none flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E50000] transition-colors"
              >
                {joining ? (
                  <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 text-[#0C0C0C] animate-spin" />
                ) : (
                  <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 text-[#0C0C0C]" />
                )}
              </motion.button>
            </div>

            {error && (
              <div className="p-4 sm:p-5 bg-[rgba(239,68,68,0.1)] border border-[#EF4444] text-sm text-[#EF4444] font-mono">
                {error}
              </div>
            )}
          </div>

          {/* Paste Link */}
          <motion.button
            type="button"
            onClick={handlePasteLink}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            className={`h-16 bg-[#1A1A1A] border flex items-center justify-center gap-3 cursor-pointer transition-all ${
              pasteSuccess ? 'border-[#22C55E]' : 'border-[#333333] hover:border-[#FF0000]'
            }`}
          >
            {pasteSuccess ? (
              <ClipboardPaste className="w-5 h-5 text-[#22C55E]" />
            ) : (
              <LinkIcon className="w-5 h-5 text-white" />
            )}
            <span className={`text-[13px] font-semibold font-mono ${pasteSuccess ? 'text-[#22C55E]' : 'text-white'}`}>
              {pasteSuccess ? 'CODE PASTED!' : 'PASTE INVITE LINK'}
            </span>
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-6">
            <div className="flex-1 h-px bg-[#333333]" />
            <span className="text-xs font-semibold text-[#666666] font-mono">OR</span>
            <div className="flex-1 h-px bg-[#333333]" />
          </div>

          {/* Create Section */}
          <div className="flex flex-col gap-5">
            <label className="text-xs font-semibold tracking-[2px] text-[#666666] font-mono">
              CREATE LOBBY
            </label>
            <Link
              href="/lobby/create"
              className="h-[68px] sm:h-[72px] bg-[#1A1A1A] border-2 border-[#FF0000] flex items-center justify-center gap-4 no-underline hover:bg-[#FF0000]/5 active:scale-[0.98] transition-all"
            >
              <Plus className="w-6 h-6 sm:w-7 sm:h-7 text-[#FF0000]" />
              <span className="text-base sm:text-[17px] font-bold tracking-[2px] text-[#FF0000] font-mono">
                NEW LOBBY
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function JoinLobbyPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#0C0C0C] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF0000] animate-spin" />
      </main>
    }>
      <JoinLobbyContent />
    </Suspense>
  );
}
