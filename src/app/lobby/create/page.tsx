'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Skull,
  Settings,
  Users,
  Dices,
  Play,
  Share2,
  Copy,
  Check,
  UserPlus,
  Target,
  Trophy,
  Flame,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import { useGameStore } from '@/store/game-store';
import { GameMode, IntensityLevel } from '@/types';

type TabId = 'settings' | 'agents' | 'strats';

const gameModes: { id: GameMode; title: string; description: string; icon: React.ReactNode; color: string }[] = [
  {
    id: 'agent_poison',
    title: 'AGENT POISON',
    description: 'Agent-based drinking rules',
    icon: <Target style={{ width: '20px', height: '20px' }} />,
    color: '#7C3AED',
  },
  {
    id: 'strat_roulette',
    title: 'STRAT ROULETTE',
    description: 'Roll cursed strats each round',
    icon: <Dices style={{ width: '20px', height: '20px' }} />,
    color: '#FF0000',
  },
  {
    id: 'challenges',
    title: 'CHALLENGES',
    description: 'Side objectives for extra drinks',
    icon: <Trophy style={{ width: '20px', height: '20px' }} />,
    color: '#F59E0B',
  },
  {
    id: 'classic',
    title: 'PUNISHMENT',
    description: 'End-game consequences',
    icon: <Flame style={{ width: '20px', height: '20px' }} />,
    color: '#EF4444',
  },
];

const intensityLevels: { id: IntensityLevel; title: string; color: string }[] = [
  { id: 'casual', title: 'IRON', color: '#78716C' },
  { id: 'ranked', title: 'GOLD', color: '#EAB308' },
  { id: 'immortal', title: 'DIAMOND', color: '#A855F7' },
  { id: 'radiant', title: 'RADIANT', color: '#FF0000' },
];

