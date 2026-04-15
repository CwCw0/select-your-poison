import { AgentType, AgentRole, AgentRule } from '@/types';

export interface AgentInfo {
  id: AgentType;
  name: string;
  role: AgentRole;
  color: string;
  rules: AgentRule[];
}

export const agentColors: Record<AgentType, string> = {
  // Duelists
  jett: '#7DD3FC',      // Cyan
  reyna: '#A855F7',     // Purple
  phoenix: '#F97316',   // Orange
  raze: '#F59E0B',      // Amber
  yoru: '#3B82F6',      // Blue
  neon: '#22D3EE',      // Cyan bright
  iso: '#8B5CF6',       // Violet

  // Controllers
  brimstone: '#EF4444', // Red
  viper: '#22C55E',     // Green
  omen: '#6366F1',      // Indigo
  astra: '#EC4899',     // Pink
  harbor: '#06B6D4',    // Cyan
  clove: '#F472B6',     // Pink light

  // Initiators
  sova: '#3B82F6',      // Blue
  breach: '#F97316',    // Orange
  skye: '#22C55E',      // Green
  kayo: '#6B7280',      // Gray
  fade: '#7C3AED',      // Purple
  gekko: '#84CC16',     // Lime

  // Sentinels
  sage: '#67E8F9',      // Cyan light
  cypher: '#E5E5E5',    // Gray light
  killjoy: '#FCD34D',   // Yellow
  chamber: '#D4AF37',   // Gold
  deadlock: '#9CA3AF',  // Gray
  vyse: '#C084FC',      // Purple light
};

