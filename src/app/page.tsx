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

type Project = {
  media: MediaItem[];
  texts: TextOverlay[];
  duration: number;
  backgroundColor: string;
  themeName?: string;
  secondsPerSlide: number;
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
  {
    id: "motivation",
    name: "Motivation",
    emoji: "🔥",
    description: "Bold hooks & energy",
    backgroundColor: "#0f0f0f",
    texts: [
      { text: "STOP SCROLLING", x: 50, y: 28, fontSize: 42, color: "#ffffff", fontWeight: "bold" },
      { text: "This changes everything", x: 50, y: 48, fontSize: 28, color: "#fbbf24", fontWeight: "bold" },
      { text: "Save this for later 👇", x: 50, y: 78, fontSize: 22, color: "#a3a3a3", fontWeight: "normal" },
    ],
  },
  {
    id: "fitness",
    name: "Fitness",
    emoji: "💪",
    description: "Gym & transformation",
    backgroundColor: "#111827",
    texts: [
      { text: "DAY 47", x: 50, y: 22, fontSize: 56, color: "#22c55e", fontWeight: "bold" },
      { text: "No excuses.", x: 50, y: 42, fontSize: 36, color: "#ffffff", fontWeight: "bold" },
      { text: "Just results.", x: 50, y: 58, fontSize: 32, color: "#86efac", fontWeight: "normal" },
    ],
  },
  {
    id: "business",
    name: "Business",
    emoji: "💼",
    description: "Clean & professional",
    backgroundColor: "#0c0a09",
    texts: [
      { text: "THE TRUTH ABOUT", x: 50, y: 30, fontSize: 26, color: "#a8a29e", fontWeight: "normal" },
      { text: "Building Wealth", x: 50, y: 48, fontSize: 40, color: "#fafaf9", fontWeight: "bold" },
      { text: "in 2026", x: 50, y: 65, fontSize: 28, color: "#f59e0b", fontWeight: "bold" },
    ],
  },
  {
    id: "travel",
    name: "Travel",
    emoji: "✈️",
    description: "Wanderlust vibes",
    backgroundColor: "#0c4a6e",
    texts: [
      { text: "Hidden gem ✨", x: 50, y: 25, fontSize: 28, color: "#7dd3fc", fontWeight: "normal" },
      { text: "You need to visit", x: 50, y: 45, fontSize: 36, color: "#ffffff", fontWeight: "bold" },
      { text: "this place", x: 50, y: 62, fontSize: 34, color: "#e0f2fe", fontWeight: "bold" },
    ],
  },
  {
    id: "food",
    name: "Food",
    emoji: "🍕",
    description: "Tasty & colorful",
    backgroundColor: "#7c2d12",
    texts: [
      { text: "Recipe in 30 seconds", x: 50, y: 28, fontSize: 26, color: "#fdba74", fontWeight: "normal" },
      { text: "You will CRY", x: 50, y: 48, fontSize: 42, color: "#ffffff", fontWeight: "bold" },
      { text: "when you try this", x: 50, y: 68, fontSize: 28, color: "#fed7aa", fontWeight: "normal" },
    ],
  },
  {
    id: "fashion",
    name: "Fashion",
    emoji: "👗",
    description: "Style & aesthetic",
    backgroundColor: "#1e1b4b",
    texts: [
      { text: "OUTFIT OF THE DAY", x: 50, y: 25, fontSize: 22, color: "#c4b5fd", fontWeight: "normal" },
      { text: "Steal this look", x: 50, y: 45, fontSize: 38, color: "#ffffff", fontWeight: "bold" },
      { text: "Link in bio 🔗", x: 50, y: 72, fontSize: 24, color: "#a78bfa", fontWeight: "normal" },
    ],
  },
  {
    id: "neon",
    name: "Neon",
    emoji: "💜",
    description: "Cyber & vibrant",
    backgroundColor: "#0f0518",
    texts: [
      { text: "NIGHT MODE", x: 50, y: 30, fontSize: 32, color: "#e879f9", fontWeight: "bold" },
      { text: "ON", x: 50, y: 50, fontSize: 64, color: "#22d3ee", fontWeight: "bold" },
      { text: "Stay until the end", x: 50, y: 75, fontSize: 22, color: "#c026d3", fontWeight: "normal" },
    ],
  },
  {
    id: "minimal",
    name: "Minimal",
    emoji: "✨",
    description: "Clean & simple",
    backgroundColor: "#fafafa",
    texts: [
      { text: "less is more", x: 50, y: 42, fontSize: 36, color: "#171717", fontWeight: "normal" },
      { text: "—", x: 50, y: 55, fontSize: 28, color: "#a3a3a3", fontWeight: "normal" },
      { text: "keep it simple", x: 50, y: 68, fontSize: 22, color: "#525252", fontWeight: "normal" },
    ],
  },
];