// Agent-specific rules with meme-worthy drinking rules
const agentData = [
  // DUELISTS
  {
    name: 'Jett',
    role: 'DUELIST',
    color: '#7DD3FC',
    quote: '"Watch this."',
    rules: [
      'Say "Watch this" and die → 2 drinks',
      'Updraft into the enemy team and die → 1 drink',
      'Whiff all 5 knives → 2 drinks',
      'Dash into site and get traded instantly → 1 drink',
      'Die with dash still available → 1 drink',
      'Get 0 kills while top fragging deaths → finish your drink'
    ]
  },
  {
    name: 'Reyna',
    role: 'DUELIST',
    color: '#A855F7',
    quote: '"They are so dead."',
    rules: [
      'Die without getting a soul orb → 1 drink',
      'Dismiss into 3+ enemies → 2 drinks',
      'Ult and get 0 kills → 2 drinks',
      'Leer yourself accidentally → 1 drink',
      'Go 0-5 and say "no heals" → 3 drinks',
      'Bait team for soul orbs → 1 drink per bait'
    ]
  },
  {
    name: 'Phoenix',
    role: 'DUELIST',
    color: '#F59E0B',
    quote: '"Just take a break!"',
    rules: [
      'Flash yourself → 1 drink',
      'Flash your team → 1 drink per teammate',
      'Die in your ult → 1 drink',
      'Molly yourself to death → 2 drinks',
      'Wall cuts off your team → 1 drink',
      'Say "I got this" then die immediately → 2 drinks'
    ]
  },
  {
    name: 'Raze',
    role: 'DUELIST',
    color: '#F97316',
    quote: '"HERE COMES THE PARTY!"',
    rules: [
      'Kill yourself with satchel → 2 drinks',
      'Boombot finds 0 enemies all game → 1 drink',
      'Whiff the showstopper → 3 drinks',
      'Grenade yourself or teammates → 1 drink',
      'Satchel into 5 enemies and die → 2 drinks',
      'Double satchel into a wall → 1 drink'
    ]
  },
  {
    name: 'Yoru',
    role: 'DUELIST',
    color: '#3B82F6',
    quote: '"You should run."',
    rules: [
      'TP into 3+ enemies → 2 drinks',
      'Clone gets killed instantly → 1 drink',
      'Die during ult → 2 drinks',
      'Fake TP outplay fails → 1 drink',
      'Flash yourself with your own flash → 1 drink',
      'Spend entire round lurking with 0 impact → 2 drinks'
    ]
  },
  {
    name: 'Neon',
    role: 'DUELIST',
    color: '#22D3EE',
    quote: '"Too slow!"',
    rules: [
      'Sprint into 5 enemies and die → 1 drink',
      'Stun yourself with wall → 1 drink',
      'Ult for 0 kills → 2 drinks',
      'Slide into enemy Raze nade → 2 drinks',
      'Run out of energy mid-fight → 1 drink',
      'Run past all enemies without noticing → 1 drink'
    ]
  },
  {
    name: 'Iso',
    role: 'DUELIST',
    color: '#6366F1',
    quote: '"Focus."',
    rules: [
      'Lose the 1v1 in your ult → 3 drinks',
      'Shield pops and you still die → 1 drink',
      'Ult the wrong enemy → 2 drinks',
      'Wall blocks nothing useful → 1 drink',
      'Die without using any ability → 1 drink',
      'Use ult to escape instead of fight → 1 drink'
    ]
  },
  // INITIATORS
  {
    name: 'Sova',
    role: 'INITIATOR',
    color: '#3B82F6',
    quote: '"I am the hunter."',
    rules: [
      'Recon dart reveals 0 enemies → 1 drink',
      'Shock dart yourself → 1 drink',
      'Lineups take so long round ends → 2 drinks',
      'Hunter\'s Fury hits nothing → 2 drinks',
      'Drone dies instantly → 1 drink',
      'Say "I have a lineup for this" and miss → 2 drinks'
    ]
  },
  {
    name: 'Breach',
    role: 'INITIATOR',
    color: '#F59E0B',
    quote: '"Let\'s go!"',
    rules: [
      'Flash your entire team → 2 drinks',
      'Stun yourself → 1 drink',
      'Ult misses everyone → 2 drinks',
      'Aftershock kills a teammate → 2 drinks',
      'Flash through wall hits no enemies → 1 drink',
      'Die with full utility → 1 drink'
    ]
  },
  {
    name: 'Skye',
    role: 'INITIATOR',
    color: '#22C55E',
    quote: '"Good luck!"',
    rules: [
      'Dog finds nothing → 1 drink',
      'Flash your own team → 1 drink per teammate',
      'Heal an already full HP teammate → 1 drink',
      'Ult finds 0 enemies → 2 drinks',
      'Bird gets shot immediately → 1 drink',
      '"They\'re blinded" but they 1 tap you → 2 drinks'
    ]
  },
  {
    name: 'KAY/O',
    role: 'INITIATOR',
    color: '#64748B',
    quote: '"Humans..."',
    rules: [
      'Knife suppresses 0 enemies → 1 drink',
      'Flash your team → 1 drink per teammate',
      'Die in ult without getting rezzed → 2 drinks',
      'Molly yourself → 1 drink',
      'Get suppressed by enemy KAY/O → 1 drink',
      'Teammates refuse to rez you → 2 drinks'
    ]
  },
  {
    name: 'Fade',
    role: 'INITIATOR',
    color: '#6366F1',
    quote: '"Nightmare..."',
    rules: [
      'Prowler finds nothing → 1 drink',
      'Haunt reveals 0 enemies → 1 drink',
      'Tether catches teammates → 1 drink',
      'Ult catches only 1 enemy → 1 drink',
      'Prowler runs into a wall → 1 drink',
      'Enemy shoots your haunt instantly → 1 drink'
    ]
  },
  {
    name: 'Gekko',
    role: 'INITIATOR',
    color: '#84CC16',
    quote: '"Let\'s do this, buddy!"',
    rules: [
      'Dizzy blinds 0 enemies → 1 drink',
      'Forget to pick up Gekko buddies → 1 drink each',
      'Wingman plants/defuses and you still lose → 2 drinks',
      'Thrash catches no one → 1 drink',
      'Mosh pit kills a teammate → 2 drinks',
      'Say "Wingman clutch" and it fails → 2 drinks'
    ]
  },
  // CONTROLLERS
  {
    name: 'Brimstone',
    role: 'CONTROLLER',
    color: '#F59E0B',
    quote: '"Breach and clear!"',
    rules: [
      'Smoke your own team → 1 drink',
      'Molly a teammate → 1 drink',
      'Ult your own team → 2 drinks',
      'Stim beacon in spawn → 1 drink',
      'Run out of smokes in 2 rounds → 1 drink',
      '"Open the map" takes 10 seconds → 1 drink'
    ]
  },
  {
    name: 'Omen',
    role: 'CONTROLLER',
    color: '#6366F1',
    quote: '"I am everywhere."',
    rules: [
      'TP into 5 enemies → 2 drinks',
      'TP gets canceled → 1 drink',
      'Flash yourself → 1 drink',
      'Ult to enemy spawn and die → 3 drinks',
      'Smoke your own team → 1 drink',
      '"Trust me I have a play" then dies instantly → 2 drinks'
    ]
  },
  {
    name: 'Viper',
    role: 'CONTROLLER',
    color: '#22C55E',
    quote: '"Welcome to my world."',
    rules: [
      'Molly your own team → 1 drink',
      'Wall blocks your team → 1 drink',
      'Run out of fuel at the worst time → 2 drinks',
      'Ult and no one enters → 1 drink',
      'Orb placed in useless spot → 1 drink',
      'Lineup takes so long you die → 2 drinks'
    ]
  },
  {
    name: 'Astra',
    role: 'CONTROLLER',
    color: '#A855F7',
    quote: '"You are not ready."',
    rules: [
      'Spend 30 seconds in astral form → 1 drink',
      'Suck your own team → 1 drink',
      'Stun your teammates → 1 drink',
      'Ult blocks your team\'s push → 2 drinks',
      'Die while in astral form → 2 drinks',
      'Place 0 stars all round → 1 drink'
    ]
  },
  {
    name: 'Harbor',
    role: 'CONTROLLER',
    color: '#22D3EE',
    quote: '"High tide."',
    rules: [
      'Wall blocks your team → 1 drink',
      'Cascade hits no one → 1 drink',
      'Cove gets destroyed instantly → 1 drink',
      'Ult catches 0 enemies → 2 drinks',
      'Die with all abilities up → 1 drink',
      'Team asks "do you have smoke?" and you don\'t → 1 drink'
    ]
  },
  {
    name: 'Clove',
    role: 'CONTROLLER',
    color: '#EC4899',
    quote: '"Not done yet!"',
    rules: [
      'Die, self-res, then die again immediately → 2 drinks',
      'Smoke your own team → 1 drink',
      'Ult and get 0 kills → 2 drinks',
      'Decay yourself → 1 drink',
      'Forget you can self-res → 1 drink',
      'Meddle hits your team → 1 drink'
    ]
  },
  // SENTINELS
  {
    name: 'Sage',
    role: 'SENTINEL',
    color: '#22C55E',
    quote: '"I am both shield and sword."',
    rules: [
      'MUST res a teammate once or drink 3 at end of game',
      'Res in the open and they die again → 2 drinks',
      'Wall blocks your team → 1 drink',
      'Slow your own team → 1 drink',
      'Die with res available → 1 drink',
      'Team spam pings for heal → 1 drink per 5 pings',
      '"SAGE REZ" and you just died → 1 drink'
    ]
  },
  {
    name: 'Cypher',
    role: 'SENTINEL',
    color: '#FBBF24',
    quote: '"I know exactly where you are."',
    rules: [
      'Tripwire catches nothing all game → 2 drinks',
      'Cam gets destroyed instantly → 1 drink',
      'Ult reveals 0 useful info → 2 drinks',
      'Die and lose all your util → 1 drink',
      'Cage yourself by accident → 1 drink',
      'Setup for A but they go B every round → 1 drink per round'
    ]
  },
  {
    name: 'Killjoy',
    role: 'SENTINEL',
    color: '#FBBF24',
    quote: '"Relax, I\'ve got this."',
    rules: [
      'Turret gets destroyed instantly → 1 drink',
      'Alarmbot catches nothing → 1 drink',
      'Lockdown gets destroyed → 2 drinks',
      'Swarm grenades hit teammates → 1 drink',
      'All util disabled because you\'re too far → 2 drinks',
      'Say "They won\'t push this" and they do → 1 drink'
    ]
  },
  {
    name: 'Chamber',
    role: 'SENTINEL',
    color: '#FBBF24',
    quote: '"They are so dead."',
    rules: [
      'TP and still die → 1 drink',
      'Whiff with headhunter → 1 drink per whiff',
      'Tour de Force whiff → 2 drinks',
      'Trademark catches nothing all game → 2 drinks',
      'Buy headhunter then never use it → 1 drink',
      '"I\'ll OP this" and whiff first shot → 2 drinks'
    ]
  },
  {
    name: 'Deadlock',
    role: 'SENTINEL',
    color: '#64748B',
    quote: '"Prepare yourselves."',
    rules: [
      'Cocoon catches no one → 1 drink',
      'Barrier mesh gets ignored → 1 drink',
      'Ult catches teammate instead → 2 drinks',
      'Sonic sensor reveals nothing → 1 drink',
      'GravNet slows your own team → 1 drink',
      'All utility destroyed before it activates → 2 drinks'
    ]
  },
  {
    name: 'Vyse',
    role: 'SENTINEL',
    color: '#8B5CF6',
    quote: '"Steel yourself."',
    rules: [
      'Arc Rose catches nothing → 1 drink',
      'Shear gets destroyed immediately → 1 drink',
      'Steel Garden hits teammates → 1 drink',
      'Die with all utility available → 1 drink',
      'Razorvine placed in useless spot → 1 drink',
      'Enemy walks past all your utility → 2 drinks'
    ]
  }
];

