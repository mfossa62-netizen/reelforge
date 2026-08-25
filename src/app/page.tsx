"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type MediaItem = {
  id: string;
  type: "image" | "video";
  url: string;
  name: string;
};

type TextOverlay = {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontWeight: "normal" | "bold";
};

type TransitionType = "none" | "fade" | "slide" | "zoom";
type EffectType = "none" | "bright" | "vintage" | "cool" | "warm" | "grayscale" | "contrast" | "soft";

type Project = {
  media: MediaItem[];
  texts: TextOverlay[];
  backgroundColor: string;
  themeName?: string;
  secondsPerSlide: number;
  transition: TransitionType;
  effect: EffectType;
};

type ThemeTemplate = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  backgroundColor: string;
  texts: Omit<TextOverlay, "id">[];
};

const THEMES: ThemeTemplate[] = [
  { id: "motivation", name: "Motivation", emoji: "🔥", description: "Bold hooks & energy", backgroundColor: "#0f0f0f", texts: [
    { text: "STOP SCROLLING", x: 50, y: 28, fontSize: 42, color: "#ffffff", fontWeight: "bold" },
    { text: "This changes everything", x: 50, y: 48, fontSize: 28, color: "#fbbf24", fontWeight: "bold" },
    { text: "Save this for later 👇", x: 50, y: 78, fontSize: 22, color: "#a3a3a3", fontWeight: "normal" },
  ]},
  { id: "fitness", name: "Fitness", emoji: "💪", description: "Gym & transformation", backgroundColor: "#111827", texts: [
    { text: "DAY 47", x: 50, y: 22, fontSize: 56, color: "#22c55e", fontWeight: "bold" },
    { text: "No excuses.", x: 50, y: 42, fontSize: 36, color: "#ffffff", fontWeight: "bold" },
    { text: "Just results.", x: 50, y: 58, fontSize: 32, color: "#86efac", fontWeight: "normal" },
  ]},
  { id: "business", name: "Business", emoji: "💼", description: "Clean & professional", backgroundColor: "#0c0a09", texts: [
    { text: "THE TRUTH ABOUT", x: 50, y: 30, fontSize: 26, color: "#a8a29e", fontWeight: "normal" },
    { text: "Building Wealth", x: 50, y: 48, fontSize: 40, color: "#fafaf9", fontWeight: "bold" },
    { text: "in 2026", x: 50, y: 65, fontSize: 28, color: "#f59e0b", fontWeight: "bold" },
  ]},
  { id: "travel", name: "Travel", emoji: "✈️", description: "Wanderlust vibes", backgroundColor: "#0c4a6e", texts: [
    { text: "Hidden gem ✨", x: 50, y: 25, fontSize: 28, color: "#7dd3fc", fontWeight: "normal" },
    { text: "You need to visit", x: 50, y: 45, fontSize: 36, color: "#ffffff", fontWeight: "bold" },
    { text: "this place", x: 50, y: 62, fontSize: 34, color: "#e0f2fe", fontWeight: "bold" },
  ]},
  { id: "food", name: "Food", emoji: "🍕", description: "Tasty & colorful", backgroundColor: "#7c2d12", texts: [
    { text: "Recipe in 30 seconds", x: 50, y: 28, fontSize: 26, color: "#fdba74", fontWeight: "normal" },
    { text: "You will CRY", x: 50, y: 48, fontSize: 42, color: "#ffffff", fontWeight: "bold" },
    { text: "when you try this", x: 50, y: 68, fontSize: 28, color: "#fed7aa", fontWeight: "normal" },
  ]},
  { id: "fashion", name: "Fashion", emoji: "👗", description: "Style & aesthetic", backgroundColor: "#1e1b4b", texts: [
    { text: "OUTFIT OF THE DAY", x: 50, y: 25, fontSize: 22, color: "#c4b5fd", fontWeight: "normal" },
    { text: "Steal this look", x: 50, y: 45, fontSize: 38, color: "#ffffff", fontWeight: "bold" },
    { text: "Link in bio 🔗", x: 50, y: 72, fontSize: 24, color: "#a78bfa", fontWeight: "normal" },
  ]},
  { id: "neon", name: "Neon", emoji: "💜", description: "Cyber & vibrant", backgroundColor: "#0f0518", texts: [
    { text: "NIGHT MODE", x: 50, y: 30, fontSize: 32, color: "#e879f9", fontWeight: "bold" },
    { text: "ON", x: 50, y: 50, fontSize: 64, color: "#22d3ee", fontWeight: "bold" },
    { text: "Stay until the end", x: 50, y: 75, fontSize: 22, color: "#c026d3", fontWeight: "normal" },
  ]},
  { id: "minimal", name: "Minimal", emoji: "✨", description: "Clean & simple", backgroundColor: "#fafafa", texts: [
    { text: "less is more", x: 50, y: 42, fontSize: 36, color: "#171717", fontWeight: "normal" },
    { text: "—", x: 50, y: 55, fontSize: 28, color: "#a3a3a3", fontWeight: "normal" },
    { text: "keep it simple", x: 50, y: 68, fontSize: 22, color: "#525252", fontWeight: "normal" },
  ]},
];

