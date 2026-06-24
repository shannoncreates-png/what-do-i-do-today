# What do I do today?

A Tinder-style activity swipe app with 1,239 ideas across 12 categories. Swipe right to like, left to skip — the algorithm learns your vibe and serves better suggestions over time.

## Features

- **1,239 activities** across 12 categories: outdoors, food, social, culture, creative, wellness, adventure, sports, lifestyle, crafts, gaming, nightlife
- **3-phase recommendation algorithm** that adapts to your preferences as you swipe
- **Filter by** category, budget, weather, and vibe (solo/date)
- **Surprise me** — random activity picker
- **Group vote** — create a sharable `/vote/[id]` URL so friends can vote on your liked pile
- **Session persistence** via localStorage — resume where you left off
- **PWA** — installable to home screen
- **SEO-ready** — server-rendered landing with structured data, Open Graph tags, sitemap

## Project structure

```
app/
  layout.tsx          — Root layout with metadata, OG tags, JSON-LD
  page.tsx            — Home page (SSR static activity list for SEO + client SwipeApp)
  sitemap.ts          — Auto-generated sitemap
  vote/[id]/page.tsx  — SSR group vote page with OG preview
  api/
    vote-sessions/    — POST to create a vote session
    vote-sessions/[id]/vote/ — POST to cast a vote

components/
  SwipeApp.tsx        — Top-level client orchestrator (screen state machine)
  FilterScreen.tsx    — Category / budget / weather / vibe filters
  SwipeCard.tsx       — Drag card with velocity-based flick detection
  SwipeScreen.tsx     — Swipe loop with ghost card stack
  ResultScreen.tsx    — Best match + liked grid
  GridModal.tsx       — Full-screen grid of liked items
  GroupSetupScreen.tsx — Create vote session and copy link
  GroupVotePage.tsx   — Client vote UI (loaded from SSR page)
  ResumeScreen.tsx    — Resume or restart prompt
  ServiceWorkerRegistrar.tsx — PWA service worker registration

lib/
  activities.ts       — All 1,239 activities (TypeScript typed array)
  algorithm.ts        — scoreActivity(), pickNext(), buildPool()
  constants.ts        — CAT_COLOR, CAT_EMOJI, labels, category list
  storage.ts          — localStorage session save/load/clear
  voteStore.ts        — Vote session CRUD (Vercel KV or in-memory fallback)
```

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values for Vercel KV (optional — without it, vote sessions use in-memory storage that resets on restart, which is fine for local dev).

```
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

## Deploying to Vercel

1. Push to GitHub
2. Import in [vercel.com](https://vercel.com)
3. Add KV Storage from the Vercel dashboard (Storage → KV)
4. Environment variables are auto-populated

## PWA icons

Add `public/icon-192.png` and `public/icon-512.png` (✨ emoji on dark purple background works well) to enable home screen installation with a proper icon.
