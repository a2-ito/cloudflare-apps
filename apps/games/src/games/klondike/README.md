# 🃏 Klondike Solitaire

A modern **Klondike Solitaire** game built with **Next.js** and deployed on **Cloudflare Workers**.

- 🌙 Dark mode UI
- ☁️ Runs on Cloudflare Pages / Workers
- 🏆 High scores stored in Cloudflare KV
- 🌍 English-only interface
- ⚡ Fast, client-side gameplay

---

## 🎮 Features

- Classic Klondike rules
  - 7 Tableau piles
  - Stock / Waste
  - 4 Foundation piles
- Scoring system
- New Game button
- High score registration (player name supported)
- Fully responsive dark UI

---

## 🛠 Tech Stack

| Category   | Technology                |
| ---------- | ------------------------- |
| Framework  | Next.js (App Router)      |
| Runtime    | Cloudflare Workers (Edge) |
| Deployment | Cloudflare Pages          |
| Styling    | Tailwind CSS              |
| Storage    | Cloudflare KV             |
| Language   | TypeScript                |

---

## 📁 Project Structure

```
src/
├ app/
│ ├ page.tsx # Game screen
│ ├ layout.tsx # Root layout (dark mode)
│ └ api/
│ └ score/route.ts # High score API (KV)
│
├ components/
│ ├ Card.tsx
│ └ ScoreModal.tsx
│
├ lib/
│ ├ klondike.ts # Game logic
│ └ score.ts # API helpers
│
└ styles/
└ globals.css
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

2. Run locally

```bash
npm run dev
```

Open:
👉 http://localhost:3000
