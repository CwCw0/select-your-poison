import { Strat, StratCategory } from '@/types';

// Easy Strats - Low difficulty, fun for everyone
const easyStrats: Omit<Strat, 'id'>[] = [
  {
    text: "Call all enemies by animal names",
    description: "Every enemy callout must use an animal name instead of their actual location or agent name.",
    category: 'easy',
    penalty: 1,
    duration: 'round',
  },
  {
    text: "Crouch walk for first 15 seconds",
    description: "Everyone must crouch walk at the start of the round. No running allowed for 15 seconds.",
    category: 'easy',
    penalty: 1,
    duration: 'round',
  },
  {
    text: "No abilities until someone dies",
    description: "Cannot use any abilities until a teammate or enemy dies. Then abilities are unlocked.",
    category: 'easy',
    penalty: 1,
    duration: 'round',
  },
  {
    text: "Only use secondary weapons",
    description: "Everyone must use their pistol or secondary weapon only. No primary weapons allowed.",
    category: 'easy',
    penalty: 1,
    duration: 'round',
  },
  {
    text: "Whisper comms only",
    description: "All voice comms must be whispered. No yelling or normal volume talking.",
    category: 'easy',
    penalty: 1,
    duration: 'round',
  },
  {
    text: "Compliment enemies in all-chat",
    description: "Must say something nice about the enemy team in all-chat after each kill or death.",
    category: 'easy',
    penalty: 1,
    duration: 'round',
  },
  {
    text: "Trade or drink",
    description: "If a teammate dies and you don't get the trade within 5 seconds, take a drink.",
    category: 'easy',
    penalty: 1,
    duration: 'round',
  },
  {
    text: "Narrate your gameplay",
    description: "Must narrate everything you're doing like a sports commentator.",
    category: 'easy',
    penalty: 1,
    duration: 'round',
  },
  {
    text: "Jump before every shot",
    description: "Must jump at least once before firing your weapon each time.",
    category: 'easy',
    penalty: 1,
    duration: 'round',
  },
  {
    text: "Only communicate in questions",
    description: "All callouts and comms must be phrased as questions.",
    category: 'easy',
    penalty: 1,
    duration: 'round',
  },
];

// Medium Strats - Moderate difficulty, requires some coordination
const mediumStrats: Omit<Strat, 'id'>[] = [
  {
    text: "Everyone stack same site",
    description: "All 5 players must push the same site together. No splits, no lurks.",
    category: 'medium',
    penalty: 2,
    duration: 'round',
  },
  {
    text: "Knife out until first contact",
    description: "Everyone must have their knife out until the first enemy is spotted or shot at.",
    category: 'medium',
    penalty: 2,
    duration: 'round',
  },
  {
    text: "No comms - pings only",
    description: "No voice chat allowed. Only use the ping system to communicate.",
    category: 'medium',
    penalty: 2,
    duration: 'round',
  },
  {
    text: "Ability spam round",
    description: "Must use all abilities within the first 30 seconds of the round.",
    category: 'medium',
    penalty: 2,
    duration: 'round',
  },
  {
    text: "Bottom frag IGL",
    description: "The player with the lowest kills must call all the strats this round.",
    category: 'medium',
    penalty: 2,
    duration: 'round',
  },
  {
    text: "Rotate every 15 seconds",
    description: "Team must change positions/site every 15 seconds until contact.",
    category: 'medium',
    penalty: 2,
    duration: 'round',
  },
  {
    text: "Phoenix protocol",
    description: "Everyone plays aggressive. First one in, no baiting allowed.",
    category: 'medium',
    penalty: 2,
    duration: 'round',
  },
  {
    text: "Silent lurk",
    description: "One person must lurk the entire round without making any noise (no abilities, no shooting until last alive).",
    category: 'medium',
    penalty: 2,
    duration: 'round',
  },
  {
    text: "Copy the top frag",
    description: "Everyone must follow and copy exactly what the top fragger does.",
    category: 'medium',
    penalty: 2,
    duration: 'round',
  },
  {
    text: "Eco round mentality",
    description: "Play like it's an eco round. Play for picks, don't commit to site.",
    category: 'medium',
    penalty: 2,
    duration: 'round',
  },
  {
    text: "One tap only",
    description: "Can only fire single shots. No spraying or bursting allowed.",
    category: 'medium',
    penalty: 2,
    duration: 'round',
  },
  {
    text: "Retake mode",
    description: "Let enemies plant, then execute a retake. (Attack: Give up spike then retake)",
    category: 'medium',
    penalty: 2,
    duration: 'round',
  },
];