const TRANSITIONS = [
  { id: "none" as TransitionType, label: "Cut" },
  { id: "fade" as TransitionType, label: "Fade" },
  { id: "slide" as TransitionType, label: "Slide" },
  { id: "zoom" as TransitionType, label: "Zoom" },
];

const EFFECTS = [
  { id: "none" as EffectType, label: "None" },
  { id: "bright" as EffectType, label: "Bright" },
  { id: "vintage" as EffectType, label: "Vintage" },
  { id: "cool" as EffectType, label: "Cool" },
  { id: "warm" as EffectType, label: "Warm" },
  { id: "grayscale" as EffectType, label: "B&W" },
  { id: "contrast" as EffectType, label: "Contrast" },
  { id: "soft" as EffectType, label: "Soft" },
];

function generateAITemplate(prompt: string): ThemeTemplate {
  const lower = prompt.toLowerCase();
  if (lower.includes("gym") || lower.includes("fitness") || lower.includes("workout")) {
    return { id: "ai-fitness", name: "AI Fitness", emoji: "🤖", description: "Generated", backgroundColor: "#111827", texts: [
      { text: "NO DAYS OFF", x: 50, y: 30, fontSize: 40, color: "#22c55e", fontWeight: "bold" },
      { text: prompt.slice(0, 40) || "Train harder", x: 50, y: 52, fontSize: 26, color: "#ffffff", fontWeight: "bold" },
      { text: "Follow for more tips", x: 50, y: 75, fontSize: 20, color: "#86efac", fontWeight: "normal" },
    ]};
  }
  if (lower.includes("money") || lower.includes("business") || lower.includes("rich")) {
    return { id: "ai-business", name: "AI Business", emoji: "🤖", description: "Generated", backgroundColor: "#0c0a09", texts: [
      { text: "THE REAL SECRET", x: 50, y: 28, fontSize: 24, color: "#f59e0b", fontWeight: "bold" },
      { text: prompt.slice(0, 35) || "Make money online", x: 50, y: 48, fontSize: 32, color: "#fafaf9", fontWeight: "bold" },
      { text: "Watch till the end", x: 50, y: 72, fontSize: 20, color: "#a8a29e", fontWeight: "normal" },
    ]};
  }
  return { id: "ai-custom", name: "AI Custom", emoji: "🤖", description: "Generated", backgroundColor: "#0f0f0f", texts: [
    { text: "LISTEN UP", x: 50, y: 26, fontSize: 28, color: "#fbbf24", fontWeight: "bold" },
    { text: prompt.slice(0, 40) || "Your message here", x: 50, y: 48, fontSize: 34, color: "#ffffff", fontWeight: "bold" },
    { text: "Comment if you agree", x: 50, y: 75, fontSize: 20, color: "#a3a3a3", fontWeight: "normal" },
  ]};
}

const DEFAULT_PROJECT: Project = {
  media: [],
  texts: [],
  backgroundColor: "#000000",
  secondsPerSlide: 3,
  transition: "fade",
  effect: "none",
};

