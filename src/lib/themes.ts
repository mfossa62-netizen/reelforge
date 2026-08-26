export type TextOverlay = { id: string; text: string; x: number; y: number; fontSize: number; color: string; fontWeight: "normal" | "bold" };
export type ThemeTemplate = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  backgroundColor: string;
  texts: Omit<TextOverlay, "id">[];
};

export const THEMES: ThemeTemplate[] = [
  { id: "motivation", name: "Motivation", emoji: "🔥", description: "Bold hooks & energy", backgroundColor: "#0f0f0f", texts: [
    { text: "STOP SCROLLING", x: 50, y: 28, fontSize: 42, color: "#ffffff", fontWeight: "bold" },
    { text: "This changes everything", x: 50, y: 48, fontSize: 28, color: "#fbbf24", fontWeight: "bold" },
    { text: "Save this for later", x: 50, y: 78, fontSize: 22, color: "#a3a3a3", fontWeight: "normal" },
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
    { text: "Hidden gem", x: 50, y: 25, fontSize: 28, color: "#7dd3fc", fontWeight: "normal" },
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
    { text: "Link in bio", x: 50, y: 72, fontSize: 24, color: "#a78bfa", fontWeight: "normal" },
  ]},
  { id: "neon", name: "Neon", emoji: "💜", description: "Cyber & vibrant", backgroundColor: "#0f0518", texts: [
    { text: "NIGHT MODE", x: 50, y: 30, fontSize: 32, color: "#e879f9", fontWeight: "bold" },
    { text: "ON", x: 50, y: 50, fontSize: 64, color: "#22d3ee", fontWeight: "bold" },
    { text: "Stay until the end", x: 50, y: 75, fontSize: 22, color: "#c026d3", fontWeight: "normal" },
  ]},
  { id: "minimal", name: "Minimal", emoji: "✨", description: "Clean & simple", backgroundColor: "#fafafa", texts: [
    { text: "less is more", x: 50, y: 42, fontSize: 36, color: "#171717", fontWeight: "normal" },
    { text: "keep it simple", x: 50, y: 68, fontSize: 22, color: "#525252", fontWeight: "normal" },
  ]},
  { id: "pov", name: "POV", emoji: "👀", description: "CapCut-style hook", backgroundColor: "#09090b", texts: [
    { text: "POV", x: 50, y: 22, fontSize: 56, color: "#f43f5e", fontWeight: "bold" },
    { text: "you just found this", x: 50, y: 46, fontSize: 28, color: "#ffffff", fontWeight: "bold" },
    { text: "wait for it...", x: 50, y: 76, fontSize: 20, color: "#a1a1aa", fontWeight: "normal" },
  ]},
  { id: "grwm", name: "GRWM", emoji: "💄", description: "Get ready with me", backgroundColor: "#4c0519", texts: [
    { text: "GRWM", x: 50, y: 24, fontSize: 48, color: "#fda4af", fontWeight: "bold" },
    { text: "date night edition", x: 50, y: 46, fontSize: 26, color: "#ffffff", fontWeight: "bold" },
    { text: "products in comments", x: 50, y: 76, fontSize: 18, color: "#fecdd3", fontWeight: "normal" },
  ]},
  { id: "storytime", name: "Storytime", emoji: "📖", description: "Tell the story", backgroundColor: "#1c1917", texts: [
    { text: "STORYTIME", x: 50, y: 24, fontSize: 36, color: "#fbbf24", fontWeight: "bold" },
    { text: "you won't believe this", x: 50, y: 48, fontSize: 28, color: "#ffffff", fontWeight: "bold" },
    { text: "part 1", x: 50, y: 76, fontSize: 20, color: "#a8a29e", fontWeight: "normal" },
  ]},
  { id: "beforeafter", name: "Before/After", emoji: "⚡", description: "Transformation split", backgroundColor: "#18181b", texts: [
    { text: "BEFORE", x: 28, y: 22, fontSize: 26, color: "#a1a1aa", fontWeight: "bold" },
    { text: "AFTER", x: 72, y: 22, fontSize: 26, color: "#22c55e", fontWeight: "bold" },
    { text: "same place. different life.", x: 50, y: 78, fontSize: 18, color: "#ffffff", fontWeight: "normal" },
  ]},
  { id: "threetips", name: "3 Tips", emoji: "3", description: "Listicle hook", backgroundColor: "#172554", texts: [
    { text: "3 THINGS", x: 50, y: 26, fontSize: 36, color: "#93c5fd", fontWeight: "bold" },
    { text: "nobody tells you", x: 50, y: 46, fontSize: 28, color: "#ffffff", fontWeight: "bold" },
    { text: "save this", x: 50, y: 76, fontSize: 20, color: "#bfdbfe", fontWeight: "normal" },
  ]},
  { id: "quote", name: "Quote", emoji: "💬", description: "Canva quote card", backgroundColor: "#0f172a", texts: [
    { text: "Make it look easy.", x: 50, y: 48, fontSize: 30, color: "#f8fafc", fontWeight: "bold" },
    { text: "your next caption", x: 50, y: 74, fontSize: 16, color: "#94a3b8", fontWeight: "normal" },
  ]},
  { id: "sale", name: "Sale", emoji: "🏷️", description: "Promo & drop", backgroundColor: "#450a0a", texts: [
    { text: "50% OFF", x: 50, y: 28, fontSize: 52, color: "#fde68a", fontWeight: "bold" },
    { text: "this weekend only", x: 50, y: 50, fontSize: 24, color: "#ffffff", fontWeight: "bold" },
    { text: "shop the link", x: 50, y: 76, fontSize: 20, color: "#fecaca", fontWeight: "normal" },
  ]},
  { id: "realestate", name: "Listing", emoji: "🏠", description: "Property showcase", backgroundColor: "#0b1220", texts: [
    { text: "JUST LISTED", x: 50, y: 22, fontSize: 24, color: "#fbbf24", fontWeight: "bold" },
    { text: "Waterfront living", x: 50, y: 46, fontSize: 32, color: "#ffffff", fontWeight: "bold" },
    { text: "DM for a private tour", x: 50, y: 76, fontSize: 18, color: "#cbd5e1", fontWeight: "normal" },
  ]},
  { id: "luxury", name: "Luxury", emoji: "🥂", description: "Dark gold editorial", backgroundColor: "#111111", texts: [
    { text: "QUIET LUXURY", x: 50, y: 28, fontSize: 28, color: "#d4af37", fontWeight: "bold" },
    { text: "details matter", x: 50, y: 50, fontSize: 34, color: "#f5f5f4", fontWeight: "bold" },
    { text: "follow for more", x: 50, y: 76, fontSize: 16, color: "#a8a29e", fontWeight: "normal" },
  ]},
  { id: "wellness", name: "Wellness", emoji: "🧘", description: "Calm & soft", backgroundColor: "#14532d", texts: [
    { text: "slow morning", x: 50, y: 28, fontSize: 28, color: "#bbf7d0", fontWeight: "normal" },
    { text: "protect your peace", x: 50, y: 50, fontSize: 30, color: "#ffffff", fontWeight: "bold" },
    { text: "breathe", x: 50, y: 76, fontSize: 20, color: "#86efac", fontWeight: "normal" },
  ]},
  { id: "pets", name: "Pets", emoji: "🐾", description: "Cute & playful", backgroundColor: "#422006", texts: [
    { text: "meet the star", x: 50, y: 24, fontSize: 24, color: "#fdba74", fontWeight: "normal" },
    { text: "good boy energy", x: 50, y: 48, fontSize: 32, color: "#ffffff", fontWeight: "bold" },
    { text: "like if you smiled", x: 50, y: 76, fontSize: 18, color: "#fed7aa", fontWeight: "normal" },
  ]},
  { id: "tutorial", name: "Tutorial", emoji: "🎬", description: "How-to steps", backgroundColor: "#1e1b4b", texts: [
    { text: "HOW TO", x: 50, y: 24, fontSize: 36, color: "#c4b5fd", fontWeight: "bold" },
    { text: "do this in 10 seconds", x: 50, y: 48, fontSize: 24, color: "#ffffff", fontWeight: "bold" },
    { text: "step 1", x: 50, y: 76, fontSize: 20, color: "#a78bfa", fontWeight: "normal" },
  ]},
  { id: "countdown", name: "Countdown", emoji: "⏳", description: "Urgency hook", backgroundColor: "#3b0764", texts: [
    { text: "3... 2... 1...", x: 50, y: 28, fontSize: 32, color: "#e9d5ff", fontWeight: "bold" },
    { text: "don't skip this", x: 50, y: 50, fontSize: 30, color: "#ffffff", fontWeight: "bold" },
    { text: "ending is worth it", x: 50, y: 76, fontSize: 18, color: "#d8b4fe", fontWeight: "normal" },
  ]},
  { id: "aesthetic", name: "Aesthetic", emoji: "🌸", description: "Soft vibe", backgroundColor: "#4a1942", texts: [
    { text: "main character", x: 50, y: 28, fontSize: 26, color: "#fbcfe8", fontWeight: "normal" },
    { text: "soft life loading", x: 50, y: 50, fontSize: 30, color: "#ffffff", fontWeight: "bold" },
    { text: "sound on", x: 50, y: 76, fontSize: 18, color: "#f9a8d4", fontWeight: "normal" },
  ]},
  { id: "streetwear", name: "Streetwear", emoji: "🧢", description: "Urban drop", backgroundColor: "#0a0a0a", texts: [
    { text: "NEW DROP", x: 50, y: 26, fontSize: 40, color: "#fafafa", fontWeight: "bold" },
    { text: "limited pieces", x: 50, y: 48, fontSize: 26, color: "#f97316", fontWeight: "bold" },
    { text: "tap to cop", x: 50, y: 76, fontSize: 18, color: "#a3a3a3", fontWeight: "normal" },
  ]},
  { id: "product", name: "Product", emoji: "📦", description: "UGC product style", backgroundColor: "#1f2937", texts: [
    { text: "Amazon find", x: 50, y: 24, fontSize: 22, color: "#fbbf24", fontWeight: "bold" },
    { text: "under $20", x: 50, y: 48, fontSize: 36, color: "#ffffff", fontWeight: "bold" },
    { text: "link in bio", x: 50, y: 76, fontSize: 20, color: "#d1d5db", fontWeight: "normal" },
  ]},
  { id: "wedding", name: "Wedding", emoji: "💍", description: "Romantic showcase", backgroundColor: "#3f2e2e", texts: [
    { text: "the day we said yes", x: 50, y: 26, fontSize: 22, color: "#f5d0c5", fontWeight: "normal" },
    { text: "forever starts here", x: 50, y: 50, fontSize: 28, color: "#fff7ed", fontWeight: "bold" },
    { text: "save the date", x: 50, y: 76, fontSize: 18, color: "#e7d5c5", fontWeight: "normal" },
  ]},
  { id: "coffee", name: "Cafe", emoji: "☕", description: "Cozy cafe reel", backgroundColor: "#292524", texts: [
    { text: "best latte in town", x: 50, y: 26, fontSize: 24, color: "#d6d3d1", fontWeight: "normal" },
    { text: "first sip hits", x: 50, y: 50, fontSize: 34, color: "#fef3c7", fontWeight: "bold" },
    { text: "tag a coffee friend", x: 50, y: 76, fontSize: 16, color: "#a8a29e", fontWeight: "normal" },
  ]},
  { id: "nightout", name: "Night Out", emoji: "🌃", description: "City after dark", backgroundColor: "#020617", texts: [
    { text: "Friday energy", x: 50, y: 26, fontSize: 24, color: "#67e8f9", fontWeight: "normal" },
    { text: "lights. city. us.", x: 50, y: 50, fontSize: 32, color: "#ffffff", fontWeight: "bold" },
    { text: "who is coming?", x: 50, y: 76, fontSize: 18, color: "#94a3b8", fontWeight: "normal" },
  ]},
];
