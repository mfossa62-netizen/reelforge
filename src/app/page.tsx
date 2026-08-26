"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { THEMES, type ThemeTemplate } from "@/lib/themes";

type MediaItem = { id: string; type: "image"; url: string; name: string };
type TextOverlay = { id: string; text: string; x: number; y: number; fontSize: number; color: string; fontWeight: "normal" | "bold" };
type TransitionType = "none" | "fade" | "slide" | "zoom" | "crossfade";
type EffectType = "none" | "bright" | "vintage" | "cool" | "warm" | "grayscale" | "contrast" | "soft";
type Project = {
  media: MediaItem[];
  texts: TextOverlay[];
  backgroundColor: string;
  themeName?: string;
  secondsPerSlide: number;
  transition: TransitionType;
  effect: EffectType;
  transitionDuration: number;
  playbackSpeed: number;
};

function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const TRANSITIONS: { id: TransitionType; label: string }[] = [
  { id: "none", label: "Cut" },
  { id: "fade", label: "Fade" },
  { id: "crossfade", label: "Crossfade" },
  { id: "slide", label: "Slide" },
  { id: "zoom", label: "Zoom" },
];
const EFFECTS: { id: EffectType; label: string }[] = [
  { id: "none", label: "None" },
  { id: "bright", label: "Bright" },
  { id: "vintage", label: "Vintage" },
  { id: "cool", label: "Cool" },
  { id: "warm", label: "Warm" },
  { id: "grayscale", label: "B&W" },
  { id: "contrast", label: "Contrast" },
  { id: "soft", label: "Soft" },
];

const DEFAULT_PROJECT: Project = {
  media: [], texts: [], backgroundColor: "#000000",
  secondsPerSlide: 3, transition: "crossfade", effect: "none",
  transitionDuration: 1.2, playbackSpeed: 1,
};