function generateAITemplate(prompt: string): ThemeTemplate {
  const lower = prompt.toLowerCase();
  if (lower.includes("gym") || lower.includes("fitness") || lower.includes("workout") || lower.includes("muscle")) {
    return {
      id: "ai-fitness",
      name: "AI Fitness",
      emoji: "🤖",
      description: "Generated from your prompt",
      backgroundColor: "#111827",
      texts: [
        { text: "NO DAYS OFF", x: 50, y: 30, fontSize: 40, color: "#22c55e", fontWeight: "bold" },
        { text: prompt.slice(0, 40) || "Train harder", x: 50, y: 52, fontSize: 26, color: "#ffffff", fontWeight: "bold" },
        { text: "Follow for more tips", x: 50, y: 75, fontSize: 20, color: "#86efac", fontWeight: "normal" },
      ],
    };
  }
  if (lower.includes("money") || lower.includes("business") || lower.includes("rich") || lower.includes("hustle")) {
    return {
      id: "ai-business",
      name: "AI Business",
      emoji: "🤖",
      description: "Generated from your prompt",
      backgroundColor: "#0c0a09",
      texts: [
        { text: "THE REAL SECRET", x: 50, y: 28, fontSize: 24, color: "#f59e0b", fontWeight: "bold" },
        { text: prompt.slice(0, 35) || "Make money online", x: 50, y: 48, fontSize: 32, color: "#fafaf9", fontWeight: "bold" },
        { text: "Watch till the end", x: 50, y: 72, fontSize: 20, color: "#a8a29e", fontWeight: "normal" },
      ],
    };
  }
  if (lower.includes("travel") || lower.includes("trip") || lower.includes("vacation") || lower.includes("beach")) {
    return {
      id: "ai-travel",
      name: "AI Travel",
      emoji: "🤖",
      description: "Generated from your prompt",
      backgroundColor: "#0c4a6e",
      texts: [
        { text: "You need to see this", x: 50, y: 28, fontSize: 26, color: "#7dd3fc", fontWeight: "normal" },
        { text: prompt.slice(0, 30) || "Dream destination", x: 50, y: 50, fontSize: 34, color: "#ffffff", fontWeight: "bold" },
        { text: "Save for later ✈️", x: 50, y: 75, fontSize: 22, color: "#bae6fd", fontWeight: "normal" },
      ],
    };
  }
  return {
    id: "ai-custom",
    name: "AI Custom",
    emoji: "🤖",
    description: "Generated from your prompt",
    backgroundColor: "#0f0f0f",
    texts: [
      { text: "LISTEN UP", x: 50, y: 26, fontSize: 28, color: "#fbbf24", fontWeight: "bold" },
      { text: prompt.slice(0, 40) || "Your message here", x: 50, y: 48, fontSize: 34, color: "#ffffff", fontWeight: "bold" },
      { text: "Comment if you agree", x: 50, y: 75, fontSize: 20, color: "#a3a3a3", fontWeight: "normal" },
    ],
  };
}

const DEFAULT_PROJECT: Project = {
  media: [],
  texts: [],
  duration: 15,
  backgroundColor: "#000000",
  secondsPerSlide: 3,
};

