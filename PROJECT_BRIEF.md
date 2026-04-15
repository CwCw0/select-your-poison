# SELECT YOUR POISON - Project Brief

## Overview
**SELECT YOUR POISON** is a Valorant Drinking Game + Strat Roulette web application that lets players track deaths, drinks, and execute chaotic strats during Valorant games.

**Tagline:** *"Cold rules. Chaotic outcomes. No mercy."*

---

## Game Modes

### MODE A: CLASSIC (Death = Drink)
- Simple 1:1 ratio - every death = 1 drink
- No strats, no agent rules, just pure tracking
- Best for: Casual games, first-timers

### MODE B: AGENT POISON
- Each agent has unique drinking rules
- Example: Jett mains drink 2x on death, Reyna drinks on failed dismiss
- Rules shown on player card during game
- Best for: Themed nights, agent mains

### MODE C: STRAT ROULETTE
- Random challenge rolled before each round
- Strats have difficulty tiers: Easy, Medium, Hard, Stupid
- Failing a strat = penalty drinks for team
- Can reroll limited times per half
- Best for: Chaos, content creation

### MODE D: CHALLENGES
- Side objectives running throughout game
- Example: 'First blood = opponent drinks', 'Ace = waterfall'
- Can be team or individual challenges
- Best for: Adding variety to any mode

### MODE E: PUNISHMENT
- End-of-game consequences based on performance
- Bottom frag finishes drink, most deaths = truth or dare
- Applied at game end screen
- Best for: High stakes games

---

## Intensity Presets

| Preset | Description | Multiplier |
|--------|-------------|------------|
| **Casual Night** | Light rules, fewer drinks | 0.5x |
| **Ranked Ready** | Balanced gameplay | 1x |
| **Immortal Push** | Challenging rules | 1.5x |
| **Radiant or Bust** | Maximum chaos | 2x |

---

## Strat Roulette Categories

### Easy Strats
- "Call out all enemy positions in animal names"
- "Must crouch walk for first 15 seconds"
- "Only use abilities after teammate dies"

### Medium Strats
- "Everyone stack same site"
- "Knife out until first contact"
- "No comms - pings only"

### Hard Strats
- "Bottom frag plays lurk only"
- "Must use all abilities before shooting"
- "Rotate every 10 seconds"

### Stupid But Possible
- "Rush B no stop" (every round)
- "Only shotguns and SMGs"
- "Must kill with ability damage first"

---

## Agent-Specific Rules

| Agent | Rule | Drink Penalty |
|-------|------|---------------|
| **Jett** | Updraft into death | 2 drinks |
| **Reyna** | Failed dismiss | 1 drink |
| **Phoenix** | Die to own molly | 3 drinks |
| **Cypher** | Camera destroyed early | 1 drink |
| **Sage** | Teammate dies while wall is up | 1 drink |
| **Sova** | Recon reveals 0 enemies | 1 drink |
| **Omen** | TP into death | 2 drinks |
| **Viper** | Die while inside your own smoke | 2 drinks |
| **Brimstone** | Miss a molly | 1 drink |
| **Killjoy** | Turret destroyed first | 1 drink |

---

## Game Flow & Mechanics

### Round Tracking (Manual)
1. Host or any player taps 'ROUND WON' or 'ROUND LOST' button
2. Score updates automatically (e.g., 4-2 → 5-2 on win)
3. Round counter increments (Round 6 → Round 7)
4. At Round 12 (halftime), system prompts 'HALF TIME' screen
5. At Round 24 or when one team reaches 13 wins, game ends

### Half-Time (Round 12 Complete)
- Triggered when round counter reaches 12
- Shows first-half stats summary: deaths, drinks per player
- Attackers become Defenders and vice versa
- 'Continue to Second Half' button resumes tracking

### Overtime (Score 12-12)
- **2X DRINK MULTIPLIER** active during overtime rounds
- All deaths = double drinks until game ends
- First to 14 wins
- Overtime can extend indefinitely until winner

### Death & Drink Tracking
- '+1 DEATH' button → Increments death counter, auto-adds drinks based on rules
- '+1 DRINK' button → Manual drink addition (for penalties, strats, etc.)
- Drinks can be fractional based on mode settings
- Agent-specific rules may modify drink multipliers

---

## Technical Architecture

### Frontend Stack
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **State:** Zustand (client) + PartyKit (server sync)

### Backend Stack
- **Auth:** NextAuth v5 with Prisma adapter
- **Database:** PostgreSQL via Prisma ORM
- **Real-time:** PartyKit (Cloudflare Workers-based WebSocket rooms)
- **Validation:** Zod