export const agents: AgentInfo[] = [
  // Duelists
  {
    id: 'jett',
    name: 'Jett',
    role: 'duelist',
    color: agentColors.jett,
    rules: [
      { agent: 'jett', rule: 'Updraft into death', drinks: 2, icon: 'wind' },
      { agent: 'jett', rule: 'Whiff an ult knife', drinks: 1, icon: 'target' },
      { agent: 'jett', rule: 'Dash into 3+ enemies', drinks: 2, icon: 'zap' },
    ],
  },
  {
    id: 'reyna',
    name: 'Reyna',
    role: 'duelist',
    color: agentColors.reyna,
    rules: [
      { agent: 'reyna', rule: 'Failed dismiss', drinks: 1, icon: 'ghost' },
      { agent: 'reyna', rule: 'Die without soul orb available', drinks: 1, icon: 'heart' },
      { agent: 'reyna', rule: 'Get killed during ult', drinks: 2, icon: 'eye' },
    ],
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    role: 'duelist',
    color: agentColors.phoenix,
    rules: [
      { agent: 'phoenix', rule: 'Die to own molly', drinks: 3, icon: 'flame' },
      { agent: 'phoenix', rule: 'Flash teammates', drinks: 1, icon: 'sun' },
      { agent: 'phoenix', rule: 'Ult expires with 0 kills', drinks: 2, icon: 'bird' },
    ],
  },
  {
    id: 'raze',
    name: 'Raze',
    role: 'duelist',
    color: agentColors.raze,
    rules: [
      { agent: 'raze', rule: 'Satchel into death', drinks: 2, icon: 'rocket' },
      { agent: 'raze', rule: 'Damage yourself with nade', drinks: 1, icon: 'bomb' },
      { agent: 'raze', rule: 'Whiff rocket launcher', drinks: 2, icon: 'target-off' },
    ],
  },
  {
    id: 'yoru',
    name: 'Yoru',
    role: 'duelist',
    color: agentColors.yoru,
    rules: [
      { agent: 'yoru', rule: 'TP into death', drinks: 2, icon: 'shuffle' },
      { agent: 'yoru', rule: 'Flash yourself', drinks: 1, icon: 'zap' },
      { agent: 'yoru', rule: 'Decoy fools nobody', drinks: 1, icon: 'copy' },
    ],
  },
  {
    id: 'neon',
    name: 'Neon',
    role: 'duelist',
    color: agentColors.neon,
    rules: [
      { agent: 'neon', rule: 'Sprint into death', drinks: 2, icon: 'zap' },
      { agent: 'neon', rule: 'Slide gets you killed', drinks: 1, icon: 'move-diagonal' },
      { agent: 'neon', rule: 'Ult does 0 damage', drinks: 2, icon: 'bolt' },
    ],
  },
  {
    id: 'iso',
    name: 'Iso',
    role: 'duelist',
    color: agentColors.iso,
    rules: [
      { agent: 'iso', rule: 'Lose the 1v1 ult', drinks: 3, icon: 'swords' },
      { agent: 'iso', rule: 'Shield pops instantly', drinks: 1, icon: 'shield-off' },
      { agent: 'iso', rule: 'Double tap whiff', drinks: 1, icon: 'crosshair' },
    ],
  },

  // Controllers
  {
    id: 'brimstone',
    name: 'Brimstone',
    role: 'controller',
    color: agentColors.brimstone,
    rules: [
      { agent: 'brimstone', rule: 'Molly yourself', drinks: 2, icon: 'flame' },
      { agent: 'brimstone', rule: 'Smoke wrong site', drinks: 1, icon: 'cloud' },
      { agent: 'brimstone', rule: 'Ult hits 0 enemies', drinks: 2, icon: 'target-off' },
    ],
  },
  {
    id: 'viper',
    name: 'Viper',
    role: 'controller',
    color: agentColors.viper,
    rules: [
      { agent: 'viper', rule: 'Die in own smoke', drinks: 2, icon: 'cloud-fog' },
      { agent: 'viper', rule: 'Snake bite yourself', drinks: 1, icon: 'droplet' },
      { agent: 'viper', rule: 'Run out of fuel at worst time', drinks: 1, icon: 'battery-low' },
    ],
  },
  {
    id: 'omen',
    name: 'Omen',
    role: 'controller',
    color: agentColors.omen,
    rules: [
      { agent: 'omen', rule: 'TP into death', drinks: 2, icon: 'ghost' },
      { agent: 'omen', rule: 'Flash teammates', drinks: 1, icon: 'eye-off' },
      { agent: 'omen', rule: 'Ult to obvious spot and die', drinks: 2, icon: 'map-pin' },
    ],
  },
  {
    id: 'astra',
    name: 'Astra',
    role: 'controller',
    color: agentColors.astra,
    rules: [
      { agent: 'astra', rule: 'Pull nobody', drinks: 1, icon: 'magnet' },
      { agent: 'astra', rule: 'Concuss teammates', drinks: 1, icon: 'brain' },
      { agent: 'astra', rule: 'Die while in astral form', drinks: 2, icon: 'star' },
    ],
  },
  {
    id: 'harbor',
    name: 'Harbor',
    role: 'controller',
    color: agentColors.harbor,
    rules: [
      { agent: 'harbor', rule: 'Wall blocks teammates', drinks: 1, icon: 'waves' },
      { agent: 'harbor', rule: 'Cove breaks instantly', drinks: 1, icon: 'shield-off' },
      { agent: 'harbor', rule: 'Ult hits nobody', drinks: 2, icon: 'droplets' },
    ],
  },
  {
    id: 'clove',
    name: 'Clove',
    role: 'controller',
    color: agentColors.clove,
    rules: [
      { agent: 'clove', rule: 'Die during self-res', drinks: 2, icon: 'heart' },
      { agent: 'clove', rule: 'Decay hits teammates', drinks: 1, icon: 'skull' },
      { agent: 'clove', rule: 'Smoke expires at bad time', drinks: 1, icon: 'cloud-off' },
    ],
  },

  // Initiators
  {
    id: 'sova',
    name: 'Sova',
    role: 'initiator',
    color: agentColors.sova,
    rules: [
      { agent: 'sova', rule: 'Recon reveals 0 enemies', drinks: 1, icon: 'radar' },
      { agent: 'sova', rule: 'Drone destroyed instantly', drinks: 1, icon: 'plane' },
      { agent: 'sova', rule: 'Ult hits nothing', drinks: 2, icon: 'target-off' },
    ],
  },
  {
    id: 'breach',
    name: 'Breach',
    role: 'initiator',
    color: agentColors.breach,
    rules: [
      { agent: 'breach', rule: 'Flash teammates', drinks: 1, icon: 'zap' },
      { agent: 'breach', rule: 'Stun yourself', drinks: 1, icon: 'alert-triangle' },
      { agent: 'breach', rule: 'Ult hits only teammates', drinks: 2, icon: 'earthquake' },
    ],
  },
  {
    id: 'skye',
    name: 'Skye',
    role: 'initiator',
    color: agentColors.skye,
    rules: [
      { agent: 'skye', rule: 'Flash teammates', drinks: 1, icon: 'bird' },
      { agent: 'skye', rule: 'Dog destroyed instantly', drinks: 1, icon: 'dog' },
      { agent: 'skye', rule: 'Ult seekers find nobody', drinks: 2, icon: 'search' },
    ],
  },
  {
    id: 'kayo',
    name: 'KAY/O',
    role: 'initiator',
    color: agentColors.kayo,
    rules: [
      { agent: 'kayo', rule: 'Flash teammates', drinks: 1, icon: 'zap' },
      { agent: 'kayo', rule: 'Knife suppresses nobody', drinks: 1, icon: 'knife' },
      { agent: 'kayo', rule: 'Nobody revives you', drinks: 2, icon: 'robot' },
    ],
  },
  {
    id: 'fade',
    name: 'Fade',
    role: 'initiator',
    color: agentColors.fade,
    rules: [
      { agent: 'fade', rule: 'Haunt reveals nobody', drinks: 1, icon: 'eye' },
      { agent: 'fade', rule: 'Prowler catches nobody', drinks: 1, icon: 'cat' },
      { agent: 'fade', rule: 'Ult misses everyone', drinks: 2, icon: 'moon' },
    ],
  },
  {
    id: 'gekko',
    name: 'Gekko',
    role: 'initiator',
    color: agentColors.gekko,
    rules: [
      { agent: 'gekko', rule: 'Flash teammates', drinks: 1, icon: 'sparkles' },
      { agent: 'gekko', rule: 'Forget to pick up creatures', drinks: 1, icon: 'recycle' },
      { agent: 'gekko', rule: 'Thrash catches nobody', drinks: 2, icon: 'bug' },
    ],
  },

  // Sentinels
  {
    id: 'sage',
    name: 'Sage',
    role: 'sentinel',
    color: agentColors.sage,
    rules: [
      { agent: 'sage', rule: 'Wall blocks teammates', drinks: 1, icon: 'brick-wall' },
      { agent: 'sage', rule: 'Res gets you killed', drinks: 2, icon: 'heart-pulse' },
      { agent: 'sage', rule: 'Slow orb slows teammates', drinks: 1, icon: 'snowflake' },
    ],
  },
  {
    id: 'cypher',
    name: 'Cypher',
    role: 'sentinel',
    color: agentColors.cypher,
    rules: [
      { agent: 'cypher', rule: 'Camera destroyed early', drinks: 1, icon: 'camera' },
      { agent: 'cypher', rule: 'Tripwire catches nobody', drinks: 1, icon: 'git-branch' },
      { agent: 'cypher', rule: 'Die before using ult', drinks: 2, icon: 'hat' },
    ],
  },
  {
    id: 'killjoy',
    name: 'Killjoy',
    role: 'sentinel',
    color: agentColors.killjoy,
    rules: [
      { agent: 'killjoy', rule: 'Turret destroyed early', drinks: 1, icon: 'crosshair' },
      { agent: 'killjoy', rule: 'Swarm grenade hits nobody', drinks: 1, icon: 'bug' },
      { agent: 'killjoy', rule: 'Ult gets destroyed', drinks: 2, icon: 'lock' },
    ],
  },
  {
    id: 'chamber',
    name: 'Chamber',
    role: 'sentinel',
    color: agentColors.chamber,
    rules: [
      { agent: 'chamber', rule: 'TP into death', drinks: 2, icon: 'anchor' },
      { agent: 'chamber', rule: 'Whiff headhunter shots', drinks: 1, icon: 'target' },
      { agent: 'chamber', rule: 'Tour de force hits nothing', drinks: 2, icon: 'crosshair' },
    ],
  },
  {
    id: 'deadlock',
    name: 'Deadlock',
    role: 'sentinel',
    color: agentColors.deadlock,
    rules: [
      { agent: 'deadlock', rule: 'Wall catches nobody', drinks: 1, icon: 'shield' },
      { agent: 'deadlock', rule: 'Sonic sensor useless', drinks: 1, icon: 'volume-x' },
      { agent: 'deadlock', rule: 'Ult catches nobody', drinks: 2, icon: 'lock' },
    ],
  },
  {
    id: 'vyse',
    name: 'Vyse',
    role: 'sentinel',
    color: agentColors.vyse,
    rules: [
      { agent: 'vyse', rule: 'Shear destroys nothing', drinks: 1, icon: 'slice' },
      { agent: 'vyse', rule: 'Arc Rose catches nobody', drinks: 1, icon: 'flower' },
      { agent: 'vyse', rule: 'Steel Garden blocks nobody', drinks: 2, icon: 'fence' },
    ],
  },
];

export function getAgentById(id: AgentType): AgentInfo | undefined {
  return agents.find(a => a.id === id);
}

export function getAgentsByRole(role: AgentRole): AgentInfo[] {
  return agents.filter(a => a.role === role);
}

export const roleLabels: Record<AgentRole, string> = {
  duelist: 'DUELISTS',
  controller: 'CONTROLLERS',
  initiator: 'INITIATORS',
  sentinel: 'SENTINELS',
};

export const roleColors: Record<AgentRole, string> = {
  duelist: '#FF0000',
  controller: '#22C55E',
  initiator: '#3B82F6',
  sentinel: '#F59E0B',
};
