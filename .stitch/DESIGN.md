# Code क्षेtra — Design System (.stitch/DESIGN.md)

## 1. Brand Identity & Product Vision
- **Name**: Code क्षेtra (Bilingual: English + Devanagari "क्षेtra")
- **Tagline**: Real-Time Competitive Coding Battleground
- **Personality**: Competitive, precise, confident, Indian-rooted, globally professional.
- **Reference Standard**: Linear.app (micro-polish & dark glass surfaces) + Chess.com (competitive ELO & matchmaking energy) + LeetCode (deep coding & judge UX) + Vercel (dark aesthetic).

---

## 2. Color Palette (Dark-First System)

### Surface & Background Tokens
- `bg-primary`: `#0A0B0F` — Base application dark canvas
- `bg-surface`: `#111318` — Component cards, sidebars, modals
- `bg-elevated`: `#1A1D26` — Hover states, dropdown menus, code editor containers
- `border-subtle`: `rgba(255, 255, 255, 0.08)` — Clean 1px component boundaries

### Typography & Content Colors
- `text-primary`: `#F8FAFC` — Primary headings, key metrics, active text
- `text-muted`: `#94A3B8` — Subtitles, descriptions, secondary stats
- `text-subtle`: `#64748B` — Disabled labels, timestamps, line numbers

### Brand & Status Accents
- `accent-teal`: `#14B8A6` — Primary CTA, focus rings, active indicators
- `accent-purple`: `#8B5CF6` — ELO/rank highlights, Knight tier, tournament badges
- `success`: `#22C55E` — Testcase passed, Accepted, online status
- `warning`: `#EAB308` — Medium difficulty, pending status, upcoming contest
- `error`: `#EF4444` — Testcase failed, timer urgency (<60s), forfeit alert
- `gold`: `#F59E0B` — Guardian rank, #1 Leaderboard crown, tournament trophy

---

## 3. Typography Hierarchy

### Font Families
- **Display / Headings**: `"Outfit"`, `"Plus Jakarta Sans"`, sans-serif (700 - 800 weight)
- **Body / Interface**: `"Inter"`, sans-serif (400 - 600 weight)
- **Code / Monospace / Stats**: `"JetBrains Mono"`, `"Fira Code"`, monospace
- **Devanagari**: `"Noto Sans Devanagari"`, sans-serif (for "क्षेtra" branding)

### Font Scale & Line Height
- `56px` (`3.5rem`) / `1.1` — Hero H1
- `48px` (`3rem`) / `1.15` — Section Title H2
- `32px` (`2rem`) / `1.2` — Page Header H3
- `24px` (`1.5rem`) / `1.3` — Card Heading / Modal Title
- `20px` (`1.25rem`) / `1.4` — Subheading / Metric Label
- `16px` (`1rem`) / `1.5` — Body Standard
- `14px` (`0.875rem`) / `1.5` — Component Label / Table Row
- `12px` (`0.75rem`) / `1.4` — Micro Badge / Monospace Meta

---

## 4. Spacing & Grid System
Base Grid: 4px strictly enforced.
- **Scale**: `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`, `96px`

### Border Radii
- `sm`: `6px` — Tags, micro badges, tooltips
- `md`: `10px` — Buttons, input fields, testcase chips
- `lg`: `16px` — Cards, code editor shell, panel boxes
- `xl`: `24px` — Hero mockups, main modals, arena panels
- `full`: `9999px` — Avatars, status pills, rank indicators

---

## 5. Components & UI Primitives

### 1. Button
- **Variants**:
  - `primary`: `#14B8A6` (Teal), text `#0A0B0F`, font-black
  - `secondary`: Surface fill `#111318`, border `rgba(255,255,255,0.12)`, text `#F8FAFC`
  - `ghost`: Transparent background, text `#94A3B8`, hover `#1A1D26`
  - `danger`: Red border/fill, text `#EF4444`
- **Sizes**: `sm` (32px), `md` (40px), `lg` (48px)

### 2. Card
- `default`: `#111318` background, `rgba(255,255,255,0.08)` border, 16px radius
- `glass`: `#111318` with `backdrop-blur-md` and `bg-opacity-80`
- `elevated`: `#1A1D26` with subtle shadow `0 4px 24px rgba(0,0,0,0.4)`

### 3. ELO Rank Badges
- **Newbie** (< 1200): Slate gray badge `#64748B`
- **Specialist** (1200 - 1599): Teal badge `#14B8A6`
- **Knight** (1600 - 1999): Purple badge `#8B5CF6`
- **Guardian** (2000+): Gold badge `#F59E0B`

---

## 6. Motion & Accessibility Guidance
- **Transitions**: Smooth `200ms ease-in-out` for page steps and dropdowns
- **Hover Micro-Interactions**: `scale(1.015)` + brightness shift (150ms)
- **Countdown Urgency**: Subtle pulse animation on last 10 seconds
- **Accessibility**:
  - WCAG AA contrast ratio minimum (minimum 4.5:1 text-to-bg)
  - Clear keyboard `:focus-visible` ring (`2px solid #14B8A6`)
  - Full aria attributes and trap management on all modals
