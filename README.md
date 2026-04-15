# SELECT YOUR POISON

**Valorant Drinking Game + Strat Roulette — Real-time multiplayer.**

*"Cold rules. Chaotic outcomes. No mercy."*

A web app where you and your squad track deaths, drinks, and execute chaotic strats during Valorant games. Create a lobby, share the code, and everyone plays together in real-time.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| State | Zustand (client) + PartyKit (real-time sync) |
| Auth | NextAuth v5 + Prisma adapter |
| Database | PostgreSQL via Prisma ORM |
| Real-time | PartyKit (Cloudflare Workers WebSocket) |
| Validation | Zod |
| Hosting | Vercel + Neon + PartyKit |

## Game Modes

- **Classic** — Death = Drink. Simple 1:1 tracking.
- **Agent Poison** — Each Valorant agent has unique drink rules.
- **Strat Roulette** — Random challenges each round. Fail = penalty drinks.
- **Challenges** — Side objectives running throughout the game.
- **Punishment** — End-of-game consequences based on performance.

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (recommended: [Neon](https://neon.tech) free tier)

### Setup

```bash
# Clone and install
git clone <repo-url>
cd select-your-poison
npm install

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL and AUTH_SECRET (see .env.example for detailed guide)

# Generate Prisma client and push schema
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

See [.env.example](.env.example) for full setup guide. Required:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | NextAuth secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | App URL (e.g., `http://localhost:3000`) |

Optional: `AUTH_DISCORD_ID`, `AUTH_DISCORD_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing page
│   ├── login/              # Auth pages
│   ├── signup/
│   ├── lobby/create/       # Lobby creation wizard
│   ├── lobby/join/         # Join via code
│   ├── game/[id]/          # Live game tracker
│   ├── about/
│   ├── rules/
│   └── api/                # API routes (auth, lobby)
├── components/             # Shared UI components
│   ├── game/               # Game-specific components
│   ├── lobby/              # Lobby wizard components
│   ├── layout/             # Header, footer
│   └── ui/                 # Base UI primitives
├── lib/                    # Core logic
│   ├── agents.ts           # Valorant agent data + drink rules
│   ├── strats.ts           # 44 strat roulette challenges
│   ├── auth-config.ts      # NextAuth v5 configuration
│   ├── lobby.ts            # Lobby CRUD operations
│   └── db.ts               # Prisma client instance
├── store/                  # Zustand state stores
│   └── game-store.ts       # Game state management
├── types/                  # TypeScript type definitions
│   └── index.ts            # Single source of truth
└── party/                  # PartyKit real-time server (planned)
```

## Scripts

```bash
npm run dev     # Start dev server (Turbopack)
npm run build   # Production build
npm run start   # Start production server
npm run lint    # ESLint
```

## Deployment

Deploy to Vercel with Neon PostgreSQL:

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard
4. Vercel auto-deploys on push

---

*SELECT YOUR POISON is not affiliated with Riot Games.*
*21+ ONLY. PLEASE DRINK RESPONSIBLY.*
