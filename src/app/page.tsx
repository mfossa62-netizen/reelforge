"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type MediaItem = {
  id: string;
  type: "image" | "video";
  url: string;
  name: string;
  duration?: number;
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
  duration: number; // seconds
  backgroundColor: string;
};

const DEFAULT_PROJECT: Project = {
  media: [],
  texts: [],
  duration: 15,
  backgroundColor: "#000000",
};

export default function Home() {
  const [project, setProject] = useState<Project>(DEFAULT_PROJECT);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [exporting, setExporting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const animationRef = useRef<number | null>(null);

  // Add media from file upload
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith("video") ? "video" : "image";
      const item: MediaItem = {
        id: crypto.randomUUID(),
        type,
        url,
        name: file.name,
      };
      setProject((prev) => ({
        ...prev,
        media: [...prev.media, item],
      }));
    });

    // reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  // Add text overlay
  const addText = () => {
    const newText: TextOverlay = {
      id: crypto.randomUUID(),
      text: "Your text here",
      x: 50,
      y: 50,
      fontSize: 48,
      color: "#ffffff",
      fontWeight: "bold",
    };
    setProject((prev) => ({
      ...prev,
      texts: [...prev.texts, newText],
    }));
    setSelectedTextId(newText.id);
  };

  // Update selected text
  const updateText = (id: string, updates: Partial<TextOverlay>) => {
    setProject((prev) => ({
      ...prev,
      texts: prev.texts.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  };

  // Remove media or text
  const removeMedia = (id: string) => {
    setProject((prev) => ({
      ...prev,
      media: prev.media.filter((m) => m.id !== id),
    }));
  };

  const removeText = (id: string) => {
    setProject((prev) => ({
      ...prev,
      texts: prev.texts.filter((t) => t.id !== id),
    }));
    if (selectedTextId === id) setSelectedTextId(null);
  };

  // Simple canvas renderer for preview
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear
    ctx.fillStyle = project.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw first media item (MVP: single clip for now)
    if (project.media.length > 0) {
      const media = project.media[0];
      // For images we can draw immediately; videos need more work
      if (media.type === "image") {
        const img = new Image();
        img.src = media.url;
        img.onload = () => {
          // Cover the 9:16 canvas
          const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
          const w = img.width * scale;
          const h = img.height * scale;
          const x = (canvas.width - w) / 2;
          const y = (canvas.height - h) / 2;
          ctx.drawImage(img, x, y, w, h);

          // Draw texts on top
          project.texts.forEach((t) => {
            ctx.font = `${t.fontWeight} ${t.fontSize}px system-ui, sans-serif`;
            ctx.fillStyle = t.color;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            // Simple drop shadow
            ctx.shadowColor = "rgba(0,0,0,0.7)";
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.fillText(t.text, (t.x / 100) * canvas.width, (t.y / 100) * canvas.height);
            ctx.shadowColor = "transparent";
          });
        };
      }
    } else {
      // Placeholder
      ctx.fillStyle = "#27272a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#71717a";
      ctx.font = "24px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("Upload media to start", canvas.width / 2, canvas.height / 2);
    }
  }, [project]);

  useEffect(() => {
    drawFrame();
  }, [drawFrame, project]);

  // Export as image sequence / simple download for now
  // Full MP4 export will use MediaRecorder or FFmpeg.wasm in next iteration
  const handleExport = async () => {
    setExporting(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // For MVP: export current frame as high-quality PNG (or we can expand to video)
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `reel-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      // TODO: Real video export coming next
      alert("Frame exported! Full MP4 video export will be added in the next update.");
    } finally {
      setExporting(false);
    }
  };

  const selectedText = project.texts.find((t) => t.id === selectedTextId);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center font-bold text-sm">
            RF
          </div>
          <div>
            <h1 className="font-semibold text-lg leading-tight">ReelForge</h1>
            <p className="text-xs text-zinc-400">Create & share short videos</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={exporting || project.media.length === 0}
            className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium transition"
          >
            {exporting ? "Exporting\u2026" : "Export"}
          </button>
          <button
            className="px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 text-sm font-medium transition"
            title="Coming soon \u2014 connect your accounts"
          >
            Share
          </button>
        </div>
      </header>

      {/* Main workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel \u2014 Media */}
        <aside className="w-64 border-r border-zinc-800 bg-zinc-900 flex flex-col">
          <div className="p-3 border-b border-zinc-800">
            <h2 className="text-sm font-medium text-zinc-300 mb-2">Media</h2>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 rounded-lg border border-dashed border-zinc-600 hover:border-violet-500 hover:bg-zinc-800/50 text-sm transition"
            >
              + Upload image or video
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          <div className="flex-1 overflow-y-auto panel-scroll p-3 space-y-2">
            {project.media.length === 0 && (
              <p className="text-xs text-zinc-500 text-center mt-8">
                No media yet.<br />Upload to begin.
              </p>
            )}
            {project.media.map((m) => (
              <div
                key={m.id}
                className="group relative rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700"
              >
                {m.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt={m.name} className="w-full h-24 object-cover" />
                ) : (
                  <div className="w-full h-24 flex items-center justify-center text-zinc-500 text-xs">
                    Video
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <button
                    onClick={() => removeMedia(m.id)}
                    className="px-2 py-1 bg-red-600 rounded text-xs"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-[10px] text-zinc-400 truncate px-1.5 py-1">{m.name}</p>
              </div>
            ))}
          </div>
        </aside>

        {/* Center \u2014 Preview */}
        <main className="flex-1 flex flex-col items-center justify-center bg-zinc-950 p-6 relative">
          <div className="relative shadow-2xl rounded-2xl overflow-hidden border border-zinc-800">
            <canvas
              ref={canvasRef}
              width={360}
              height={640}
              className="bg-black block max-h-[70vh] w-auto"
            />
          </div>

          {/* Simple transport controls */}
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center"
            >
              {isPlaying ? "\u23F8" : "\u25B6"}
            </button>
            <div className="text-xs text-zinc-400 font-mono">
              {Math.floor(currentTime)}s / {project.duration}s
            </div>
          </div>
        </main>

        {/* Right panel \u2014 Text & Settings */}
        <aside className="w-72 border-l border-zinc-800 bg-zinc-900 flex flex-col">
          <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-sm font-medium text-zinc-300">Text & Style</h2>
            <button
              onClick={addText}
              className="text-xs px-2 py-1 rounded bg-violet-600/20 text-violet-400 hover:bg-violet-600/30 transition"
            >
              + Add text
            </button>
          </div>

          <div className="flex-1 overflow-y-auto panel-scroll p-3 space-y-4">
            {project.texts.length === 0 && (
              <p className="text-xs text-zinc-500 text-center mt-6">
                No text overlays yet.
              </p>
            )}

            {project.texts.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTextId(t.id)}
                className={`p-3 rounded-lg border cursor-pointer transition ${
                  selectedTextId === t.id
                    ? "border-violet-500 bg-violet-500/10"
                    : "border-zinc-700 hover:border-zinc-600"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium truncate">{t.text || "Empty"}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeText(t.id);
                    }}
                    className="text-zinc-500 hover:text-red-400 text-xs"
                  >
                    \u2715
                  </button>
                </div>
              </div>
            ))}

            {selectedText && (
              <div className="space-y-3 pt-2 border-t border-zinc-800">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Text</label>
                  <input
                    type="text"
                    value={selectedText.text}
                    onChange={(e) => updateText(selectedText.id, { text: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Size</label>
                    <input
                      type="number"
                      min={12}
                      max={120}
                      value={selectedText.fontSize}
                      onChange={(e) =>
                        updateText(selectedText.id, { fontSize: Number(e.target.value) })
                      }
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Color</label>
                    <input
                      type="color"
                      value={selectedText.color}
                      onChange={(e) => updateText(selectedText.id, { color: e.target.value })}
                      className="w-full h-9 bg-zinc-800 border border-zinc-700 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">X position %</label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={selectedText.x}
                      onChange={(e) =>
                        updateText(selectedText.id, { x: Number(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1">Y position %</label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={selectedText.y}
                      onChange={(e) =>
                        updateText(selectedText.id, { y: Number(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Weight</label>
                  <select
                    value={selectedText.fontWeight}
                    onChange={(e) =>
                      updateText(selectedText.id, {
                        fontWeight: e.target.value as "normal" | "bold",
                      })
                    }
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                  </select>
                </div>
              </div>
            )}

            {/* Duration */}
            <div className="pt-4 border-t border-zinc-800">
              <label className="text-xs text-zinc-400 block mb-1">
                Reel duration (seconds)
              </label>
              <input
                type="number"
                min={3}
                max={90}
                value={project.duration}
                onChange={(e) =>
                  setProject((p) => ({ ...p, duration: Number(e.target.value) }))
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </aside>
      </div>

      {/* Footer status */}
      <footer className="px-4 py-2 border-t border-zinc-800 bg-zinc-900 text-xs text-zinc-500 flex justify-between">
        <span>Ready for Vercel deployment</span>
        <span>MVP v0.1 \u2014 full video export & social posting coming next</span>
      </footer>
    </div>
  );
}
