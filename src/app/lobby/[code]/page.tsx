'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Skull,
  Copy,
  Check,
  Users,
  Play,
  Share2,
  ArrowLeft,
  Shield,
  UserPlus,
  Loader2,
} from 'lucide-react';
import { useGameStore, useCurrentPlayer, useIsHost } from '@/store/game-store';
import { AgentType } from '@/types';
import { AGENTS, AGENT_ROLES, AGENT_COLORS, ROLE_LABELS, MODE_LABELS, INTENSITY_LABELS, getAgentColor, getAgentHeaderTextColor } from '@/lib/constants';

export default function LobbyWaitingRoom() {
  const router = useRouter();
  const params = useParams();
  const code = (params.code as string) || '';

  const {
    lobbyCode,
    players,
    settings,
    game,
    fetchLobby,
    connectSSE,
    disconnectSSE,
    startGameOnServer,
    updateAgentOnServer,
    setReadyOnServer,
    leaveLobbyOnServer,
  } = useGameStore();

  const currentPlayer = useCurrentPlayer();
  const isHost = useIsHost();

  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);
  const [starting, setStarting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Initial fetch on mount
  useEffect(() => {
    const init = async () => {
      await fetchLobby();
      setLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check if lobby is not found after loading
  useEffect(() => {
    if (!loading && lobbyCode !== code && players.length === 0) {
      setNotFound(true);
    } else {
      setNotFound(false);
    }
  }, [loading, lobbyCode, code, players.length]);

  // SSE for real-time updates, with slow polling fallback
  useEffect(() => {
    connectSSE();
    const interval = setInterval(() => fetchLobby(), 10000);
    return () => {
      disconnectSSE();
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redirect to game when status changes to in_progress
  useEffect(() => {
    if (game.status === 'in_progress') {
      router.push(`/game/${code}`);
    }
  }, [game.status, code, router]);

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: do nothing
    }
  }, [code]);

  const handleShareLink = useCallback(async () => {
    try {
      const link = `${window.location.origin}/lobby/join?code=${code}`;
      await navigator.clipboard.writeText(link);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // Fallback: do nothing
    }
  }, [code]);

  const handleAgentSelect = useCallback(async (agent: AgentType) => {
    setShowAgentDropdown(false);
    await updateAgentOnServer(agent);
  }, [updateAgentOnServer]);

  const handleToggleReady = useCallback(async () => {
    if (!currentPlayer) return;
    await setReadyOnServer(!currentPlayer.isReady);
  }, [currentPlayer, setReadyOnServer]);

  const handleStartGame = useCallback(async () => {
    setStarting(true);
    await startGameOnServer();
    // Redirect is handled by the useEffect above
    setTimeout(() => setStarting(false), 3000);
  }, [startGameOnServer]);

  const handleLeaveLobby = useCallback(async () => {
    await leaveLobbyOnServer();
    router.push('/');
  }, [leaveLobbyOnServer, router]);

  // Loading state
  if (loading) {
    return (
      <main style={{
        minHeight: '100vh',
        backgroundColor: '#0C0C0C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}
        >
          <Loader2
            style={{ width: '48px', height: '48px', color: '#FF0000' }}
            className="animate-spin"
          />
          <span style={{
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '2px',
            color: '#666666',
            fontFamily: 'var(--font-space-mono), monospace',
          }}>
            LOADING LOBBY...
          </span>
        </motion.div>
      </main>
    );
  }

  // Not found state
  if (notFound) {
    return (
      <main style={{
        minHeight: '100vh',
        backgroundColor: '#0C0C0C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            textAlign: 'center',
            maxWidth: '480px',
          }}
        >
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(255, 0, 0, 0.15)',
            border: '2px solid #FF0000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Skull style={{ width: '40px', height: '40px', color: '#FF0000' }} />
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 800,
            letterSpacing: '1px',
            color: '#FFFFFF',
          }}>
            LOBBY NOT FOUND
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#666666',
            fontFamily: 'var(--font-space-mono), monospace',
            lineHeight: 1.6,
          }}>
            The lobby with code <span style={{ color: '#FF0000', fontWeight: 700 }}>{code}</span> does not exist or has expired.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <Link
              href={`/lobby/join?code=${code}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                height: '52px',
                padding: '0 28px',
                backgroundColor: '#FF0000',
                textDecoration: 'none',
              }}
            >
              <UserPlus style={{ width: '18px', height: '18px', color: '#0C0C0C' }} />
              <span style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                color: '#0C0C0C',
                fontFamily: 'var(--font-space-mono), monospace',
              }}>
                JOIN LOBBY
              </span>
            </Link>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                height: '52px',
                padding: '0 28px',
                border: '1px solid #333333',
                textDecoration: 'none',
              }}
            >
              <ArrowLeft style={{ width: '18px', height: '18px', color: '#FFFFFF' }} />
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '1.5px',
                color: '#FFFFFF',
                fontFamily: 'var(--font-space-mono), monospace',
              }}>
                HOME
              </span>
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  const intensityInfo = INTENSITY_LABELS[settings.intensity] || INTENSITY_LABELS.ranked;
  const canStart = players.length >= 1;

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0C0C0C', display: 'flex' }}>
      {/* Left Sidebar */}
      <aside
        style={{
          width: '300px',
          backgroundColor: '#0A0A0A',
          borderRight: '1px solid #333333',
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
        }}
        className="hidden lg:flex"
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#FF0000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Skull style={{ width: '22px', height: '22px', color: '#0C0C0C' }} />
          </div>
          <span style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '3px', color: '#FFFFFF' }}>
            SYP
          </span>
        </Link>

        {/* Lobby Code */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '2px',
            color: '#666666',
            fontFamily: 'var(--font-space-mono), monospace',
          }}>
            LOBBY CODE
          </span>
          <button
            type="button"
            onClick={handleCopyCode}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              backgroundColor: 'transparent',
              border: '2px solid #FF0000',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 0.08)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{
              fontSize: '24px',
              fontWeight: 800,
              letterSpacing: '4px',
              color: '#FF0000',
            }}>
              {code}
            </span>
            {copied ? (
              <Check style={{ width: '20px', height: '20px', color: '#22C55E' }} />
            ) : (
              <Copy style={{ width: '20px', height: '20px', color: '#FF0000' }} />
            )}
          </button>
        </div>

        {/* Settings Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span style={{
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '2px',
            color: '#666666',
            fontFamily: 'var(--font-space-mono), monospace',
          }}>
            GAME SETTINGS
          </span>

          {/* Game Modes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '1px',
              color: '#555555',
              fontFamily: 'var(--font-space-mono), monospace',
            }}>
              MODES
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {settings.modes.map((mode) => (
                <span
                  key={mode}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 0, 0, 0.3)',
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    color: '#FF0000',
                    fontFamily: 'var(--font-space-mono), monospace',
                  }}
                >
                  {MODE_LABELS[mode] || mode.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          {/* Intensity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '1px',
              color: '#555555',
              fontFamily: 'var(--font-space-mono), monospace',
            }}>
              INTENSITY
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: intensityInfo.color,
              }} />
              <span style={{
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '2px',
                color: intensityInfo.color,
                fontFamily: 'var(--font-space-mono), monospace',
              }}>
                {intensityInfo.label}
              </span>
            </div>
          </div>

          {/* Max Players */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '1px',
              color: '#555555',
              fontFamily: 'var(--font-space-mono), monospace',
            }}>
              MAX PLAYERS
            </span>
            <span style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#FFFFFF',
              fontFamily: 'var(--font-space-mono), monospace',
            }}>
              {settings.maxPlayers}
            </span>
          </div>
        </div>

        {/* Share Link */}
        <button
          type="button"
          onClick={handleShareLink}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            height: '48px',
            backgroundColor: 'transparent',
            border: '1px solid #333333',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#666666'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#333333'}
        >
          {linkCopied ? (
            <Check style={{ width: '16px', height: '16px', color: '#22C55E' }} />
          ) : (
            <Share2 style={{ width: '16px', height: '16px', color: '#FFFFFF' }} />
          )}
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '1px',
            color: linkCopied ? '#22C55E' : '#FFFFFF',
            fontFamily: 'var(--font-space-mono), monospace',
          }}>
            {linkCopied ? 'LINK COPIED!' : 'SHARE INVITE LINK'}
          </span>
        </button>

        {/* Leave Lobby */}
        <div style={{ marginTop: 'auto' }}>
          <button
            type="button"
            onClick={handleLeaveLobby}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              color: '#666666',
              fontSize: '12px',
              fontFamily: 'var(--font-space-mono), monospace',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
              backgroundColor: 'transparent',
              border: 'none',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#666666'}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Leave Lobby
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* Mobile Header */}
        <div
          className="lg:hidden"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '72px',
            backgroundColor: '#0C0C0C',
            borderBottom: '1px solid #333333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            zIndex: 50,
          }}
        >
          <button
            type="button"
            onClick={handleLeaveLobby}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft style={{ width: '20px', height: '20px', color: '#FFFFFF' }} />
          </button>
          <button
            type="button"
            onClick={handleCopyCode}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 16px',
              border: '1px solid #FF0000',
              backgroundColor: 'transparent',
              cursor: 'pointer',
            }}
          >
            <span style={{
              fontSize: '16px',
              fontWeight: 700,
              letterSpacing: '3px',
              color: '#FF0000',
            }}>
              {code}
            </span>
            {copied ? (
              <Check style={{ width: '16px', height: '16px', color: '#22C55E' }} />
            ) : (
              <Copy style={{ width: '16px', height: '16px', color: '#FF0000' }} />
            )}
          </button>
          <button
            type="button"
            onClick={handleShareLink}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              backgroundColor: 'transparent',
              border: '1px solid #333333',
              cursor: 'pointer',
            }}
          >
            <Share2 style={{ width: '18px', height: '18px', color: '#FFFFFF' }} />
          </button>
        </div>

        {/* Content Area */}
        <div
          style={{
            flex: 1,
            padding: '40px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            maxWidth: '960px',
            width: '100%',
            margin: '0 auto',
          }}
          className="pt-24 lg:pt-10"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                backgroundColor: 'rgba(255, 0, 0, 0.12)',
                border: '1px solid #FF0000',
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#FF0000',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite',
                }} />
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  color: '#FF0000',
                  fontFamily: 'var(--font-space-mono), monospace',
                }}>
                  WAITING
                </span>
              </div>
            </div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 800,
              letterSpacing: '1px',
              color: '#FFFFFF',
            }}>
              LOBBY
            </h1>
            <p style={{
              fontSize: '13px',
              color: '#666666',
              fontFamily: 'var(--font-space-mono), monospace',
            }}>
              Waiting for players to join and select their agents
            </p>
          </motion.div>

          {/* Player Count + Ready Count */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Users style={{ width: '20px', height: '20px', color: '#FF0000' }} />
              <span style={{
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '1px',
                color: '#FFFFFF',
              }}>
                PLAYERS
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                color: players.filter(p => p.isReady).length === players.length && players.length > 0 ? '#22C55E' : '#666666',
                fontFamily: 'var(--font-space-mono), monospace',
                letterSpacing: '1px',
              }}>
                {players.filter(p => p.isReady).length}/{players.length} READY
              </span>
              <span style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#FF0000',
                fontFamily: 'var(--font-space-mono), monospace',
              }}>
                {players.length}/{settings.maxPlayers}
              </span>
            </div>
          </motion.div>

          {/* Player List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <AnimatePresence>
              {players.map((player, index) => {
                const isCurrentUser = player.id === currentPlayer?.id;
                const agentColor = player.color || getAgentColor(player.agent);
                const agentTextColor = getAgentHeaderTextColor(agentColor);

                return (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px 20px',
                      backgroundColor: isCurrentUser ? 'rgba(255, 0, 0, 0.05)' : '#0C0C0C',
                      border: isCurrentUser ? '2px solid #FF0000' : '1px solid #333333',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {/* Player Avatar */}
                    <div style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: agentColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <span style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        color: agentTextColor,
                      }}>
                        {player.name ? player.name.slice(0, 2).toUpperCase() : '??'}
                      </span>
                    </div>

                    {/* Player Info */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontSize: '15px',
                          fontWeight: 700,
                          color: '#FFFFFF',
                          letterSpacing: '0.5px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {player.name || 'UNKNOWN'}
                        </span>
                        {player.isHost && (
                          <span style={{
                            padding: '2px 8px',
                            backgroundColor: 'rgba(255, 0, 0, 0.15)',
                            border: '1px solid #FF0000',
                            fontSize: '8px',
                            fontWeight: 700,
                            letterSpacing: '1px',
                            color: '#FF0000',
                            fontFamily: 'var(--font-space-mono), monospace',
                          }}>
                            HOST
                          </span>
                        )}
                        {isCurrentUser && (
                          <span style={{
                            padding: '2px 8px',
                            backgroundColor: 'rgba(34, 197, 94, 0.15)',
                            border: '1px solid #22C55E',
                            fontSize: '8px',
                            fontWeight: 700,
                            letterSpacing: '1px',
                            color: '#22C55E',
                            fontFamily: 'var(--font-space-mono), monospace',
                          }}>
                            YOU
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {player.agent ? (
                          <>
                            <div style={{
                              width: '10px',
                              height: '10px',
                              backgroundColor: agentColor,
                            }} />
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              letterSpacing: '1px',
                              color: agentColor,
                              fontFamily: 'var(--font-space-mono), monospace',
                            }}>
                              {player.agent.toUpperCase()}
                            </span>
                            <span style={{
                              fontSize: '9px',
                              color: '#555555',
                              fontFamily: 'var(--font-space-mono), monospace',
                            }}>
                              {ROLE_LABELS[AGENT_ROLES[player.agent as AgentType]] || ''}
                            </span>
                          </>
                        ) : (
                          <span style={{
                            fontSize: '11px',
                            color: '#555555',
                            fontFamily: 'var(--font-space-mono), monospace',
                            fontStyle: 'italic',
                          }}>
                            No agent selected
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Agent Selection - Only for current user */}
                    {isCurrentUser && (
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={() => setShowAgentDropdown(!showAgentDropdown)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 14px',
                            backgroundColor: currentPlayer?.agent ? '#1A1A1A' : 'rgba(255, 0, 0, 0.1)',
                            border: currentPlayer?.agent ? '1px solid #444444' : '1px solid rgba(255, 0, 0, 0.3)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = currentPlayer?.agent ? '#888888' : 'rgba(255, 0, 0, 0.5)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = currentPlayer?.agent ? '#444444' : 'rgba(255, 0, 0, 0.3)';
                          }}
                        >
                          <Shield style={{ width: '14px', height: '14px', color: agentColor }} />
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            letterSpacing: '1px',
                            color: '#FFFFFF',
                            fontFamily: 'var(--font-space-mono), monospace',
                          }}>
                            {showAgentDropdown ? 'CLOSE' : (currentPlayer?.agent ? currentPlayer.agent.toUpperCase() : 'SELECT AGENT')}
                          </span>
                          <span style={{ fontSize: '10px', color: '#666666' }}>
                            {showAgentDropdown ? '\u25B2' : '\u25BC'}
                          </span>
                        </button>

                        {/* Agent Dropdown */}
                        <AnimatePresence>
                          {showAgentDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                width: '240px',
                                maxHeight: '360px',
                                overflowY: 'auto',
                                backgroundColor: '#1A1A1A',
                                border: '1px solid #444444',
                                zIndex: 100,
                                marginTop: '4px',
                              }}
                            >
                              {AGENTS.map((agent) => {
                                const color = AGENT_COLORS[agent] || '#666666';
                                const isSelected = currentPlayer?.agent === agent;
                                return (
                                  <button
                                    key={agent}
                                    type="button"
                                    onClick={() => handleAgentSelect(agent)}
                                    style={{
                                      width: '100%',
                                      padding: '10px 14px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '10px',
                                      backgroundColor: isSelected ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
                                      borderTop: 'none',
                                      borderRight: 'none',
                                      borderLeft: isSelected ? `3px solid ${color}` : '3px solid transparent',
                                      borderBottom: '1px solid #2A2A2A',
                                      cursor: 'pointer',
                                      textAlign: 'left',
                                      transition: 'background-color 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                      if (!isSelected) e.currentTarget.style.backgroundColor = '#252525';
                                    }}
                                    onMouseLeave={(e) => {
                                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                  >
                                    <div style={{
                                      width: '16px',
                                      height: '16px',
                                      backgroundColor: color,
                                      flexShrink: 0,
                                    }} />
                                    <span style={{
                                      fontSize: '11px',
                                      fontWeight: isSelected ? 700 : 500,
                                      color: isSelected ? '#FFFFFF' : '#CCCCCC',
                                      fontFamily: 'var(--font-space-mono), monospace',
                                      flex: 1,
                                    }}>
                                      {agent.toUpperCase()}
                                    </span>
                                    <span style={{
                                      fontSize: '8px',
                                      color: '#666666',
                                      fontFamily: 'var(--font-space-mono), monospace',
                                    }}>
                                      {ROLE_LABELS[AGENT_ROLES[agent as AgentType]] || ''}
                                    </span>
                                    {isSelected && (
                                      <Check style={{ width: '12px', height: '12px', color: '#22C55E' }} />
                                    )}
                                  </button>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Ready Status */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flexShrink: 0,
                    }}>
                      <div style={{
                        width: '10px',
                        height: '10px',
                        backgroundColor: player.isReady ? '#22C55E' : '#666666',
                        borderRadius: '50%',
                        transition: 'background-color 0.2s ease',
                      }} />
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '1px',
                        color: player.isReady ? '#22C55E' : '#666666',
                        fontFamily: 'var(--font-space-mono), monospace',
                      }}>
                        {player.isReady ? 'READY' : 'NOT READY'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Empty Slots */}
            {Array.from({ length: Math.max(0, settings.maxPlayers - players.length) }).map((_, i) => (
              <motion.div
                key={`empty-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ delay: (players.length + i) * 0.05, duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  border: '1px dashed #2A2A2A',
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  border: '1px dashed #333333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <UserPlus style={{ width: '20px', height: '20px', color: '#333333' }} />
                </div>
                <span style={{
                  fontSize: '12px',
                  color: '#444444',
                  fontFamily: 'var(--font-space-mono), monospace',
                }}>
                  Waiting for player...
                </span>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginTop: '8px',
            }}
          >
            {/* Ready Toggle - For non-host players */}
            {currentPlayer && (
              <button
                type="button"
                onClick={handleToggleReady}
                style={{
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  backgroundColor: currentPlayer.isReady ? 'rgba(34, 197, 94, 0.15)' : '#1A1A1A',
                  border: currentPlayer.isReady ? '2px solid #22C55E' : '2px solid #444444',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!currentPlayer.isReady) {
                    e.currentTarget.style.borderColor = '#22C55E';
                    e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.08)';
                  } else {
                    e.currentTarget.style.borderColor = '#EF4444';
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!currentPlayer.isReady) {
                    e.currentTarget.style.borderColor = '#444444';
                    e.currentTarget.style.backgroundColor = '#1A1A1A';
                  } else {
                    e.currentTarget.style.borderColor = '#22C55E';
                    e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.15)';
                  }
                }}
              >
                {currentPlayer.isReady ? (
                  <Check style={{ width: '20px', height: '20px', color: '#22C55E' }} />
                ) : (
                  <Shield style={{ width: '20px', height: '20px', color: '#FFFFFF' }} />
                )}
                <span style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  color: currentPlayer.isReady ? '#22C55E' : '#FFFFFF',
                  fontFamily: 'var(--font-space-mono), monospace',
                }}>
                  {currentPlayer.isReady ? 'READY' : 'CLICK TO READY UP'}
                </span>
              </button>
            )}

            {/* Start Game - Host Only */}
            {isHost && (
              <>
                {/* Ready progress bar */}
                {players.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '1px', color: '#555555', fontFamily: 'var(--font-space-mono), monospace' }}>READINESS</span>
                      <span style={{
                        fontSize: '9px', fontWeight: 600, letterSpacing: '1px', fontFamily: 'var(--font-space-mono), monospace',
                        color: players.filter(p => p.isReady).length === players.length ? '#22C55E' : '#666666',
                      }}>
                        {Math.round((players.filter(p => p.isReady).length / players.length) * 100)}%
                      </span>
                    </div>
                    <div style={{ height: '4px', backgroundColor: '#1A1A1A', overflow: 'hidden' }}>
                      <motion.div
                        animate={{ width: `${(players.filter(p => p.isReady).length / players.length) * 100}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        style={{ height: '100%', backgroundColor: players.filter(p => p.isReady).length === players.length ? '#22C55E' : '#FF0000' }}
                      />
                    </div>
                  </div>
                )}
              <button
                type="button"
                onClick={handleStartGame}
                disabled={!canStart || starting}
                style={{
                  height: '64px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '14px',
                  backgroundColor: canStart && !starting ? '#FF0000' : '#333333',
                  border: 'none',
                  cursor: canStart && !starting ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  boxShadow: canStart && !starting ? '0 0 30px rgba(255, 0, 0, 0.3)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (canStart && !starting) {
                    e.currentTarget.style.backgroundColor = '#E50000';
                    e.currentTarget.style.boxShadow = '0 0 40px rgba(255, 0, 0, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (canStart && !starting) {
                    e.currentTarget.style.backgroundColor = '#FF0000';
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 0, 0, 0.3)';
                  }
                }}
              >
                {starting ? (
                  <Loader2
                    style={{ width: '22px', height: '22px', color: '#0C0C0C' }}
                    className="animate-spin"
                  />
                ) : (
                  <Play style={{ width: '22px', height: '22px', color: '#0C0C0C', fill: '#0C0C0C' }} />
                )}
                <span style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  color: '#0C0C0C',
                }}>
                  {starting ? 'STARTING...' : 'START GAME'}
                </span>
              </button>
              </>
            )}

            {/* Non-host message */}
            {!isHost && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '16px',
                backgroundColor: '#1A1A1A',
                border: '1px solid #333333',
              }}>
                <Loader2
                  style={{ width: '16px', height: '16px', color: '#666666' }}
                  className="animate-spin"
                />
                <span style={{
                  fontSize: '12px',
                  color: '#666666',
                  fontFamily: 'var(--font-space-mono), monospace',
                }}>
                  Waiting for host to start the game...
                </span>
              </div>
            )}

            {/* Mobile Settings Summary */}
            <div className="lg:hidden" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              padding: '20px',
              border: '1px solid #333333',
              marginTop: '8px',
            }}>
              <span style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '2px',
                color: '#666666',
                fontFamily: 'var(--font-space-mono), monospace',
              }}>
                GAME SETTINGS
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {settings.modes.map((mode) => (
                  <span
                    key={mode}
                    style={{
                      padding: '4px 10px',
                      backgroundColor: 'rgba(255, 0, 0, 0.1)',
                      border: '1px solid rgba(255, 0, 0, 0.3)',
                      fontSize: '9px',
                      fontWeight: 700,
                      letterSpacing: '1px',
                      color: '#FF0000',
                      fontFamily: 'var(--font-space-mono), monospace',
                    }}
                  >
                    {MODE_LABELS[mode] || mode.toUpperCase()}
                  </span>
                ))}
                <span style={{
                  padding: '4px 10px',
                  backgroundColor: `${intensityInfo.color}20`,
                  border: `1px solid ${intensityInfo.color}50`,
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  color: intensityInfo.color,
                  fontFamily: 'var(--font-space-mono), monospace',
                }}>
                  {intensityInfo.label}
                </span>
              </div>

              {/* Mobile Share + Leave */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleShareLink}
                  style={{
                    flex: 1,
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: 'transparent',
                    border: '1px solid #333333',
                    cursor: 'pointer',
                  }}
                >
                  <Share2 style={{ width: '14px', height: '14px', color: '#FFFFFF' }} />
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '1px',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-space-mono), monospace',
                  }}>
                    SHARE
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleLeaveLobby}
                  style={{
                    flex: 1,
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    cursor: 'pointer',
                  }}
                >
                  <ArrowLeft style={{ width: '14px', height: '14px', color: '#EF4444' }} />
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '1px',
                    color: '#EF4444',
                    fontFamily: 'var(--font-space-mono), monospace',
                  }}>
                    LEAVE
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
