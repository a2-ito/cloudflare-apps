# Tetris (Next.js on Cloudflare Pages)

A modern **Tetris game** built with **Next.js (App Router)** and deployed on **Cloudflare Pages**.
The game runs entirely on the client side using `<canvas>` — no backend, no Workers.

---

## ✨ Features

- 🎮 Classic Tetris gameplay
- ⚡ Smooth canvas-based rendering
- 🔄 Piece rotation & hard drop
- ▶️ Start / End / Restart controls
- 🌙 Light / Dark mode toggle
- 🏆 High score saved in cookies
- ☁️ Cloudflare Pages friendly (static)
- 🌐 English-only UI

---

## 🕹 Controls

| Key   | Action            |
| ----- | ----------------- |
| ← / → | Move left / right |
| ↓     | Soft drop         |
| ↑     | Rotate piece      |
| Space | Hard drop         |

---

## 🧱 Tech Stack

- **Next.js** (App Router)
- **React**
- **TypeScript**
- **HTML Canvas**
- **Cloudflare Pages**

No server-side code, APIs, or Cloudflare Workers are used.

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploy to Cloudflare Pages

1. Push this repository to GitHub
2. Create a new **Cloudflare Pages** project
3. Set build options:

- **Framework preset**: Next.js
- **Build command**: `npm run build`
- **Output directory**: `.next`

4. Deploy 🚀

---

## 🏆 High Score

- The high score is stored in **browser cookies**
- Automatically updates when a new record is reached
- Persists across page reloads

---

## 📁 Project Structure (simplified)

```
src/
 └─ app/
     └─ page.tsx   # Main Tetris game
```

---

## 🔧 Future Improvements

- Next piece preview
- Wall kick rotation
- Game over overlay animation
- Mobile touch controls
- Level & speed progression

---

## 📄 License

MIT License

---

Enjoy the game! 🎉