### Infrastructure
- **Hosting:** Vercel
- **Database:** Neon (serverless PostgreSQL, free tier)
- **Real-time:** PartyKit (Cloudflare edge, free tier)
- **Auth:** NextAuth v5 (built-in, no external service)

---

## Data Models

### Lobby State (PostgreSQL via Prisma + PartyKit for real-time)
```typescript
interface LobbyState {
  id: string; // 'POISON-7X3K'
  hostId: string;
  status: 'waiting' | 'in_progress' | 'halftime' | 'overtime' | 'ended';
  settings: {
    modes: GameMode[];
    intensity: 'casual' | 'ranked' | 'immortal' | 'radiant';
    maxPlayers: number;
  };
  game: {
    round: number;
    teamScore: number;
    enemyScore: number;
    side: 'attack' | 'defense';
    currentStrat: Strat | null;
  };
  players: Player[];
  history: RoundHistory[];
  createdAt: number;
  expiresAt: number;
}
```

### Player Model
```typescript
interface Player {
  id: string;
  name: string;
  agent: AgentType;
  color: string;
  deaths: number;
  drinks: number;
  isHost: boolean;
  isReady: boolean;
  connected: boolean;
}
```

### Strat Model
```typescript
interface Strat {
  id: string;
  text: string;
  description: string;
  category: 'easy' | 'medium' | 'hard' | 'stupid';
  penalty: number; // drinks for failure
  duration: 'round' | 'half' | 'game';
}
```

---

## Design Tokens

### Colors
```css
/* Background */
--bg-primary: #0C0C0C;
--bg-secondary: #0A0A0A;
--bg-tertiary: #1A1A1A;
--bg-hover: #222222;

/* Borders */
--border-default: #333333;
--border-active: #FF0000;

/* Text */
--text-primary: #FFFFFF;
--text-secondary: #999999;
--text-muted: #666666;

/* Accent */
--accent-red: #FF0000;
--accent-green: #22C55E;
--accent-amber: #F59E0B;
--accent-error: #EF4444;
--accent-purple: #A855F7;
--accent-cyan: #7DD3FC;
--accent-orange: #F97316;
```

### Typography
```css
/* Display */
font-family: 'Inter', sans-serif;
font-size: 64-96px;
font-weight: 800;
letter-spacing: -2 to -4px;

/* Label */
font-family: 'Space Mono', monospace;
font-size: 10-12px;
font-weight: 600;
letter-spacing: 2px;
text-transform: uppercase;
```

### Spacing
```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
```

---

## Screens & Pages

### Public Pages
1. **Landing Page** - Hero, game modes, how it works, agent rules, presets, CTA
2. **404 Error Page** - "You've been eliminated" styled error

### Auth Pages
3. **Login** - Email/password + Discord/Google OAuth
4. **Sign Up** - Registration with agent selection

### App Pages
5. **Lobby Creation** - Configure game settings, invite players
6. **Waiting Room** - Pre-game lobby with player list
7. **Agent Selection** - Choose agent with role-specific rules
8. **Live Tracker (Classic)** - Basic death/drink tracking
9. **Live Tracker (Strat Roulette)** - With active strat display
10. **Strat Roulette Roll** - Full-screen strat reveal animation
11. **Half-Time Break** - Mid-game stats and side swap
12. **Overtime** - Special overtime rules display
13. **Game End Summary** - Final stats and punishment selection
14. **User Profile** - Stats, history, settings
15. **Settings** - App preferences, sound, notifications
16. **Rule Customization** - Custom agent rules and strats

### Mobile Views
17. **Mobile Live Tracker** - Optimized for phone
18. **Mobile Player Card** - Individual player view
19. **Mobile Strat Roulette** - Swipe-based strat view
20. **Mobile Lobby** - Join/create lobbies
21. **Mobile Squad View** - Team overview
22. **Mobile Settings** - Quick settings access

---

## Animations & Interactions

### Page Transitions
- Fade in/out with Y-axis movement (20px)
- Duration: 300ms, easing: ease-out
- Stagger child elements by 50ms

### Counter Animations
- Number increment: Scale up 1.2x, then back to 1x
- Color flash: Target color at 100% opacity, fade to normal
- Duration: 200ms

### Strat Roulette Roll
1. **Phase 1:** Rapid cycling (50ms per item) for 1 second
2. **Phase 2:** Slow down with easing (100ms → 200ms → 400ms)
3. **Phase 3:** Final land with bounce + screen shake

### Button Interactions
- Hover: Background lightens 10%, cursor pointer
- Active: Scale 0.97, background darkens 10%
- Transition: 150ms ease-out

---

## Sound Design (Optional)