export default function Home() {
  const [project, setProject] = useState<Project>(DEFAULT_PROJECT);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<"themes" | "media" | "text" | "effects">("themes");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [transitionProgress, setTransitionProgress] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  useEffect(() => {
    project.media.forEach((m) => {
      if (m.type === "image" && !imageCache.current.has(m.url)) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = m.url;
        imageCache.current.set(m.url, img);
      }
    });
  }, [project.media]);

  const applyTheme = (theme: ThemeTemplate) => {
    const texts = theme.texts.map((t) => ({ ...t, id: crypto.randomUUID() }));
    setProject((prev) => ({ ...prev, backgroundColor: theme.backgroundColor, texts, themeName: theme.name }));
    setSelectedTextId(texts[0]?.id || null);
    setActiveTab("text");
  };

  const handleAIGenerate = () => {
    if (!aiPrompt.trim()) return;
    applyTheme(generateAITemplate(aiPrompt.trim()));
    setAiPrompt("");
  };

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      setProject((prev) => ({
        ...prev,
        media: [...prev.media, { id: crypto.randomUUID(), type: "image", url, name: file.name }],
      }));
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
    setActiveTab("media");
  }, []);

  const addText = () => {
    const newText: TextOverlay = { id: crypto.randomUUID(), text: "New text", x: 50, y: 50, fontSize: 36, color: "#ffffff", fontWeight: "bold" };
    setProject((prev) => ({ ...prev, texts: [...prev.texts, newText] }));
    setSelectedTextId(newText.id);
  };

  const updateText = (id: string, updates: Partial<TextOverlay>) => {
    setProject((prev) => ({ ...prev, texts: prev.texts.map((t) => (t.id === id ? { ...t, ...updates } : t)) }));
  };

  const removeMedia = (id: string) => setProject((prev) => ({ ...prev, media: prev.media.filter((m) => m.id !== id) }));
  const removeText = (id: string) => {
    setProject((prev) => ({ ...prev, texts: prev.texts.filter((t) => t.id !== id) }));
    if (selectedTextId === id) setSelectedTextId(null);
  };

  const applyEffect = (ctx: CanvasRenderingContext2D, effect: EffectType) => {
    const map: Record<EffectType, string> = {
      none: "none",
      bright: "brightness(1.25) contrast(1.05)",
      vintage: "sepia(0.45) contrast(1.1) brightness(0.95)",
      cool: "hue-rotate(190deg) saturate(1.2) brightness(1.05)",
      warm: "sepia(0.25) saturate(1.3) brightness(1.05)",
      grayscale: "grayscale(1) contrast(1.1)",
      contrast: "contrast(1.4) brightness(1.05)",
      soft: "blur(1.5px) brightness(1.05)",
    };
    ctx.filter = map[effect] || "none";
  };

  const drawImageCover = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, cw: number, ch: number, scaleExtra = 1, ox = 0, oy = 0) => {
    const scale = Math.max(cw / img.width, ch / img.height) * scaleExtra;
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, (cw - w) / 2 + ox, (ch - h) / 2 + oy, w, h);
  };

  const drawFrame = useCallback((slideIndex?: number, progress = 1) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const idx = slideIndex ?? currentSlideIndex;
    const n = Math.max(project.media.length, 1);
    const prevIdx = (idx - 1 + n) % n;

    ctx.fillStyle = project.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (project.media.length === 0) {
      ctx.fillStyle = "#52525b";
      ctx.font = "20px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Choose a theme or upload media", canvas.width / 2, canvas.height / 2 - 10);
      ctx.font = "16px system-ui";
      ctx.fillStyle = "#71717a";
      ctx.fillText("to start creating", canvas.width / 2, canvas.height / 2 + 20);
      return;
    }

    const getImg = (url: string) => imageCache.current.get(url);
    const currentMedia = project.media[idx % n];
    const prevMedia = project.media[prevIdx % n];
    const t = project.transition;
    const p = progress;

    ctx.save();
    applyEffect(ctx, project.effect);

    if (t === "none" || p >= 1) {
      const img = getImg(currentMedia.url);
      if (img?.complete) drawImageCover(ctx, img, canvas.width, canvas.height);
    } else if (t === "fade") {
      const prevImg = getImg(prevMedia.url);
      if (prevImg?.complete) { ctx.globalAlpha = 1 - p; drawImageCover(ctx, prevImg, canvas.width, canvas.height); }
      const currImg = getImg(currentMedia.url);
      if (currImg?.complete) { ctx.globalAlpha = p; drawImageCover(ctx, currImg, canvas.width, canvas.height); }
      ctx.globalAlpha = 1;
    } else if (t === "slide") {
      const prevImg = getImg(prevMedia.url);
      const currImg = getImg(currentMedia.url);
      if (prevImg?.complete) drawImageCover(ctx, prevImg, canvas.width, canvas.height, 1, -canvas.width * p, 0);
      if (currImg?.complete) drawImageCover(ctx, currImg, canvas.width, canvas.height, 1, canvas.width * (1 - p), 0);
    } else if (t === "zoom") {
      const prevImg = getImg(prevMedia.url);
      const currImg = getImg(currentMedia.url);
      if (prevImg?.complete) { ctx.globalAlpha = 1 - p; drawImageCover(ctx, prevImg, canvas.width, canvas.height, 1 + p * 0.3); }
      if (currImg?.complete) { ctx.globalAlpha = p; drawImageCover(ctx, currImg, canvas.width, canvas.height, 0.85 + p * 0.15); }
      ctx.globalAlpha = 1;
    }

    ctx.restore();
    ctx.filter = "none";

    project.texts.forEach((txt) => {
      ctx.font = `${txt.fontWeight} ${txt.fontSize}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = txt.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.75)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillText(txt.text, (txt.x / 100) * canvas.width, (txt.y / 100) * canvas.height);
      ctx.shadowColor = "transparent";
    });
  }, [project, currentSlideIndex]);

  useEffect(() => { drawFrame(currentSlideIndex, transitionProgress); }, [drawFrame, currentSlideIndex, transitionProgress]);

  useEffect(() => {
    if (isPlaying && project.media.length > 0) {
      playIntervalRef.current = setInterval(() => {
        const transitionMs = project.transition === "none" ? 0 : 550;
        setTransitionProgress(0);
        const start = performance.now();
        const animate = (now: number) => {
          const elapsed = now - start;
          const p = Math.min(1, elapsed / Math.max(transitionMs, 1));
          setTransitionProgress(p);
          if (p < 1) requestAnimationFrame(animate);
          else {
            setCurrentSlideIndex((prev) => (prev + 1) % project.media.length);
            setTransitionProgress(1);
          }
        };
        if (transitionMs > 0) requestAnimationFrame(animate);
        else {
          setCurrentSlideIndex((prev) => (prev + 1) % project.media.length);
          setTransitionProgress(1);
        }
      }, project.secondsPerSlide * 1000);
    } else if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
    return () => { if (playIntervalRef.current) clearInterval(playIntervalRef.current); };
  }, [isPlaying, project.media.length, project.secondsPerSlide, project.transition]);

  const togglePlay = () => { if (project.media.length === 0) return; setIsPlaying((p) => !p); };
  const stopPlayback = () => { setIsPlaying(false); setCurrentSlideIndex(0); setTransitionProgress(1); };

  const handleExport = async () => {
    setExporting(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      drawFrame(currentSlideIndex, 1);
      await new Promise((r) => setTimeout(r, 150));
      const link = document.createElement("a");
      link.download = `reel-${project.themeName || "custom"}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally { setExporting(false); }
  };

  const selectedText = project.texts.find((t) => t.id === selectedTextId);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-violet-900/40">RF</div>
          <div>
            <h1 className="font-semibold text-lg leading-tight tracking-tight">ReelForge</h1>
            <p className="text-[11px] text-zinc-400">AI • Effects • Transitions</p>
          </div>
        </div>
        <button onClick={handleExport} disabled={exporting} className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-sm font-medium transition shadow-lg shadow-violet-900/30">
          {exporting ? "Exporting…" : "Export PNG"}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 border-r border-zinc-800 bg-zinc-900 flex flex-col shrink-0">
          <div className="flex border-b border-zinc-800 text-[11px]">
            {(["themes", "media", "text", "effects"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2.5 font-medium capitalize transition ${activeTab === tab ? "text-violet-400 border-b-2 border-violet-500 bg-violet-500/5" : "text-zinc-500 hover:text-zinc-300"}`}>
                {tab === "themes" ? "AI" : tab === "effects" ? "FX" : tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto panel-scroll p-3">
            {activeTab === "themes" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-3 space-y-2">
                  <p className="text-xs font-medium text-violet-300">✨ AI Generate</p>
                  <input type="text" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAIGenerate()} placeholder="e.g. gym motivation..." className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 placeholder:text-zinc-600" />
                  <button onClick={handleAIGenerate} disabled={!aiPrompt.trim()} className="w-full py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-sm font-medium transition">Generate</button>
                </div>
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium">Themes</p>
                <div className="grid grid-cols-2 gap-2">
                  {THEMES.map((theme) => (
                    <button key={theme.id} onClick={() => applyTheme(theme)} className="group text-left p-3 rounded-xl border border-zinc-700 hover:border-violet-500/60 hover:bg-zinc-800/80 transition">
                      <div className="text-2xl mb-1">{theme.emoji}</div>
                      <div className="text-sm font-medium text-zinc-200 group-hover:text-white">{theme.name}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{theme.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "media" && (
              <div className="space-y-3">
                <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 rounded-xl border border-dashed border-zinc-600 hover:border-violet-500 hover:bg-zinc-800/50 text-sm transition">+ Upload images</button>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} />
                {project.media.length === 0 ? (
                  <p className="text-xs text-zinc-500 text-center mt-10">Upload photos to create a slideshow reel.</p>
                ) : (
                  <>
                    <p className="text-[11px] text-zinc-500">{project.media.length} slides · {project.secondsPerSlide}s each</p>
                    {project.media.map((m, i) => (
                      <div key={m.id} className={`group relative rounded-xl overflow-hidden bg-zinc-800 border transition ${currentSlideIndex === i ? "border-violet-500 ring-1 ring-violet-500/50" : "border-zinc-700"}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={m.url} alt={m.name} className="w-full h-24 object-cover" />
                        <div className="absolute top-1.5 left-1.5 bg-black/70 text-[10px] px-1.5 py-0.5 rounded">{i + 1}</div>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                          <button onClick={() => { setCurrentSlideIndex(i); setIsPlaying(false); setTransitionProgress(1); }} className="px-2 py-1 bg-violet-600 rounded text-xs">View</button>
                          <button onClick={() => removeMedia(m.id)} className="px-2 py-1 bg-red-600 rounded text-xs">Remove</button>
                        </div>
                        <p className="text-[10px] text-zinc-400 truncate px-2 py-1">{m.name}</p>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-zinc-800">
                      <label className="text-[11px] text-zinc-400 block mb-1">Seconds per photo</label>
                      <input type="number" min={1} max={10} value={project.secondsPerSlide} onChange={(e) => setProject((p) => ({ ...p, secondsPerSlide: Math.max(1, Number(e.target.value) || 3) }))} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500" />
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === "text" && (
              <div className="space-y-3">
                <button onClick={addText} className="w-full py-2 rounded-lg bg-violet-600/20 text-violet-400 hover:bg-violet-600/30 text-sm font-medium transition">+ Add text overlay</button>
                {project.texts.length === 0 && <p className="text-xs text-zinc-500 text-center mt-8">No text yet.<br />Apply a theme or add your own.</p>}
                {project.texts.map((t) => (
                  <div key={t.id} onClick={() => setSelectedTextId(t.id)} className={`p-3 rounded-xl border cursor-pointer transition ${selectedTextId === t.id ? "border-violet-500 bg-violet-500/10" : "border-zinc-700 hover:border-zinc-600"}`}>
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-sm font-medium truncate">{t.text || "Empty"}</p>
                      <button onClick={(e) => { e.stopPropagation(); removeText(t.id); }} className="text-zinc-500 hover:text-red-400 text-xs shrink-0">✕</button>
                    </div>
                  </div>
                ))}
                {selectedText && (
                  <div className="space-y-3 pt-3 border-t border-zinc-800">
                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">Text</label>
                      <input type="text" value={selectedText.text} onChange={(e) => updateText(selectedText.id, { text: e.target.value })} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Size</label>
                        <input type="number" min={14} max={90} value={selectedText.fontSize} onChange={(e) => updateText(selectedText.id, { fontSize: Number(e.target.value) })} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500" />
                      </div>
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Color</label>
                        <input type="color" value={selectedText.color} onChange={(e) => updateText(selectedText.id, { color: e.target.value })} className="w-full h-9 bg-zinc-800 border border-zinc-700 rounded-lg cursor-pointer" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">X %</label>
                        <input type="range" min={5} max={95} value={selectedText.x} onChange={(e) => updateText(selectedText.id, { x: Number(e.target.value) })} className="w-full accent-violet-500" />
                      </div>
                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Y %</label>
                        <input type="range" min={5} max={95} value={selectedText.y} onChange={(e) => updateText(selectedText.id, { y: Number(e.target.value) })} className="w-full accent-violet-500" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">Weight</label>
                      <select value={selectedText.fontWeight} onChange={(e) => updateText(selectedText.id, { fontWeight: e.target.value as "normal" | "bold" })} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500">
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "effects" && (
              <div className="space-y-5">
                <div>
                  <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium mb-2">Transitions</p>
                  <div className="grid grid-cols-2 gap-2">
                    {TRANSITIONS.map((tr) => (
                      <button key={tr.id} onClick={() => setProject((p) => ({ ...p, transition: tr.id }))} className={`py-2.5 px-2 rounded-lg text-xs font-medium border transition ${project.transition === tr.id ? "border-violet-500 bg-violet-500/20 text-violet-300" : "border-zinc-700 hover:border-zinc-500 text-zinc-300"}`}>
                        {tr.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium mb-2">Visual Effects</p>
                  <div className="grid grid-cols-2 gap-2">
                    {EFFECTS.map((fx) => (
                      <button key={fx.id} onClick={() => setProject((p) => ({ ...p, effect: fx.id }))} className={`py-2.5 px-2 rounded-lg text-xs font-medium border transition ${project.effect === fx.id ? "border-violet-500 bg-violet-500/20 text-violet-300" : "border-zinc-700 hover:border-zinc-500 text-zinc-300"}`}>
                        {fx.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg bg-zinc-800/60 border border-zinc-700 p-3 text-[11px] text-zinc-400 leading-relaxed">
                  Try <strong>Fade + Vintage</strong> or <strong>Zoom + Cool</strong>. Effects apply live while playing.
                </div>
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 flex flex-col items-center justify-center bg-zinc-950 p-6 relative min-w-0">
          <div className="relative shadow-2xl rounded-2xl overflow-hidden border border-zinc-800 ring-1 ring-white/5">
            <canvas ref={canvasRef} width={360} height={640} className="bg-black block max-h-[62vh] w-auto" />
          </div>
          <div className="mt-5 flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <button onClick={stopPlayback} className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-lg transition">⏹</button>
              <button onClick={togglePlay} disabled={project.media.length === 0} className="w-14 h-14 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-2xl transition shadow-lg shadow-violet-900/40">
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button onClick={() => { if (project.media.length === 0) return; setCurrentSlideIndex((i) => (i + 1) % project.media.length); setIsPlaying(false); setTransitionProgress(1); }} className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-lg transition">⏭</button>
            </div>
            <div className="text-xs text-zinc-400 font-mono text-center">
              {project.media.length > 0 ? (
                <>Slide {currentSlideIndex + 1}/{project.media.length} · {project.secondsPerSlide}s · <span className="text-violet-400">{project.transition}</span> · <span className="text-violet-400">{project.effect}</span></>
              ) : "Upload photos to enable playback"}
            </div>
            {project.media.length > 1 && (
              <div className="flex gap-1.5">
                {project.media.map((_, i) => (
                  <button key={i} onClick={() => { setCurrentSlideIndex(i); setIsPlaying(false); setTransitionProgress(1); }} className={`w-2 h-2 rounded-full transition ${i === currentSlideIndex ? "bg-violet-500" : "bg-zinc-600 hover:bg-zinc-500"}`} />
                ))}
              </div>
            )}
          </div>
        </main>

        <aside className="hidden xl:flex w-56 border-l border-zinc-800 bg-zinc-900/50 flex-col p-4 text-xs text-zinc-400 shrink-0">
          <p className="font-medium text-zinc-300 mb-3">CapCut-style features</p>
          <ul className="space-y-2 list-disc list-inside">
            <li>Transitions (Fade / Slide / Zoom)</li>
            <li>Visual effects & filters</li>
            <li>AI theme templates</li>
            <li>Multi-image slideshow</li>
            <li>Text overlays</li>
          </ul>
          <div className="mt-6 p-3 rounded-lg bg-zinc-800/60 border border-zinc-700">
            <p className="text-[11px] leading-relaxed">Go to the <span className="text-violet-400">FX</span> tab, pick a transition + effect, then press Play.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
