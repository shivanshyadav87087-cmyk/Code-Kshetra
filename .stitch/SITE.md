# Code क्षेtra — Sitemap & System Architecture (.stitch/SITE.md)

## 1. Comprehensive Sitemap

```
Code क्षेtra Web App Structure
├── 1. Landing Page (/)
│   ├── Unified Glass Navbar
│   ├── Hero Section with Live Stats Mockup & Primary CTA
│   ├── Feature Showcase (1v1 Duels, LeetCode Editor, Contest Arena)
│   ├── Social Proof Stats Bar
│   └── Footer (PWA Install Button, Links, Legal)
├── 2. Authentication Modal (/auth)
│   ├── Segmented Control Tabs (Sign In / Sign Up)
│   ├── Sign In Form (Username, Password, Forgot Password, OAuth)
│   └── Sign Up Form (Username, Email, Password, Confirm Password)
├── 3. Explore — Learning Tracks (/explore)
│   ├── Track 1: Data Structures & Algorithms
│   ├── Track 2: Dynamic Programming & Graphs
│   └── Track 3: 1v1 Speed Coding Tactics
├── 4. 1v1 Speed Duel Lobby (/lobby)
│   ├── Live ELO & Player Cards
│   ├── Matchmaking Queue (Human vs Human & AI Bot Duel)
│   └── Room Code Join & Private Battle Setup
├── 5. Contest Arena (/contests)
│   ├── Weekly & Biweekly Tournament Cards
│   ├── Countdown Timers & ELO Bracket Progression
│   └── Tournament Rules & Registration
├── 6. Battle/Duel Room Arena (/duel/:roomId)
│   ├── Top Status Bar (Opponent ELO, Countdown Timer, Leave Button)
│   ├── Left Panel: Opponent Progress & Live Submission Feed
│   ├── Center Panel: Monaco Code Editor & Test Case Runner
│   └── Right Panel: LeetCode Problem Description & Constraints
├── 7. Global Leaderboard (/leaderboard)
│   ├── Top 3 Podium (Gold, Silver, Bronze)
│   ├── ELO Ranked Ladder Table (Filter by Country/Username)
│   └── Current User Rank Highlight
└── 8. User Profile / Dashboard (/profile)
    ├── ELO Progress Chart & Rating Tier
    ├── Submission History & Battle Log
    └── Account & Notification Settings
```

---

## 2. Page Specifications & API Endpoints

### 1. Landing Page (`/`)
- **API Endpoints Used**:
  - `GET /api/auth/me` (Profile validation)
  - `GET /api/leaderboard` (Top coders ticker)
- **Breakpoints**: Mobile (375px), Tablet (768px), Desktop (1024px), Wide (1280px)

### 2. Authentication Modal
- **API Endpoints Used**:
  - `POST /api/auth/login`
  - `POST /api/auth/register`
  - `PUT /api/auth/profile`

### 3. 1v1 Battle Arena (`/duel/:roomId`)
- **API Endpoints / Sockets Used**:
  - Socket event: `create_room`, `join_room`, `player_code_update`
  - Socket event: `progress_update`, `submit_solution`, `accept_rematch`
  - `GET /api/auth/me?email=...`

---

## 3. User Flows

### Flow 1: Direct 1v1 Duel Entry
1. User clicks "Enter Battle Arena ⚔️" on Landing Page or 1v1 Lobby.
2. System verifies local session or creates guest coder instance (`Coder_XXX`).
3. App transitions instantly to Room Arena without returning 404 or throwing home.
4. Player solves problem, submits solution, views live ELO update and rematch option.

### Flow 2: Joining via Invitation Link (`?room=ABC123`)
1. Opponent clicks shared room link (`https://code-kshetra-alpha.vercel.app/?room=ABC123`).
2. App detects `pendingRoomId`, auto-authenticates guest session if unauthenticated.
3. Automatically joins room `ABC123`, launching countdown overlay and problem description.