// Hard Strats - High difficulty, requires skill and coordination
const hardStrats: Omit<Strat, 'id'>[] = [
  {
    text: "Ability kills only",
    description: "First kill of the round must be with an ability. Guns allowed after.",
    category: 'hard',
    penalty: 3,
    duration: 'round',
  },
  {
    text: "No crosshair round",
    description: "Everyone must turn off their crosshair for this round.",
    category: 'hard',
    penalty: 3,
    duration: 'round',
  },
  {
    text: "Wrong hand challenge",
    description: "Play with your mouse in the opposite hand this round.",
    category: 'hard',
    penalty: 3,
    duration: 'round',
  },
  {
    text: "Guardian only",
    description: "Everyone must buy and use only the Guardian. No other weapons.",
    category: 'hard',
    penalty: 3,
    duration: 'round',
  },
  {
    text: "No sound challenge",
    description: "Everyone mutes their game audio for this round. Rely on visual info only.",
    category: 'hard',
    penalty: 3,
    duration: 'round',
  },
  {
    text: "Reverse roles",
    description: "Duelists play support, Controllers entry, Sentinels lurk, Initiators anchor.",
    category: 'hard',
    penalty: 3,
    duration: 'round',
  },
  {
    text: "1v1 chain",
    description: "Only one person can fight at a time. Others must wait until they die.",
    category: 'hard',
    penalty: 3,
    duration: 'round',
  },
  {
    text: "Zoom only",
    description: "Can only fire while ADS/scoped in. No hip fire allowed.",
    category: 'hard',
    penalty: 3,
    duration: 'round',
  },
  {
    text: "Spawn to site speedrun",
    description: "Rush to site as fast as possible. No clearing corners, no stopping.",
    category: 'hard',
    penalty: 3,
    duration: 'round',
  },
  {
    text: "Last alive decides",
    description: "The last person alive from last round makes all decisions this round.",
    category: 'hard',
    penalty: 3,
    duration: 'round',
  },
];

// Stupid But Possible - Maximum chaos
const stupidStrats: Omit<Strat, 'id'>[] = [
  {
    text: "Rush B no stop",
    description: "Sprint to B site without stopping. No checking corners, no slowing down.",
    category: 'stupid',
    penalty: 4,
    duration: 'round',
  },
  {
    text: "Shotguns and SMGs only",
    description: "Everyone must use only shotguns or SMGs. No rifles allowed.",
    category: 'stupid',
    penalty: 4,
    duration: 'round',
  },
  {
    text: "Flash your team",
    description: "Every flash must hit at least one teammate to count as used.",
    category: 'stupid',
    penalty: 4,
    duration: 'round',
  },
  {
    text: "Knife fight challenge",
    description: "First engagement must be attempted with knife only.",
    category: 'stupid',
    penalty: 4,
    duration: 'round',
  },
  {
    text: "Play upside down",
    description: "Flip your monitor/screen upside down for this round.",
    category: 'stupid',
    penalty: 4,
    duration: 'round',
  },
  {
    text: "Spray transfer every kill",
    description: "Cannot stop shooting between kills. Must spray transfer to the next target.",
    category: 'stupid',
    penalty: 4,
    duration: 'round',
  },
  {
    text: "W key warriors",
    description: "Cannot stop pressing W. Must always be moving forward.",
    category: 'stupid',
    penalty: 4,
    duration: 'round',
  },
  {
    text: "Backwards only",
    description: "Can only walk backwards. No forward movement allowed.",
    category: 'stupid',
    penalty: 4,
    duration: 'round',
  },
  {
    text: "Trade immediately or drink",
    description: "Teammate dies, you have 3 seconds to attempt the trade or drink.",
    category: 'stupid',
    penalty: 4,
    duration: 'round',
  },
  {
    text: "Full send every fight",
    description: "Cannot retreat or take cover once a fight starts. Commit fully.",
    category: 'stupid',
    penalty: 4,
    duration: 'round',
  },
  {
    text: "Crouch spam every gunfight",
    description: "Must crouch spam during every gunfight. No standing still.",
    category: 'stupid',
    penalty: 4,
    duration: 'round',
  },
  {
    text: "Maximum sensitivity",
    description: "Set your sensitivity to maximum for this round.",
    category: 'stupid',
    penalty: 4,
    duration: 'round',
  },
];

// Stable slug-based IDs — persist across reloads and deploys
export const allStrats: Strat[] = [
  ...easyStrats.map((s, i) => ({ ...s, id: `easy-${i + 1}` })),
  ...mediumStrats.map((s, i) => ({ ...s, id: `medium-${i + 1}` })),
  ...hardStrats.map((s, i) => ({ ...s, id: `hard-${i + 1}` })),
  ...stupidStrats.map((s, i) => ({ ...s, id: `stupid-${i + 1}` })),
];

export function getRandomStrat(category?: StratCategory): Strat {
  const filtered = category
    ? allStrats.filter(s => s.category === category)
    : allStrats;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function getStratsByCategory(category: StratCategory): Strat[] {
  return allStrats.filter(s => s.category === category);
}

export const stratCategoryColors: Record<StratCategory, string> = {
  easy: '#22C55E',     // Green
  medium: '#F59E0B',   // Amber
  hard: '#EF4444',     // Red
  stupid: '#A855F7',   // Purple
};

export const stratCategoryLabels: Record<StratCategory, string> = {
  easy: 'EASY',
  medium: 'MEDIUM',
  hard: 'HARD',
  stupid: 'STUPID BUT POSSIBLE',
};
