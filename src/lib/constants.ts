import { AgentType, AgentRole, GameMode, IntensityLevel } from '@/types';

// ─── Agent List ──────────────────────────────────────────────────
export const AGENTS: AgentType[] = [
  'jett', 'reyna', 'phoenix', 'raze', 'yoru', 'neon', 'iso',
  'sova', 'breach', 'skye', 'kayo', 'fade', 'gekko',
  'brimstone', 'omen', 'viper', 'astra', 'harbor', 'clove',
  'sage', 'cypher', 'killjoy', 'chamber', 'deadlock', 'vyse',
];

// ─── Agent → Role Mapping ────────────────────────────────────────
export const AGENT_ROLES: Record<AgentType, AgentRole> = {
  jett: 'duelist', reyna: 'duelist', phoenix: 'duelist', raze: 'duelist',
  yoru: 'duelist', neon: 'duelist', iso: 'duelist',
  sova: 'initiator', breach: 'initiator', skye: 'initiator',
  kayo: 'initiator', fade: 'initiator', gekko: 'initiator',
  brimstone: 'controller', omen: 'controller', viper: 'controller',
  astra: 'controller', harbor: 'controller', clove: 'controller',
  sage: 'sentinel', cypher: 'sentinel', killjoy: 'sentinel',
  chamber: 'sentinel', deadlock: 'sentinel', vyse: 'sentinel',
};

// ─── Agent → Display Color ──────────────────────────────────────
export const AGENT_COLORS: Record<AgentType, string> = {
  // Duelists
  jett: '#7DD3FC',
  reyna: '#A855F7',
  phoenix: '#F97316',
  raze: '#F59E0B',
  yoru: '#3B82F6',
  neon: '#22D3EE',
  iso: '#8B5CF6',
  // Controllers
  brimstone: '#EF4444',
  viper: '#22C55E',
  omen: '#6366F1',
  astra: '#EC4899',
  harbor: '#06B6D4',
  clove: '#F472B6',
  // Initiators
  sova: '#3B82F6',
  breach: '#F97316',
  skye: '#22C55E',
  kayo: '#6B7280',
  fade: '#7C3AED',
  gekko: '#84CC16',
  // Sentinels
  sage: '#67E8F9',
  cypher: '#E5E5E5',
  killjoy: '#FCD34D',
  chamber: '#D4AF37',
  deadlock: '#9CA3AF',
  vyse: '#C084FC',
};

// ─── Agent Display Names ─────────────────────────────────────────
export const AGENT_NAMES: Record<AgentType, string> = {
  jett: 'Jett', reyna: 'Reyna', phoenix: 'Phoenix', raze: 'Raze',
  yoru: 'Yoru', neon: 'Neon', iso: 'Iso',
  brimstone: 'Brimstone', viper: 'Viper', omen: 'Omen',
  astra: 'Astra', harbor: 'Harbor', clove: 'Clove',
  sova: 'Sova', breach: 'Breach', skye: 'Skye',
  kayo: 'KAY/O', fade: 'Fade', gekko: 'Gekko',
  sage: 'Sage', cypher: 'Cypher', killjoy: 'Killjoy',
  chamber: 'Chamber', deadlock: 'Deadlock', vyse: 'Vyse',
};

// ─── Role Labels & Colors ────────────────────────────────────────
export const ROLE_LABELS: Record<AgentRole, string> = {
  duelist: 'DUELIST',
  controller: 'CONTROLLER',
  initiator: 'INITIATOR',
  sentinel: 'SENTINEL',
};

export const ROLE_COLORS: Record<AgentRole, string> = {
  duelist: '#FF0000',
  controller: '#22C55E',
  initiator: '#3B82F6',
  sentinel: '#F59E0B',
};

// ─── Game Mode Labels ────────────────────────────────────────────
export const MODE_LABELS: Record<GameMode, string> = {
  classic: 'PUNISHMENT',
  agent_poison: 'AGENT POISON',
  strat_roulette: 'STRAT ROULETTE',
  challenges: 'CHALLENGES',
  punishment: 'PUNISHMENT',
};

// ─── Intensity Labels ────────────────────────────────────────────
export const INTENSITY_LABELS: Record<IntensityLevel, { label: string; color: string }> = {
  casual: { label: 'IRON', color: '#78716C' },
  ranked: { label: 'GOLD', color: '#EAB308' },
  immortal: { label: 'DIAMOND', color: '#A855F7' },
  radiant: { label: 'RADIANT', color: '#FF0000' },
};

// ─── Agent Drinking Rules (used in game page & player cards) ─────
export const AGENT_DRINKING_RULES: Record<string, string[]> = {
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

// ─── Helper: Light-colored agents for text contrast ──────────────
const LIGHT_AGENT_COLORS = ['#7DD3FC', '#E5E5E5', '#67E8F9', '#84CC16', '#FCD34D', '#F59E0B', '#D4AF37', '#22D3EE', '#F472B6', '#C084FC'];

export function getAgentHeaderTextColor(agentColor: string): string {
  return LIGHT_AGENT_COLORS.includes(agentColor) ? '#0C0C0C' : '#FFFFFF';
}

// ─── Helper: Get agent color safely ──────────────────────────────
export function getAgentColor(agent: string | null | undefined): string {
  if (!agent) return '#7DD3FC';
  return AGENT_COLORS[agent.toLowerCase() as AgentType] || '#7DD3FC';
}