// Group agents by role for the role-based view
const agentRoles = [
  {
    role: 'DUELIST',
    color: '#EF4444',
    agents: agentData.filter(a => a.role === 'DUELIST'),
    generalRules: [
      'Die first in a round → 1 drink',
      'Get 0 kills in a round → 1 drink',
      'Bait your teammates → 1 drink per bait'
    ]
  },
  {
    role: 'INITIATOR',
    color: '#22C55E',
    agents: agentData.filter(a => a.role === 'INITIATOR'),
    generalRules: [
      'Flash/blind a teammate → 1 drink',
      'Miss all recon info → 1 drink',
      'Die before using utility → 1 drink'
    ]
  },
  {
    role: 'CONTROLLER',
    color: '#A855F7',
    agents: agentData.filter(a => a.role === 'CONTROLLER'),
    generalRules: [
      'Smoke your own team → 1 drink',
      'Die with smokes unused → 1 drink',
      'Utility damages teammate → 1 drink'
    ]
  },
  {
    role: 'SENTINEL',
    color: '#3B82F6',
    agents: agentData.filter(a => a.role === 'SENTINEL'),
    generalRules: [
      'Utility gets destroyed → 1 drink',
      'Fail to clutch → 2 drinks',
      'Die while holding site → 1 drink'
    ]
  }
];

