'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Skull, ArrowRight, Plus, QrCode, LinkIcon, ChevronRight, Users } from 'lucide-react';
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
    } catch (err) {
      setError('Failed to join lobby. Please check the code and try again.');
      setJoining(false);
    }
  };

  const recentLobbies = [
    { name: 'SQUAD NIGHT', code: 'VXR-7K9', players: 4, isLive: true },
    { name: 'FRIDAY RANKED', code: 'ABC-123', players: 3, isLive: false },
    { name: 'BRONZE CHAOS', code: 'XYZ-999', players: 5, isLive: false },
  ];

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0C0C0C', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        borderBottom: '1px solid #333333'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{ width: '44px', height: '44px', backgroundColor: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Skull style={{ width: '24px', height: '24px', color: '#0C0C0C' }} />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>
            POISON
          </span>
        </Link>
      </header>

      {/* Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 48px',
        overflowY: 'auto'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '40px', width: '100%', maxWidth: '480px' }}
        >
          {/* Join Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', color: '#666666', fontFamily: 'var(--font-space-mono), monospace' }}>
              JOIN LOBBY
            </label>

            {/* Name Input */}
            <input
              type="text"
              placeholder="Your name..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value.slice(0, 16))}
              style={{
                height: '60px',
                padding: '0 20px',
                backgroundColor: '#1A1A1A',
                border: '1px solid #333333',
                color: '#FFFFFF',
                fontFamily: 'var(--font-space-mono), monospace',
                fontSize: '15px',
                textTransform: 'uppercase',
                outline: 'none'
              }}
            />

            {/* Code Input Row */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <input
                type="text"
                placeholder="Enter lobby code..."
                value={lobbyCode}
                onChange={(e) => setLobbyCode(e.target.value.toUpperCase().slice(0, 11))}
                style={{
                  flex: 1,
                  height: '60px',
                  padding: '0 20px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333333',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-space-mono), monospace',
                  fontSize: '15px',
                  fontWeight: 500,
                  letterSpacing: '2px',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={handleJoinLobby}
                disabled={joining || !lobbyCode.trim() || !playerName.trim()}
                style={{
                  width: '80px',
                  height: '60px',
                  backgroundColor: '#FF0000',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: joining || !lobbyCode.trim() || !playerName.trim() ? 'not-allowed' : 'pointer',
                  opacity: joining || !lobbyCode.trim() || !playerName.trim() ? 0.5 : 1
                }}
              >
                <ArrowRight style={{ width: '28px', height: '28px', color: '#0C0C0C' }} />
              </button>
            </div>

            {error && (
              <div style={{
                padding: '16px 20px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #EF4444',
                fontSize: '14px',
                color: '#EF4444',
                fontFamily: 'var(--font-space-mono), monospace'
              }}>
                {error}
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#333333' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#666666', fontFamily: 'var(--font-space-mono), monospace' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#333333' }} />
          </div>

          {/* Create Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', color: '#666666', fontFamily: 'var(--font-space-mono), monospace' }}>
              CREATE LOBBY
            </label>
            <Link
              href="/lobby/create"
              style={{
                height: '72px',
                backgroundColor: '#1A1A1A',
                border: '2px solid #FF0000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                textDecoration: 'none',
                transition: 'background-color 0.2s ease'
              }}
            >
              <Plus style={{ width: '28px', height: '28px', color: '#FF0000' }} />
              <span style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '2px', color: '#FF0000', fontFamily: 'var(--font-space-mono), monospace' }}>
                NEW LOBBY
              </span>
            </Link>
          </div>

          {/* Recent Lobbies */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', color: '#666666', fontFamily: 'var(--font-space-mono), monospace' }}>
              RECENT LOBBIES
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentLobbies.map((lobby, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setLobbyCode(lobby.code)}
                  style={{
                    backgroundColor: '#1A1A1A',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
                      {lobby.name}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Users style={{ width: '16px', height: '16px', color: '#666666' }} />
                      <span style={{ fontSize: '12px', color: '#666666', fontFamily: 'var(--font-space-mono), monospace' }}>
                        {lobby.players} players
                      </span>
                      <span style={{ fontSize: '12px', color: '#666666', fontFamily: 'var(--font-space-mono), monospace' }}>
                        {lobby.code}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {lobby.isLive && (
                      <div style={{
                        padding: '6px 12px',
                        backgroundColor: 'rgba(255, 0, 0, 0.1)',
                        border: '1px solid #FF0000',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <div style={{ width: '8px', height: '8px', backgroundColor: '#FF0000', animation: 'pulse 2s infinite' }} />
                        <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', color: '#FF0000', fontFamily: 'var(--font-space-mono), monospace' }}>
                          LIVE
                        </span>
                      </div>
                    )}
                    <ChevronRight style={{ width: '24px', height: '24px', color: '#666666' }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Join */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', color: '#666666', fontFamily: 'var(--font-space-mono), monospace' }}>
              QUICK JOIN
            </label>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                type="button"
                style={{
                  flex: 1,
                  height: '64px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease'
                }}
              >
                <QrCode style={{ width: '24px', height: '24px', color: '#FFFFFF' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', fontFamily: 'var(--font-space-mono), monospace' }}>
                  SCAN QR
                </span>
              </button>
              <button
                type="button"
                style={{
                  flex: 1,
                  height: '64px',
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #333333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease'
                }}
              >
                <LinkIcon style={{ width: '24px', height: '24px', color: '#FFFFFF' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', fontFamily: 'var(--font-space-mono), monospace' }}>
                  PASTE LINK
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function JoinLobbyPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight: '100vh', backgroundColor: '#0C0C0C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#FFFFFF', fontFamily: 'var(--font-space-mono), monospace', fontSize: '12px' }}>Loading...</div>
      </main>
    }>
      <JoinLobbyContent />
    </Suspense>
  );
}