| Action | Sound |
|--------|-------|
| Button Click | Short, punchy click (50ms) |
| Death Added | Low thud/impact |
| Drink Added | Glass clink or pour |
| Round Won | Victory chime, ascending notes |
| Round Lost | Defeat tone, descending notes |
| Strat Roll | Slot machine clicking |
| Strat Reveal | Dramatic reveal with reverb |
| Half Time | Air horn or whistle |
| Game End | Full victory/defeat fanfare |

---

## Development Phases

### Phase 1: Foundations
- [x] Landing page with game mode explanations
- [x] Project structure (Next.js 16, Tailwind v4, Prisma, Zustand)
- [x] Prisma schema for all game models
- [x] Fix build (Prisma generate, TypeScript errors)
- [x] Resolve auth conflict (consolidate to NextAuth v5 only)
- [x] Unify type definitions (single source of truth)
- [x] Fix known bugs (strat IDs, game store logic)

### Phase 2: UX + Working UI
- [x] Lobby creation wizard (step-by-step, not overwhelming)
- [x] Game page mobile-first redesign (controls always accessible)
- [x] UI quality pass on every page (spacing, hover states, animations)
- [x] Entrance animation + page transition system
- [ ] All pages functional and responsive (375px → 1440px)

### Phase 3: Database + Auth Wiring
- [x] Neon PostgreSQL provisioned and connected
- [ ] Lobby persistence via Prisma (replace in-memory Maps)
- [x] Email/password signup + login (NextAuth v5 Credentials)
- [ ] Discord OAuth login (setup deferred — see TODO below)
- [ ] Google OAuth login (setup deferred — see TODO below)
- [ ] End-to-end auth flow (signup → login → session → lobby)

### Phase 4: Real-Time Multiplayer
- [ ] PartyKit game room server
- [ ] Real-time player sync (deaths, drinks, rounds broadcast)
- [ ] Lobby waiting room with live player join/leave/ready
- [ ] Host authority (only host advances rounds, rolls strats)

### Phase 5: Game Flow Completion
- [ ] Halftime screen with stats + side swap
- [ ] Game end screen with final stats + punishments
- [ ] Overtime (12-12 → 2x drink multiplier)
- [ ] Strat roulette slot machine animation + accept/reroll
- [ ] Sound effects (optional, mute by default)

### Phase 6: Polish + Deploy
- [ ] Security hardening (rate limiting, CSP, Zod validation)
- [ ] Mobile polish (touch feedback, sticky controls, responsive type)
- [ ] Performance (code splitting, image optimization)
- [ ] Deploy to Vercel + Neon + PartyKit

---

## Development Notes

### Why Manual Tracking?
- No Riot API dependency (simpler, works offline)
- Players already manually tracking deaths
- Allows flexibility for custom/unranked games
- No authentication with Riot required

### Real-Time Sync (PartyKit)
- Each lobby = one PartyKit room (Cloudflare Worker)
- Room ID = lobby code (e.g., `VXR-7K9`)
- All clients connect via PartySocket WebSocket
- State changes broadcast to all connected players in room
- Optimistic UI updates with server reconciliation
- Auto-reconnection with lobby rejoin on disconnect
- Lobby persistence in Neon PostgreSQL (survives server restarts)
- PartyKit handles ephemeral game state; Prisma handles durable data

### Multiplayer Architecture
```
Player A (browser) ─── PartySocket ───┐
Player B (browser) ─── PartySocket ───┼── PartyKit Room (CF Worker)
Player C (browser) ─── PartySocket ───┘         │
                                                  ├── Broadcasts state to all
                                                  └── Persists to Neon via Prisma
```

---

## TODO (Deferred)

### Discord OAuth Setup
- [ ] Go to https://discord.com/developers/applications
- [ ] Create app → OAuth2 → copy Client ID and Secret
- [ ] Add redirect URI: `http://localhost:3000/api/auth/callback/discord` (dev)
- [ ] Add redirect URI: `https://yourdomain.com/api/auth/callback/discord` (prod)
- [ ] Set `AUTH_DISCORD_ID` and `AUTH_DISCORD_SECRET` in `.env`

### Google OAuth Setup
- [ ] Go to https://console.cloud.google.com/ → APIs & Services → Credentials
- [ ] Create OAuth client ID (Web application)
- [ ] Add redirect URI: `http://localhost:3000/api/auth/callback/google` (dev)
- [ ] Add redirect URI: `https://yourdomain.com/api/auth/callback/google` (prod)
- [ ] Set `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` in `.env`

> **Note:** The code for Discord and Google login is already fully implemented in `src/lib/auth-config.ts`. Only the developer console setup + env vars are needed to activate them.

---

*Version 2.0 - April 2025*
*SELECT YOUR POISON - Not affiliated with Riot Games*
*21+ ONLY. PLEASE DRINK RESPONSIBLY.*