export default function Home() {
  const [project, setProject] = useState<Project>(DEFAULT_PROJECT);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [exportingVideo, setExportingVideo] = useState(false);
  const [exportProgress, setExportProgress] = useState("");
  const [activeTab, setActiveTab] = useState<"themes" | "media" | "text" | "effects">("themes");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [playheadTime, setPlayheadTime] = useState(0);
  const [customLooks, setCustomLooks] = useState<ThemeTemplate[]>([]);
  const [lookName, setLookName] = useState("My look");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const animFrameRef = useRef<number | null>(null);
  const slideStartRef = useRef(0);
  const isPlayingRef = useRef(false);
  const indexRef = useRef(0);
  const projectRef = useRef(project);
  const lastUiRef = useRef(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("reelforge-custom-looks");
      if (raw) setCustomLooks(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => { projectRef.current = project; }, [project]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { indexRef.current = currentSlideIndex; }, [currentSlideIndex]);

  const slideDur = project.secondsPerSlide / Math.max(0.25, project.playbackSpeed);
  const totalDuration = project.media.length * slideDur;

  useEffect(() => {
    project.media.forEach((m) => {
      const cached = imageCache.current.get(m.url);
      if (cached?.complete && cached.naturalWidth > 0) return;
      const img = new Image();
      if (!m.url.startsWith("blob:")) img.crossOrigin = "anonymous";
      img.onload = () => {
        imageCache.current.set(m.url, img);
        window.dispatchEvent(new Event("reelforge-redraw"));
      };
      img.src = m.url;
      imageCache.current.set(m.url, img);
    });
  }, [project.media]);

  const applyTheme = (theme: ThemeTemplate) => {
    const texts = theme.texts.map((t) => ({ ...t, id: crypto.randomUUID() }));
    setProject((p) => ({
      ...p,
      backgroundColor: theme.backgroundColor,
      texts,
      themeName: theme.name,
      transition: theme.transition,
      effect: theme.effect,
      transitionDuration: theme.transitionDuration,
      secondsPerSlide: theme.secondsPerSlide,
      playbackSpeed: theme.playbackSpeed,
    }));
    setSelectedTextId(texts[0]?.id || null);
    setActiveTab("media");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const items: MediaItem[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(), type: "image", url: URL.createObjectURL(file), name: file.name,
    }));
    setProject((p) => ({ ...p, media: [...p.media, ...items] }));
    if (fileInputRef.current) fileInputRef.current.value = "";
    setCurrentSlideIndex(0);
    indexRef.current = 0;
  };

  const applyEffect = (ctx: CanvasRenderingContext2D, effect: EffectType) => {
    const map: Record<EffectType, string> = {
      none: "none", bright: "brightness(1.25) contrast(1.05)",
      vintage: "sepia(0.45) contrast(1.1) brightness(0.95)",
      cool: "hue-rotate(190deg) saturate(1.2)", warm: "sepia(0.25) saturate(1.3)",
      grayscale: "grayscale(1) contrast(1.1)", contrast: "contrast(1.4)",
      soft: "blur(1px) brightness(1.05)",
    };
    ctx.filter = map[effect] || "none";
  };

  const cover = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, cw: number, ch: number, scaleExtra = 1, ox = 0, oy = 0, alpha = 1) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    const scale = Math.max(cw / img.width, ch / img.height) * scaleExtra;
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, (cw - w) / 2 + ox, (ch - h) / 2 + oy, w, h);
    ctx.restore();
  };

  const drawFrame = useCallback((slideIndex: number, progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const proj = projectRef.current;
    const n = Math.max(proj.media.length, 1);
    const idx = ((slideIndex % n) + n) % n;
    const nextIdx = (idx + 1) % n;
    ctx.fillStyle = proj.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (proj.media.length === 0) {
      ctx.fillStyle = "#52525b";
      ctx.font = "16px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Tap a look, then upload your photos", canvas.width / 2, canvas.height / 2);
      return;
    }
    const ready = (img?: HTMLImageElement) => !!(img && (img.complete || img.naturalWidth > 0));
    const curr = imageCache.current.get(proj.media[idx].url);
    const next = imageCache.current.get(proj.media[nextIdx].url);
    const p = ease(Math.min(1, Math.max(0, progress)));
    ctx.save();
    applyEffect(ctx, proj.effect);
    const t = proj.transition;
    if (t === "none") {
      if (ready(curr)) cover(ctx, curr!, canvas.width, canvas.height);
    } else if (t === "slide") {
      if (ready(curr)) cover(ctx, curr!, canvas.width, canvas.height, 1, -canvas.width * p, 0, 1);
      if (ready(next)) cover(ctx, next!, canvas.width, canvas.height, 1, canvas.width * (1 - p), 0, 1);
    } else if (t === "zoom") {
      if (ready(curr)) cover(ctx, curr!, canvas.width, canvas.height, 1 + p * 0.2, 0, 0, 1 - p);
      if (ready(next)) cover(ctx, next!, canvas.width, canvas.height, 0.85 + p * 0.15, 0, 0, p);
    } else {
      if (ready(curr)) cover(ctx, curr!, canvas.width, canvas.height, 1, 0, 0, Math.max(0, 1 - p));
      if (ready(next)) cover(ctx, next!, canvas.width, canvas.height, 1, 0, 0, Math.min(1, p));
    }
    ctx.restore();
    ctx.filter = "none";
    ctx.globalAlpha = 1;
    proj.texts.forEach((txt) => {
      ctx.font = `${txt.fontWeight} ${txt.fontSize}px system-ui`;
      ctx.fillStyle = txt.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.7)";
      ctx.shadowBlur = 8;
      ctx.fillText(txt.text, (txt.x / 100) * canvas.width, (txt.y / 100) * canvas.height);
      ctx.shadowColor = "transparent";
    });
  }, []);

  useEffect(() => {
    if (!isPlaying || project.media.length === 0) {
      if (animFrameRef.current) { cancelAnimationFrame(animFrameRef.current); animFrameRef.current = null; }
      return;
    }
    slideStartRef.current = performance.now();
    const tick = (now: number) => {
      if (!isPlayingRef.current) return;
      const p = projectRef.current;
      const eff = p.secondsPerSlide / Math.max(0.25, p.playbackSpeed);
      const tMs = p.transition === "none" ? 0 : p.transitionDuration * 1000;
      const hMs = Math.max(150, eff * 1000 - tMs);
      const totalMs = hMs + tMs;
      let elapsed = now - slideStartRef.current;
      let idx = indexRef.current;
      while (elapsed >= totalMs && p.media.length > 0) {
        elapsed -= totalMs;
        idx = (idx + 1) % p.media.length;
        indexRef.current = idx;
        slideStartRef.current = now - elapsed;
      }
      let progress = 0;
      if (tMs > 0 && elapsed >= hMs) progress = Math.min(1, (elapsed - hMs) / tMs);
      drawFrame(idx, progress);
      if (now - lastUiRef.current > 100) {
        lastUiRef.current = now;
        setPlayheadTime(idx * eff + elapsed / 1000);
        setCurrentSlideIndex(idx);
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, [isPlaying, project.media.length, drawFrame]);

  useEffect(() => { if (!isPlaying) drawFrame(currentSlideIndex, 0); }, [drawFrame, currentSlideIndex, isPlaying, project]);
  useEffect(() => {
    const onRedraw = () => { if (!isPlayingRef.current) drawFrame(indexRef.current, 0); };
    window.addEventListener("reelforge-redraw", onRedraw);
    return () => window.removeEventListener("reelforge-redraw", onRedraw);
  }, [drawFrame]);

  const jumpToSlide = (i: number) => {
    setIsPlaying(false);
    setCurrentSlideIndex(i);
    indexRef.current = i;
    setPlayheadTime(i * slideDur);
  };

  const handleExportVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas || project.media.length === 0) return;
    setIsPlaying(false);
    setExportingVideo(true);
    setExportProgress("Preparing…");
    const chunks: Blob[] = [];
    const stream = canvas.captureStream(30);
    const mimeCandidates = ["video/mp4;codecs=avc1.42E01E", "video/mp4", "video/webm;codecs=vp9", "video/webm"];
    const mimeType = mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) || "video/webm";
    const ext = mimeType.includes("mp4") ? "mp4" : "webm";
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 6_000_000 });
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    const done = new Promise<Blob>((resolve) => { recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType })); });
    const p = projectRef.current;
    const n = p.media.length;
    const eff = p.secondsPerSlide / Math.max(0.25, p.playbackSpeed);
    const tMs = p.transition === "none" ? 0 : Math.max(800, p.transitionDuration * 1000);
    const hMs = Math.max(300, eff * 1000 - tMs);
    const slideMs = hMs + tMs;
    const totalMs = (n - 1) * slideMs + hMs;
    const frameDuration = 1000 / 30;
    const totalFrames = Math.ceil(totalMs / frameDuration);
    recorder.start(50);
    for (let f = 0; f < totalFrames; f++) {
      const elapsed = f * frameDuration;
      let idx = n - 1;
      let progress = 0;
      if (elapsed < (n - 1) * slideMs) {
        idx = Math.floor(elapsed / slideMs);
        const local = elapsed - idx * slideMs;
        if (tMs > 0 && local >= hMs) progress = Math.min(1, (local - hMs) / tMs);
      }
      drawFrame(idx, progress);
      setExportProgress(`Recording… ${Math.round(((f + 1) / totalFrames) * 100)}%`);
      await new Promise((r) => setTimeout(r, frameDuration));
    }
    recorder.stop();
    const blob = await done;
    const a = document.createElement("a");
    a.download = `reel-${Date.now()}.${ext}`;
    a.href = URL.createObjectURL(blob);
    a.click();
    setExportingVideo(false);
    setExportProgress("");
  };

  const selectedText = project.texts.find((t) => t.id === selectedTextId);
  const playheadPercent = totalDuration > 0 ? Math.min(100, (playheadTime / totalDuration) * 100) : 0;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900 shrink-0">
        <div>
          <h1 className="font-semibold text-lg">ReelForge</h1>
          <p className="text-[11px] text-zinc-400">Tap a look or build your own in FX</p>
        </div>
        <button onClick={handleExportVideo} disabled={exportingVideo || project.media.length === 0} className="px-4 py-2 rounded-lg bg-violet-600 text-sm">
          {exportingVideo ? exportProgress || "Exporting…" : "Export Video"}
        </button>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 border-r border-zinc-800 bg-zinc-900 flex flex-col shrink-0">
          <div className="flex border-b border-zinc-800 text-[11px]">
            {(["themes", "media", "text", "effects"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2.5 capitalize ${activeTab === tab ? "text-violet-400 border-b-2 border-violet-500" : "text-zinc-500"}`}>
                {tab === "themes" ? "Looks" : tab === "effects" ? "FX" : tab}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {activeTab === "themes" && (
              <div className="space-y-3">
                <p className="text-[11px] text-zinc-400">Preset looks or your saved templates. Then swap in your photos.</p>
                {customLooks.length > 0 && (
                  <div>
                    <p className="text-[11px] text-zinc-400 mb-2">My templates</p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {customLooks.map((theme) => (
                        <button key={theme.id} onClick={() => applyTheme(theme)} className={`text-left p-3 rounded-xl border ${project.themeName === theme.name ? "border-violet-500 bg-violet-500/10" : "border-zinc-700"}`}>
                          <div className="text-sm font-medium">{theme.name}</div>
                          <div className="text-[9px] text-violet-300/80">{theme.transition} · {theme.effect}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {THEMES.map((theme) => (
                    <button key={theme.id} onClick={() => applyTheme(theme)} className={`text-left p-3 rounded-xl border ${project.themeName === theme.name ? "border-violet-500 bg-violet-500/10" : "border-zinc-700"}`}>
                      <div className="text-2xl">{theme.emoji}</div>
                      <div className="text-sm font-medium">{theme.name}</div>
                      <div className="text-[9px] text-violet-300/80">{theme.transition} · {theme.effect} · {theme.playbackSpeed}x</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "media" && (
              <div className="space-y-3">
                <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 rounded-xl border border-dashed border-zinc-600 text-sm">+ Replace / add photos</button>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} />
                {project.media.map((m, i) => (
                  <div key={m.id} className={`relative rounded-xl overflow-hidden border ${currentSlideIndex === i ? "border-violet-500" : "border-zinc-700"}`}>
                    <img src={m.url} alt={m.name} className="w-full h-20 object-cover" />
                    <button onClick={() => setProject((p) => ({ ...p, media: p.media.filter((x) => x.id !== m.id) }))} className="absolute top-1 right-1 text-[10px] bg-red-600 px-1.5 rounded">x</button>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "text" && (
              <div className="space-y-3">
                {project.texts.map((t) => (
                  <div key={t.id} onClick={() => setSelectedTextId(t.id)} className={`p-3 rounded-xl border cursor-pointer ${selectedTextId === t.id ? "border-violet-500" : "border-zinc-700"}`}>
                    <p className="text-sm truncate">{t.text}</p>
                  </div>
                ))}
                {selectedText && (
                  <input value={selectedText.text} onChange={(e) => setProject((p) => ({ ...p, texts: p.texts.map((t) => (t.id === selectedText.id ? { ...t, text: e.target.value } : t)) }))} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm" />
                )}
              </div>
            )}
            {activeTab === "effects" && (
              <div className="space-y-4">
                <p className="text-[11px] text-zinc-400">Build your own template. Changes apply to the preview immediately.</p>
                <div>
                  <p className="text-[11px] text-zinc-400 mb-2">Transition</p>
                  <div className="grid grid-cols-2 gap-2">
                    {TRANSITIONS.map((tr) => (
                      <button key={tr.id} onClick={() => setProject((p) => ({ ...p, transition: tr.id, themeName: "Custom" }))} className={`py-2 rounded-lg text-xs border ${project.transition === tr.id ? "border-violet-500 text-violet-300" : "border-zinc-700"}`}>{tr.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400">Blend {project.transitionDuration.toFixed(1)}s</label>
                  <input type="range" min={0.4} max={2.5} step={0.1} value={project.transitionDuration} onChange={(e) => setProject((p) => ({ ...p, transitionDuration: Number(e.target.value) }))} className="w-full accent-violet-500" />
                </div>
                <div>
                  <p className="text-[11px] text-zinc-400 mb-2">Color grade</p>
                  <div className="grid grid-cols-2 gap-2">
                    {EFFECTS.map((fx) => (
                      <button key={fx.id} onClick={() => setProject((p) => ({ ...p, effect: fx.id, themeName: "Custom" }))} className={`py-2 rounded-lg text-xs border ${project.effect === fx.id ? "border-violet-500 text-violet-300" : "border-zinc-700"}`}>{fx.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400">Seconds per photo {project.secondsPerSlide.toFixed(1)}</label>
                  <input type="range" min={1} max={6} step={0.5} value={project.secondsPerSlide} onChange={(e) => setProject((p) => ({ ...p, secondsPerSlide: Number(e.target.value) }))} className="w-full accent-violet-500" />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400">Speed {project.playbackSpeed.toFixed(1)}x</label>
                  <input type="range" min={0.5} max={2} step={0.1} value={project.playbackSpeed} onChange={(e) => setProject((p) => ({ ...p, playbackSpeed: Number(e.target.value) }))} className="w-full accent-violet-500" />
                </div>
                <div className="pt-2 border-t border-zinc-800 space-y-2">
                  <p className="text-[11px] text-zinc-400">Save as my template</p>
                  <input value={lookName} onChange={(e) => setLookName(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm" />
                  <button onClick={() => {
                    const look: ThemeTemplate = {
                      id: `mine-${Date.now()}`,
                      name: lookName.trim() || "My look",
                      emoji: "*",
                      description: "Custom",
                      backgroundColor: project.backgroundColor,
                      texts: project.texts.map(({ id: _id, ...rest }) => rest),
                      transition: project.transition,
                      effect: project.effect,
                      transitionDuration: project.transitionDuration,
                      secondsPerSlide: project.secondsPerSlide,
                      playbackSpeed: project.playbackSpeed,
                    };
                    const next = [look, ...customLooks].slice(0, 20);
                    setCustomLooks(next);
                    localStorage.setItem("reelforge-custom-looks", JSON.stringify(next));
                    setProject((p) => ({ ...p, themeName: look.name }));
                  }} className="w-full py-2 rounded-lg bg-violet-600 text-sm">Save look</button>
                </div>
              </div>
            )}
          </div>
        </aside>
        <main className="flex-1 flex flex-col items-center justify-center bg-zinc-950 p-4">
          <canvas ref={canvasRef} width={360} height={640} className="bg-black rounded-2xl border border-zinc-800 max-h-[52vh] w-auto" />
          <div className="mt-4 flex items-center gap-3">
            <button onClick={() => { setIsPlaying(false); setCurrentSlideIndex(0); indexRef.current = 0; setPlayheadTime(0); }} className="px-3 h-10 rounded-full bg-zinc-800">Stop</button>
            <button onClick={() => project.media.length && setIsPlaying((v) => !v)} className="px-5 h-14 rounded-full bg-violet-600">{isPlaying ? "Pause" : "Play"}</button>
          </div>
          {project.media.length > 0 && (
            <div className="w-full max-w-xl mt-3 relative h-12 bg-zinc-900 rounded-xl overflow-hidden flex">
              {project.media.map((m, i) => (
                <button key={m.id} onClick={() => jumpToSlide(i)} className={`flex-1 overflow-hidden ${currentSlideIndex === i ? "ring-2 ring-violet-500" : "opacity-70"}`}>
                  <img src={m.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
              <div className="absolute top-0 bottom-0 w-0.5 bg-violet-400 pointer-events-none" style={{ left: `${playheadPercent}%` }} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