const stratExamples = [
  { name: 'KNIFE ONLY ROUND', difficulty: 'HARD', description: 'Entire team uses knives only. First blood drinks.' },
  { name: 'JUDGE JURY', difficulty: 'MEDIUM', description: 'Everyone buys a Judge. If you lose, 2 drinks each.' },
  { name: 'SILENT COMMS', difficulty: 'EASY', description: 'No callouts for the round. Losing team drinks.' },
  { name: 'GUARDIAN ANGELS', difficulty: 'HARD', description: 'Guardian only. Miss a shot? Take a sip.' },
  { name: 'RUSH B NO STOP', difficulty: 'MEDIUM', description: '5-man rush one site. Hesitation = drink.' },
  { name: 'OP OR NOTHING', difficulty: 'HARD', description: 'Only AWPs allowed. Die = 2 drinks.' },
];

// All agent names for selection
const allAgents = agentData.map(a => a.name);

export default function CreateLobbyPage() {
  const router = useRouter();
  const { createLobby, settings, toggleMode, setIntensity, updatePlayerAgent, players, currentPlayerId } = useGameStore();

  const [activeTab, setActiveTab] = useState<TabId>('settings');
  const [playerName, setPlayerName] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string>('Jett');
  const [lobbyCreated, setLobbyCreated] = useState(false);
  const [lobbyId, setLobbyId] = useState('');
  const [copied, setCopied] = useState(false);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [showAgentSelect, setShowAgentSelect] = useState(false);

  const handleCreateLobby = () => {
    if (!playerName.trim()) {
      return;
    }

    const newLobbyId = createLobby(settings);
    setLobbyId(newLobbyId);
    setLobbyCreated(true);

    // Convert agent name to lowercase for AgentType compatibility
    const agentType = selectedAgent.toLowerCase().replace('/', '') as import('@/types').AgentType;

    useGameStore.setState((state) => ({
      players: state.players.map((p) =>
        p.isHost ? { ...p, name: playerName.toUpperCase(), agent: agentType } : p
      ),
    }));
  };

  // Get the agent color for the selected agent
  const getAgentColor = (agentName: string) => {
    const agent = agentData.find(a => a.name === agentName);
    return agent?.color || '#7DD3FC';
  };

  // Get selected agent data
  const selectedAgentData = agentData.find(a => a.name === selectedAgent);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(lobbyId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/lobby/join?code=${lobbyId}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartGame = () => {
    router.push(`/game/${lobbyId}`);
  };

  const currentIntensityIndex = intensityLevels.findIndex(
    (l) => l.id === settings.intensity
  );
  const intensityPercent = ((currentIntensityIndex + 1) / intensityLevels.length) * 100;
  const currentIntensity = intensityLevels[currentIntensityIndex];

  const renderContent = () => {
    switch (activeTab) {
      case 'agents':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '1px' }}>
                AGENT DRINKING RULES
              </h2>
              <p style={{ fontSize: '14px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace', lineHeight: 1.7 }}>
                Each agent has unique meme-worthy drinking rules. Click an agent to see their rules!
              </p>
            </div>

            {/* Role Sections */}
            {agentRoles.map((roleGroup) => (
              <div key={roleGroup.role} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Role Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 0',
                  borderBottom: `2px solid ${roleGroup.color}`
                }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: roleGroup.color, letterSpacing: '2px' }}>
                    {roleGroup.role}S
                  </span>
                  <span style={{ fontSize: '11px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace' }}>
                    {roleGroup.agents.length} agents
                  </span>
                </div>

                {/* Agent Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" style={{ gap: '16px' }}>
                  {roleGroup.agents.map((agent) => {
                    const isExpanded = expandedAgent === agent.name;
                    const rulesToShow = isExpanded ? agent.rules : agent.rules.slice(0, 4);

                    return (
                      <div
                        key={agent.name}
                        style={{
                          border: isExpanded ? `2px solid ${agent.color}` : '1px solid #333333',
                          overflow: 'hidden',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer'
                        }}
                        onClick={() => setExpandedAgent(isExpanded ? null : agent.name)}
                      >
                        {/* Agent Header */}
                        <div style={{
                          padding: '16px 20px',
                          backgroundColor: agent.color,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: '#0C0C0C', letterSpacing: '1px' }}>
                              {agent.name.toUpperCase()}
                            </span>
                            <span style={{ fontSize: '10px', color: 'rgba(0,0,0,0.6)', fontFamily: 'var(--font-space-mono), monospace' }}>
                              {isExpanded ? 'CLICK TO COLLAPSE' : `${agent.rules.length} RULES`}
                            </span>
                          </div>
                          <span style={{ fontSize: '11px', color: 'rgba(0,0,0,0.6)', fontStyle: 'italic', fontFamily: 'var(--font-space-mono), monospace' }}>
                            {agent.quote}
                          </span>
                        </div>

                        {/* Agent Rules */}
                        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#0C0C0C' }}>
                          {rulesToShow.map((rule: string, i: number) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                              <div style={{ width: '5px', height: '5px', backgroundColor: agent.color, marginTop: '6px', flexShrink: 0 }} />
                              <span style={{ fontSize: '12px', color: '#CCCCCC', fontFamily: 'var(--font-space-mono), monospace', lineHeight: 1.5 }}>
                                {rule}
                              </span>
                            </div>
                          ))}
                          {!isExpanded && agent.rules.length > 4 && (
                            <span style={{ fontSize: '10px', color: agent.color, fontFamily: 'var(--font-space-mono), monospace', paddingLeft: '15px', fontWeight: 600 }}>
                              +{agent.rules.length - 4} more rules... (click to expand)
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* General Rules Notice */}
            <div style={{
              padding: '20px 24px',
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              border: '1px solid #FF0000',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px'
            }}>
              <Target style={{ width: '20px', height: '20px', color: '#FF0000', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#FF0000', fontFamily: 'var(--font-space-mono), monospace' }}>
                  PRO TIP
                </span>
                <p style={{ fontSize: '12px', color: '#CCCCCC', fontFamily: 'var(--font-space-mono), monospace', lineHeight: 1.6 }}>
                  Rules are designed to match each agent&apos;s playstyle and community memes. Sage players MUST res someone or drink 3 at end of game!
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 'strats':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '1px' }}>
                STRAT ROULETTE LIBRARY
              </h2>
              <p style={{ fontSize: '14px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace', lineHeight: 1.7 }}>
                Random strats will be rolled each round. Enable Strat Roulette mode to use these.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '16px' }}>
              {stratExamples.map((strat) => (
                <div
                  key={strat.name}
                  style={{
                    border: '1px solid #333333',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '1px' }}>
                      {strat.name}
                    </span>
                    <span style={{
                      padding: '4px 10px',
                      backgroundColor: strat.difficulty === 'HARD' ? 'rgba(239, 68, 68, 0.2)' :
                        strat.difficulty === 'MEDIUM' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                      color: strat.difficulty === 'HARD' ? '#EF4444' :
                        strat.difficulty === 'MEDIUM' ? '#F59E0B' : '#22C55E',
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '1px',
                      fontFamily: 'var(--font-space-mono), monospace'
                    }}>
                      {strat.difficulty}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#AAAAAA', fontFamily: 'var(--font-space-mono), monospace', lineHeight: 1.6 }}>
                    {strat.description}
                  </p>
                </div>
              ))}
            </div>

            <div style={{
              padding: '20px 24px',
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              border: '1px solid #FF0000',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <Lock style={{ width: '20px', height: '20px', color: '#FF0000', flexShrink: 0 }} />
              <p style={{ fontSize: '13px', color: '#FF0000', fontFamily: 'var(--font-space-mono), monospace' }}>
                More strats unlock as you play. Complete games to expand the library.
              </p>
            </div>
          </motion.div>
        );

      default:
        return (
          <>
            {/* Game Modes Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                border: '1px solid #333333',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '28px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '1px', color: '#FFFFFF' }}>
                  GAME MODES
                </h2>
                <span style={{ fontSize: '11px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace' }}>
                  Select at least one
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '16px' }}>
                {gameModes.map((mode) => {
                  const isSelected = settings.modes.includes(mode.id);
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => toggleMode(mode.id)}
                      style={{
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        textAlign: 'left',
                        backgroundColor: isSelected ? 'rgba(255, 0, 0, 0.06)' : 'transparent',
                        border: isSelected ? '2px solid #FF0000' : '1px solid #333333',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ color: isSelected ? mode.color : '#666666' }}>
                            {mode.icon}
                          </div>
                          <span style={{
                            fontSize: '13px',
                            fontWeight: 700,
                            letterSpacing: '1px',
                            color: isSelected ? '#FFFFFF' : '#999999'
                          }}>
                            {mode.title}
                          </span>
                        </div>
                        <div style={{
                          width: '22px',
                          height: '22px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: isSelected ? '#FF0000' : 'transparent',
                          border: isSelected ? 'none' : '1px solid #333333'
                        }}>
                          {isSelected && <Check style={{ width: '14px', height: '14px', color: '#0C0C0C' }} />}
                        </div>
                      </div>
                      <span style={{ fontSize: '11px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace' }}>
                        {mode.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Intensity Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                border: '1px solid #333333',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '28px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '1px', color: '#FFFFFF' }}>
                  INTENSITY LEVEL
                </h2>
                <span style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  color: currentIntensity?.color || '#FF0000',
                  fontFamily: 'var(--font-space-mono), monospace'
                }}>
                  {currentIntensity?.title} PAIN
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Track */}
                <div style={{ width: '100%', height: '10px', backgroundColor: '#333333', position: 'relative' }}>
                  <div
                    style={{
                      height: '100%',
                      background: `linear-gradient(90deg, #78716C, ${currentIntensity?.color || '#FF0000'})`,
                      width: `${intensityPercent}%`,
                      transition: 'width 0.3s ease'
                    }}
                  />
                  {/* Clickable areas */}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
                    {intensityLevels.map((level) => (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() => setIntensity(level.id)}
                        style={{ flex: 1, height: '100%', background: 'transparent', border: 'none', cursor: 'pointer' }}
                      />
                    ))}
                  </div>
                </div>

                {/* Labels */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {intensityLevels.map((level, index) => (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setIntensity(level.id)}
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        letterSpacing: '1px',
                        fontFamily: 'var(--font-space-mono), monospace',
                        color: index <= currentIntensityIndex ? level.color : '#888888',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        transition: 'color 0.2s ease'
                      }}
                    >
                      {level.title}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        );
    }
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0C0C0C', display: 'flex' }}>
      {/* Left Sidebar */}
      <aside style={{
        width: '280px',
        backgroundColor: '#0A0A0A',
        borderRight: '1px solid #333333',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px'
      }} className="hidden lg:flex">
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Skull style={{ width: '22px', height: '22px', color: '#0C0C0C' }} />
          </div>
          <span style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '3px', color: '#FFFFFF' }}>
            SYP
          </span>
        </Link>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '2px', color: '#AAAAAA', fontFamily: 'var(--font-space-mono), monospace', marginBottom: '8px' }}>
            SETUP
          </span>

          {/* Settings Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              backgroundColor: activeTab === 'settings' ? 'rgba(255, 0, 0, 0.08)' : 'transparent',
              borderTop: 'none',
              borderRight: 'none',
              borderBottom: 'none',
              borderLeft: activeTab === 'settings' ? '3px solid #FF0000' : '3px solid transparent',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%'
            }}
          >
            <Settings style={{ width: '18px', height: '18px', color: activeTab === 'settings' ? '#FF0000' : '#666666' }} />
            <span style={{ fontSize: '12px', fontWeight: activeTab === 'settings' ? 600 : 500, color: activeTab === 'settings' ? '#FFFFFF' : '#999999', fontFamily: 'var(--font-space-mono), monospace' }}>
              Game Settings
            </span>
          </button>

          {/* Agent Rules Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('agents')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              backgroundColor: activeTab === 'agents' ? 'rgba(255, 0, 0, 0.08)' : 'transparent',
              borderTop: 'none',
              borderRight: 'none',
              borderBottom: 'none',
              borderLeft: activeTab === 'agents' ? '3px solid #FF0000' : '3px solid transparent',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%'
            }}
          >
            <Users style={{ width: '18px', height: '18px', color: activeTab === 'agents' ? '#FF0000' : '#666666' }} />
            <span style={{ fontSize: '12px', fontWeight: activeTab === 'agents' ? 600 : 500, color: activeTab === 'agents' ? '#FFFFFF' : '#999999', fontFamily: 'var(--font-space-mono), monospace' }}>
              Agent Rules
            </span>
          </button>

          {/* Strat Library Tab */}
          <button
            type="button"
            onClick={() => setActiveTab('strats')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              backgroundColor: activeTab === 'strats' ? 'rgba(255, 0, 0, 0.08)' : 'transparent',
              borderTop: 'none',
              borderRight: 'none',
              borderBottom: 'none',
              borderLeft: activeTab === 'strats' ? '3px solid #FF0000' : '3px solid transparent',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%'
            }}
          >
            <Dices style={{ width: '18px', height: '18px', color: activeTab === 'strats' ? '#FF0000' : '#666666' }} />
            <span style={{ fontSize: '12px', fontWeight: activeTab === 'strats' ? 600 : 500, color: activeTab === 'strats' ? '#FFFFFF' : '#999999', fontFamily: 'var(--font-space-mono), monospace' }}>
              Strat Library
            </span>
          </button>
        </nav>

        {/* Back Link */}
        <div style={{ marginTop: 'auto' }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              color: '#666666',
              fontSize: '12px',
              fontFamily: 'var(--font-space-mono), monospace',
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Back to Home
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px 48px', overflowY: 'auto', paddingTop: '100px' }} className="lg:pt-[40px]">
        {/* Header */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '1px', color: '#FFFFFF' }}>
              CREATE NEW LOBBY
            </h1>
            <p style={{ fontSize: '13px', color: '#999999', fontFamily: 'var(--font-space-mono), monospace' }}>
              Configure your game settings and share the code with your squad
            </p>
          </div>

          {/* Lobby Code - Only show when created */}
          {lobbyCreated && lobbyId && (
            <button
              onClick={handleCopyCode}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 24px',
                border: '2px solid #FF0000',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', color: '#666666', fontFamily: 'var(--font-space-mono), monospace' }}>
                LOBBY CODE:
              </span>
              <span style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '3px', color: '#FF0000' }}>
                {lobbyId}
              </span>
              {copied ? (
                <Check style={{ width: '20px', height: '20px', color: '#22C55E' }} />
              ) : (
                <Copy style={{ width: '20px', height: '20px', color: '#FF0000' }} />
              )}
            </button>
          )}
        </header>

        {/* Content Area */}
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          {/* Left Column - Dynamic Content */}
          <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {renderContent()}
          </div>

          {/* Right Column - Players (only show on settings tab or always) */}
          <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '24px' }} className="lg:w-[360px]">
            {/* Your Info Card */}
            {!lobbyCreated && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{
                  border: '1px solid #333333',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px'
                }}
              >
                <h2 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '1px', color: '#FFFFFF' }}>
                  YOUR INFO
                </h2>

                {/* Name Input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#AAAAAA', fontFamily: 'var(--font-space-mono), monospace' }}>
                    GAMERTAG
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value.slice(0, 16))}
                      placeholder="Enter your name..."
                      style={{
                        width: '100%',
                        height: '52px',
                        padding: '0 48px 0 16px',
                        backgroundColor: '#0C0C0C',
                        borderTop: '2px solid #444444',
                        borderRight: '2px solid #444444',
                        borderBottom: '2px solid #444444',
                        borderLeft: '4px solid #FF0000',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        fontWeight: 600,
                        fontFamily: 'var(--font-space-mono), monospace',
                        textTransform: 'uppercase',
                        outline: 'none',
                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#FF0000';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 0, 0, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#444444';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                    {/* Character count */}
                    <span style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: playerName.length >= 14 ? '#FF0000' : '#666666',
                      fontFamily: 'var(--font-space-mono), monospace',
                      pointerEvents: 'none',
                    }}>
                      {playerName.length}/16
                    </span>
                  </div>
                </div>

                {/* Agent Selection */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '2px', color: '#AAAAAA', fontFamily: 'var(--font-space-mono), monospace' }}>
                    SELECT AGENT
                  </label>
                  <div style={{ position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => setShowAgentSelect(!showAgentSelect)}
                      style={{
                        width: '100%',
                        height: '52px',
                        padding: '0 16px',
                        backgroundColor: '#1A1A1A',
                        border: `1px solid ${showAgentSelect ? getAgentColor(selectedAgent) : '#333333'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '24px', height: '24px', backgroundColor: getAgentColor(selectedAgent) }} />
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', fontFamily: 'var(--font-space-mono), monospace' }}>
                          {selectedAgent.toUpperCase()}
                        </span>
                      </div>
                      <span style={{ fontSize: '12px', color: '#666666' }}>{showAgentSelect ? '▲' : '▼'}</span>
                    </button>

                    {/* Agent Dropdown */}
                    {showAgentSelect && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        maxHeight: '300px',
                        overflowY: 'auto',
                        backgroundColor: '#1A1A1A',
                        border: '1px solid #333333',
                        borderTop: 'none',
                        zIndex: 100
                      }}>
                        {agentData.map((agent) => (
                          <button
                            key={agent.name}
                            type="button"
                            onClick={() => {
                              setSelectedAgent(agent.name);
                              setShowAgentSelect(false);
                            }}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              backgroundColor: selectedAgent === agent.name ? 'rgba(255, 0, 0, 0.1)' : 'transparent',
                              borderTop: 'none',
                              borderRight: 'none',
                              borderLeft: 'none',
                              borderBottom: '1px solid #333333',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            <div style={{ width: '20px', height: '20px', backgroundColor: agent.color }} />
                            <span style={{ fontSize: '12px', fontWeight: 500, color: '#FFFFFF', fontFamily: 'var(--font-space-mono), monospace' }}>
                              {agent.name.toUpperCase()}
                            </span>
                            <span style={{ fontSize: '10px', color: '#666666', marginLeft: 'auto' }}>
                              {agent.role}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Players Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                border: '1px solid #333333',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '1px', color: '#FFFFFF' }}>
                  {lobbyCreated ? 'PLAYERS' : 'LOBBY PREVIEW'}
                </h2>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#FF0000', fontFamily: 'var(--font-space-mono), monospace' }}>
                  {lobbyCreated ? `${players.length}/5` : '1/5'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Host Player */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px',
                  backgroundColor: 'rgba(255, 0, 0, 0.06)',
                  borderLeft: '3px solid #FF0000'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: getAgentColor(selectedAgent),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0C0C0C' }}>
                      {playerName ? playerName.slice(0, 2).toUpperCase() : '??'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>
                      {playerName || 'YOUR NAME'}
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '1px', color: getAgentColor(selectedAgent), fontFamily: 'var(--font-space-mono), monospace' }}>
                      HOST · {selectedAgent.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', backgroundColor: playerName ? '#22C55E' : '#666666' }} />
                    <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1px', color: playerName ? '#22C55E' : '#666666', fontFamily: 'var(--font-space-mono), monospace' }}>
                      {playerName ? 'READY' : 'NOT READY'}
                    </span>
                  </div>
                </div>

                {/* Waiting slots */}
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '16px',
                      border: '1px solid #333333'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      border: '1px solid #333333',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <UserPlus style={{ width: '18px', height: '18px', color: '#333333' }} />
                    </div>
                    <span style={{ fontSize: '12px', color: '#888888', fontFamily: 'var(--font-space-mono), monospace' }}>
                      Waiting for players...
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {!lobbyCreated ? (
                <button
                  type="button"
                  onClick={handleCreateLobby}
                  disabled={!playerName.trim()}
                  style={{
                    height: '60px',
                    backgroundColor: playerName.trim() ? '#FF0000' : '#333333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '14px',
                    border: 'none',
                    cursor: playerName.trim() ? 'pointer' : 'not-allowed',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <Play style={{ width: '22px', height: '22px', color: '#0C0C0C' }} />
                  <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '2px', color: '#0C0C0C' }}>
                    CREATE LOBBY
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStartGame}
                  style={{
                    height: '60px',
                    backgroundColor: '#FF0000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF0000'}
                >
                  <Play style={{ width: '22px', height: '22px', color: '#0C0C0C' }} />
                  <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '2px', color: '#0C0C0C' }}>
                    START GAME
                  </span>
                </button>
              )}

              {lobbyCreated && (
                <button
                  type="button"
                  onClick={handleCopyLink}
                  style={{
                    height: '52px',
                    border: '1px solid #333333',
                    backgroundColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#666666'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#333333'}
                >
                  <Share2 style={{ width: '18px', height: '18px', color: '#FFFFFF' }} />
                  <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1px', color: '#FFFFFF', fontFamily: 'var(--font-space-mono), monospace' }}>
                    SHARE INVITE LINK
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden" style={{
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
        padding: '0 24px',
        zIndex: 50
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Skull style={{ width: '22px', height: '22px', color: '#0C0C0C' }} />
          </div>
        </Link>
        {lobbyCreated && lobbyId ? (
          <button
            onClick={handleCopyCode}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 16px',
              border: '1px solid #FF0000',
              backgroundColor: 'transparent',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '2px', color: '#FF0000' }}>
              {lobbyId}
            </span>
            <Copy style={{ width: '16px', height: '16px', color: '#FF0000' }} />
          </button>
        ) : (
          <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1px', color: '#666666', fontFamily: 'var(--font-space-mono), monospace' }}>
            CREATE LOBBY
          </span>
        )}
      </div>
    </main>
  );
}
