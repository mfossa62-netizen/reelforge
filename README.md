# ReelForge

Create professional short-form videos (Reels / Shorts / TikTok-style) and share them to social platforms.

Built with **Next.js 16 + React 19 + Tailwind CSS 4**. Optimized for **Vercel**.

## Features (MVP)

- Upload images (video support coming next)
- 9:16 vertical preview canvas
- Multiple text overlays with position, size, color, weight
- Live preview
- Export current frame
- Clean dark UI ready for expansion

## Coming soon

- Full MP4 video export (FFmpeg.wasm / MediaRecorder)
- Timeline with multiple clips
- Music / audio
- Transitions & effects
- Direct posting to X, Instagram Reels, TikTok, YouTube Shorts (via official APIs)

## Local development

```bash
cd reels-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel (recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the GitHub repo `mfossa62-netizen/reelforge`
3. Click **Deploy**

You get a free `*.vercel.app` URL immediately.

## Project structure

```
src/app/
  layout.tsx      → Root layout + metadata
  page.tsx        → Main Reel editor (client component)
  globals.css     → Tailwind + custom theme
```

## Notes for video & social features

- **Video processing**: Full MP4 export will use client-side FFmpeg.wasm so it stays free on Vercel’s serverless limits.
- **Social posting**: You will need to create developer apps on Meta, TikTok, X, YouTube and add the keys as environment variables in the Vercel dashboard.

---

Made for easy ownership and deployment outside of Grok.