export default function Home() {
  const [project, setProject] = useState<Project>(DEFAULT_PROJECT);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<"themes" | "media" | "text">("themes");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  const totalDuration = project.media.length > 0 ? project.media.length * project.secondsPerSlide : project.duration;

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
    const texts: TextOverlay[] = theme.texts.map((t) => ({ ...t, id: crypto.randomUUID() }));
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
      const type = file.type.startsWith("video") ? "video" : "image";
      setProject((prev) => ({
        ...prev,
        media: [...prev.media, { id: crypto.randomUUID(), type, url, name: file.name }],
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

  const drawFrame = useCallback((slideIndex?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const idx = slideIndex ?? currentSlideIndex;
    ctx.fillStyle = project.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (project.media.length > 0) {
      const media = project.media[idx % project.media.length];
      if (media.type === "image") {
        const img = imageCache.current.get(media.url);
        if (img && img.complete) {
          const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
          const w = img.width * scale;
          const h = img.height * scale;
          ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
        } else {
          const tempImg = new Image();
          tempImg.crossOrigin = "anonymous";
          tempImg.src = media.url;
          tempImg.onload = () => {
            imageCache.current.set(media.url, tempImg);
            drawFrame(idx);
          };
        }
      }
    }
    project.texts.forEach((t) => {
      ctx.font = `${t.fontWeight} ${t.fontSize}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = t.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.75)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillText(t.text, (t.x / 100) * canvas.width, (t.y / 100) * canvas.height);
      ctx.shadowColor = "transparent";
    });
    if (project.texts.length === 0 && project.media.length === 0) {
      ctx.fillStyle = "#52525b";
      ctx.font = "20px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Choose a theme or upload media", canvas.width / 2, canvas.height / 2 - 10);
      ctx.font = "16px system-ui";
      ctx.fillStyle = "#71717a";
      ctx.fillText("to start creating", canvas.width / 2, canvas.height / 2 + 20);
    }
  }, [project, currentSlideIndex]);

  useEffect(() => { drawFrame(); }, [drawFrame, currentSlideIndex]);

  useEffect(() => {
    if (isPlaying && project.media.length > 0) {
      playIntervalRef.current = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % project.media.length);
      }, project.secondsPerSlide * 1000);
    } else if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
    return () => { if (playIntervalRef.current) clearInterval(playIntervalRef.current); };
  }, [isPlaying, project.media.length, project.secondsPerSlide]);

  const togglePlay = () => {
    if (project.media.length === 0) return;
    setIsPlaying((p) => !p);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    setCurrentSlideIndex(0);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      drawFrame(currentSlideIndex);
      await new Promise((r) => setTimeout(r, 150));
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `reel-${project.themeName || "custom"}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setExporting(false);
    }
  };

  const selectedText = project.texts.find((t) => t.id === selectedTextId);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-violet-900/40">RF</div>
          <div>
            <h1 className="font-semibold text-lg leading-tight tracking-tight">ReelForge</h1>
            <p className="text-[11px] text-zinc-400">AI templates • Create & share</p>
          </div>
        </div>
        <button onClick={handleExport} disabled={exporting} className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-sm font-medium transition shadow-lg shadow-violet-900/30">
          {exporting ? "Exporting…" : "Export PNG"}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 border-r border-zinc-800 bg-zinc-900 flex flex-col shrink-0">
          <div className="flex border-b border-zinc-800">
            {(["themes", "media", "text"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2.5 text-xs font-medium capitalize transition ${activeTab === tab ? "text-violet-400 border-b-2 border-violet-500 bg-violet-500/5" : "text-zinc-500 hover:text-zinc-300"}`}>
                {tab === "themes" ? "AI Themes" : tab}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto panel-scroll p-3">
            {activeTab === "themes" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-3 space-y-2">
                  <p className="text-xs font-medium text-violet-300">✨ AI Generate Template</p>
                  <input type="text" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAIGenerate()} placeholder="e.g. gym motivation, travel tip..." className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500 placeholder:text-zinc-600" />
                  <button onClick={handleAIGenerate} disabled={!aiPrompt.trim()} className="w-full py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-sm font-medium transition">Generate</button>
                </div>
                <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium pt-1">Ready-made themes</p>
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
                <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 rounded-xl border border-dashed border-zinc-600 hover:border-violet-500 hover:bg-zinc-800/50 text-sm transition">+ Upload image or video</button>
                <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleFileUpload} />
                {project.media.length === 0 ? (
                  <p className="text-xs text-zinc-500 text-center mt-10">No media yet.<br />Upload photos to create a slideshow reel.</p>
                ) : (
                  <>
                    <p className="text-[11px] text-zinc-500">{project.media.length} slides · {project.secondsPerSlide}s each</p>
                    {project.media.map((m, i) => (
                      <div key={m.id} className={`group relative rounded-xl overflow-hidden bg-zinc-800 border transition ${currentSlideIndex === i ? "border-violet-500 ring-1 ring-violet-500/50" : "border-zinc-700"}`}>
                        {m.type === "image" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={m.url} alt={m.name} className="w-full h-24 object-cover" />
                        ) : (
                          <div className="w-full h-24 flex items-center justify-center text-zinc-500 text-xs">Video</div>
                        )}
                        <div className="absolute top-1.5 left-1.5 bg-black/70 text-[10px] px-1.5 py-0.5 rounded">{i + 1}</div>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                          <button onClick={() => { setCurrentSlideIndex(i); setIsPlaying(false); }} className="px-2 py-1 bg-violet-600 rounded text-xs">View</button>
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
          </div>
        </aside>

        <main className="flex-1 flex flex-col items-center justify-center bg-zinc-950 p-6 relative min-w-0">
          <div className="relative shadow-2xl rounded-2xl overflow-hidden border border-zinc-800 ring-1 ring-white/5">
            <canvas ref={canvasRef} width={360} height={640} className="bg-black block max-h-[65vh] w-auto" />
          </div>
          <div className="mt-5 flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <button onClick={stopPlayback} className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-lg transition" title="Stop / Restart">⏹</button>
              <button onClick={togglePlay} disabled={project.media.length === 0} className="w-14 h-14 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-2xl transition shadow-lg shadow-violet-900/40" title={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button onClick={() => { if (project.media.length === 0) return; setCurrentSlideIndex((i) => (i + 1) % project.media.length); setIsPlaying(false); }} className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-lg transition" title="Next slide">⏭</button>
            </div>
            <div className="text-xs text-zinc-400 font-mono">
              {project.media.length > 0 ? (
                <>Slide {currentSlideIndex + 1} / {project.media.length} · {project.secondsPerSlide}s each · Total ~{totalDuration}s</>
              ) : (
                "Upload photos to enable playback"
              )}
            </div>
            {project.media.length > 1 && (
              <div className="flex gap-1.5 mt-1">
                {project.media.map((_, i) => (
                  <button key={i} onClick={() => { setCurrentSlideIndex(i); setIsPlaying(false); }} className={`w-2 h-2 rounded-full transition ${i === currentSlideIndex ? "bg-violet-500" : "bg-zinc-600 hover:bg-zinc-500"}`} />
                ))}
              </div>
            )}
          </div>
        </main>

        <aside className="hidden xl:flex w-56 border-l border-zinc-800 bg-zinc-900/50 flex-col p-4 text-xs text-zinc-400 shrink-0">
          <p className="font-medium text-zinc-300 mb-3">How to play</p>
          <ol className="space-y-3 list-decimal list-inside">
            <li>Upload several photos in the <span className="text-violet-400">Media</span> tab</li>
            <li>Apply a theme or add text</li>
            <li>Press the big <span className="text-violet-400">▶ Play</span> button</li>
            <li>It cycles through your photos automatically</li>
          </ol>
          <div className="mt-8 p-3 rounded-lg bg-zinc-800/60 border border-zinc-700">
            <p className="text-[11px] leading-relaxed">Change how long each photo stays in the Media tab (Seconds per photo).</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
