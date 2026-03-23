// ────────────────────────────────────────────────────────────────────────────
// ChillingApp AI Analytics Dashboard — Synthetic Data Layer (Worldwide)
// ────────────────────────────────────────────────────────────────────────────

// ── Viewership Heatmap (7 days × 24 hours) ──────────────────────────────────
// Values 0–100 representing relative viewing intensity (aggregated across timezones)
export const heatmapData: number[][] = [
  // Sun
  [8,5,4,3,2,2,3,6,12,18,28,38,44,50,54,60,68,74,82,94,97,93,80,58],
  // Mon
  [5,3,2,1,1,1,2,6,12,16,20,22,24,26,28,30,35,48,70,90,94,88,70,40],
  // Tue
  [4,2,2,1,1,1,2,6,11,15,18,20,22,24,26,28,33,46,68,88,92,84,66,38],
  // Wed
  [5,3,2,1,1,1,2,6,11,15,18,21,23,25,27,29,34,47,69,89,93,85,68,39],
  // Thu
  [5,3,2,1,1,1,2,6,12,16,19,22,24,26,28,30,35,49,70,90,94,87,69,40],
  // Fri
  [7,4,3,2,1,1,2,6,12,16,22,26,29,32,35,38,44,58,74,93,97,94,80,54],
  // Sat
  [9,6,5,3,2,2,3,7,14,20,30,40,47,52,56,62,70,76,84,95,98,95,82,60],
];

export const heatmapDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const heatmapHours = Array.from({ length: 24 }, (_, i) =>
  i === 0 ? "12am" : i < 12 ? `${i}am` : i === 12 ? "12pm" : `${i - 12}pm`
);

// ── DAU / MAU Trend (30 days) ────────────────────────────────────────────────
const today = new Date("2026-03-23");
export const dauMauTrend = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(today);
  d.setDate(d.getDate() - (29 - i));
  const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const base = 11800 + Math.sin(i * 0.4) * 600;
  const dau = Math.round(base + Math.random() * 400);
  const mau = Math.round(48000 + i * 60 + Math.random() * 500);
  return { date: label, DAU: dau, MAU: mau };
});

// ── Genre Distribution ────────────────────────────────────────────────────────
export const genreData = [
  { name: "Drama", value: 2960, color: "#0A7B8C" },
  { name: "Thriller", value: 2480, color: "#9B59B6" },
  { name: "Sci-Fi", value: 2120, color: "#3498DB" },
  { name: "Comedy", value: 1840, color: "#F0A500" },
  { name: "Action", value: 1620, color: "#DC2626" },
  { name: "Romance", value: 1140, color: "#E91E8C" },
  { name: "Documentary", value: 780, color: "#16A34A" },
  { name: "Horror", value: 560, color: "#8E44AD" },
];

// ── Device Distribution ───────────────────────────────────────────────────────
export const deviceData = [
  { name: "Smart TV", value: 34, color: "#0A7B8C" },
  { name: "iOS", value: 26, color: "#F0A500" },
  { name: "Android Mobile", value: 22, color: "#16A34A" },
  { name: "Web Browser", value: 13, color: "#9B59B6" },
  { name: "Gaming Console", value: 5, color: "#DC2626" },
];

// ── Geo Distribution ──────────────────────────────────────────────────────────
export const geoData = [
  { region: "North America", users: 17500, pct: 35, color: "#0A7B8C" },
  { region: "Europe", users: 14000, pct: 28, color: "#3498DB" },
  { region: "Asia Pacific", users: 10000, pct: 20, color: "#F0A500" },
  { region: "Latin America", users: 5000, pct: 10, color: "#16A34A" },
  { region: "Middle East & Africa", users: 2000, pct: 4, color: "#9B59B6" },
  { region: "Other", users: 1500, pct: 3, color: "#94A3B8" },
];

// ── Top 10 Trending Content ───────────────────────────────────────────────────
export const trendingContent = [
  { id: "C-001", title: "Stranger Things S5", genre: "Sci-Fi", lang: "English", plays: 9840, velocity: [42,52,63,72,80,87,92,95,98,100], delta: "+24%" },
  { id: "C-002", title: "The White Lotus S3", genre: "Drama", lang: "English", plays: 8620, velocity: [38,46,55,63,70,76,80,84,87,90], delta: "+18%" },
  { id: "C-003", title: "Squid Game S3", genre: "Thriller", lang: "Korean", plays: 8240, velocity: [30,42,56,66,74,80,84,88,91,93], delta: "+31%" },
  { id: "C-004", title: "The Last of Us S2", genre: "Drama", lang: "English", plays: 7580, velocity: [55,60,64,68,71,73,75,76,78,80], delta: "+9%" },
  { id: "C-005", title: "House of the Dragon S3", genre: "Fantasy", lang: "English", plays: 7120, velocity: [32,44,54,62,68,73,77,80,82,84], delta: "+17%" },
  { id: "C-006", title: "Severance S2", genre: "Sci-Fi", lang: "English", plays: 6480, velocity: [48,54,58,62,65,67,69,70,72,74], delta: "+8%" },
  { id: "C-007", title: "Wednesday S2", genre: "Horror", lang: "English", plays: 6120, velocity: [28,38,48,57,64,70,74,77,80,82], delta: "+20%" },
  { id: "C-008", title: "Dark S4", genre: "Sci-Fi", lang: "German", plays: 5640, velocity: [22,30,40,50,58,64,68,72,75,78], delta: "+26%" },
  { id: "C-009", title: "Emily in Paris S5", genre: "Romance", lang: "English/French", plays: 5280, velocity: [44,48,52,55,58,60,62,63,65,67], delta: "+7%" },
  { id: "C-010", title: "The Bear S4", genre: "Drama", lang: "English", plays: 4960, velocity: [36,42,48,53,57,61,64,67,69,72], delta: "+13%" },
];

// ── CPM Segment Matrix ────────────────────────────────────────────────────────
export const cpmSegments = [
  { segment: "North America · English · Smart TV · 25–44", size: 8400, cpm: 28, completion: 84, topAd: "Tech / Finance / Auto", color: "#F0A500" },
  { segment: "Western Europe · English · Mobile · 28–45", size: 6200, cpm: 22, completion: 80, topAd: "Travel / Luxury / Finance", color: "#0A7B8C" },
  { segment: "APAC · English+Local · Smart TV · 25–40", size: 4800, cpm: 18, completion: 76, topAd: "E-commerce / Tech", color: "#3498DB" },
  { segment: "Middle East · English+Arabic · Smart TV · 30–50", size: 2100, cpm: 15, completion: 74, topAd: "Real Estate / Travel", color: "#9B59B6" },
  { segment: "Latin America · Spanish · Android · 18–35", size: 5200, cpm: 8, completion: 66, topAd: "FMCG / Telecom", color: "#16A34A" },
  { segment: "SEA · Local lang · Mobile · Low-data", size: 3800, cpm: 5, completion: 55, topAd: "Telecom / Gaming", color: "#94A3B8" },
];

// ── Fill Rate by Slot ─────────────────────────────────────────────────────────
export const fillRateData = Array.from({ length: 24 }, (_, i) => ({
  hour: heatmapHours[i],
  preRoll: Math.round(80 + Math.sin(i * 0.5) * 12),
  midRoll: Math.round(74 + Math.sin(i * 0.4 + 1) * 15),
  postRoll: Math.round(60 + Math.sin(i * 0.3 + 2) * 10),
}));

// ── Ad Completion Rate by Segment × Time ─────────────────────────────────────
export const adCompletionMatrix = [
  { segment: "N. America · Smart TV", morning: 74, afternoon: 70, evening: 84, night: 87 },
  { segment: "W. Europe · Mobile", morning: 76, afternoon: 72, evening: 83, night: 85 },
  { segment: "APAC · Smart TV", morning: 70, afternoon: 68, evening: 80, night: 82 },
  { segment: "LatAm · Android", morning: 58, afternoon: 62, evening: 70, night: 72 },
  { segment: "SEA · Mobile", morning: 50, afternoon: 54, evening: 62, night: 64 },
];

// ── SSAI Health ───────────────────────────────────────────────────────────────
export const ssaiLatencyHistory = Array.from({ length: 30 }, (_, i) => ({
  t: `${i}m`,
  p50: Math.round(42 + Math.sin(i * 0.8) * 8),
  p95: Math.round(85 + Math.sin(i * 0.6 + 1) * 18),
  p99: Math.round(140 + Math.sin(i * 0.4 + 2) * 30),
}));

export const ssaiCurrentStats = {
  p50: 44,
  p95: 88,
  p99: 148,
  errorRate: 0.038,
  fallbackRate: 0.21,
  fillRate: { preRoll: 91, midRoll: 84, postRoll: 63 },
  status: "healthy" as "healthy" | "degraded" | "critical",
};

// ── Revenue Trend ─────────────────────────────────────────────────────────────
export const revenueTrend = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(today);
  d.setDate(d.getDate() - (29 - i));
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    revenue: Math.round(24000 + i * 150 + Math.sin(i * 0.5) * 3000),
  };
});

// ── Audience Segments (for Viewer Intelligence) ───────────────────────────────
export const audienceSegments = [
  { label: "All Active Users", size: 12400, cpm: 18, churnPct: 10, ltv: 320 },
  { label: "N. America Smart TV 25–44", size: 4820, cpm: 28, churnPct: 7, ltv: 580 },
  { label: "W. Europe Mobile Binge", size: 2640, cpm: 22, churnPct: 5, ltv: 480 },
  { label: "LatAm Android Casual", size: 3280, cpm: 8, churnPct: 16, ltv: 120 },
  { label: "APAC Smart TV Premium", size: 1100, cpm: 18, churnPct: 6, ltv: 420 },
];

// ── Churn Risk Distribution ───────────────────────────────────────────────────
export const churnDistribution = [
  { range: "0.0–0.1", count: 3800, pct: 31 },
  { range: "0.1–0.2", count: 2900, pct: 23 },
  { range: "0.2–0.3", count: 1900, pct: 15 },
  { range: "0.3–0.4", count: 1100, pct: 9 },
  { range: "0.4–0.5", count: 800, pct: 6 },
  { range: "0.5–0.6", count: 560, pct: 5 },
  { range: "0.6–0.7", count: 420, pct: 3 },
  { range: "0.7–0.8", count: 380, pct: 3 },
  { range: "0.8–0.9", count: 280, pct: 2 },
  { range: "0.9–1.0", count: 160, pct: 1 },
];

// ── LTV Score Distribution ────────────────────────────────────────────────────
export const ltvData = Array.from({ length: 12 }, (_, i) => ({
  month: new Date(2025, i).toLocaleDateString("en-US", { month: "short" }),
  avgLTV: Math.round(280 + i * 12 + Math.sin(i) * 20),
}));

// ── Watch-time funnel by segment ──────────────────────────────────────────────
export const watchTimeFunnel = [
  { stage: "Session Start", northAm: 4820, europe: 2640, apac: 2100 },
  { stage: "10 min+", northAm: 4200, europe: 2350, apac: 1780 },
  { stage: "30 min+", northAm: 3400, europe: 1960, apac: 1340 },
  { stage: "Full episode", northAm: 2800, europe: 1680, apac: 1020 },
  { stage: "Next episode", northAm: 2100, europe: 1280, apac: 740 },
];

// ── Pre-seeded Demo Users ─────────────────────────────────────────────────────
export const demoUsers: Record<string, {
  id: string;
  name: string;
  profile: string;
  avatar: string;
  churnRisk: number;
  ltv: number;
  primaryDevice: string;
  location: string;
  plan: string;
  genres: { genre: string; affinity: number }[];
  languages: string[];
  peakHour: string;
  recommendations: {
    title: string;
    genre: string;
    confidence: number;
    reasons: { label: string; pct: number; color: string }[];
  }[];
  profileDrift: { signal: string; change: string; direction: "up" | "down" | "stable" }[];
}> = {
  "CH-4821": {
    id: "CH-4821",
    name: "Marcus T.",
    profile: "New York · Sci-Fi/Thriller binge · Smart TV · Mid-series",
    avatar: "MT",
    churnRisk: 0.12,
    ltv: 620,
    primaryDevice: "Samsung Smart TV",
    location: "New York, USA",
    plan: "SVOD Premium",
    genres: [
      { genre: "Sci-Fi", affinity: 0.91 },
      { genre: "Thriller", affinity: 0.85 },
      { genre: "Drama", affinity: 0.62 },
      { genre: "Action", affinity: 0.44 },
      { genre: "Horror", affinity: 0.30 },
      { genre: "Documentary", affinity: 0.22 },
      { genre: "Comedy", affinity: 0.18 },
      { genre: "Romance", affinity: 0.10 },
    ],
    languages: ["English"],
    peakHour: "9–11 PM EST (Fri/Sat)",
    recommendations: [
      {
        title: "Severance S2",
        genre: "Sci-Fi",
        confidence: 0.96,
        reasons: [
          { label: "Series continuation", pct: 52, color: "#0A7B8C" },
          { label: "Genre affinity", pct: 28, color: "#F0A500" },
          { label: "Similar users completed", pct: 20, color: "#16A34A" },
        ],
      },
      {
        title: "Stranger Things S5",
        genre: "Sci-Fi",
        confidence: 0.93,
        reasons: [
          { label: "Genre affinity", pct: 44, color: "#0A7B8C" },
          { label: "Similar users completed", pct: 34, color: "#F0A500" },
          { label: "Trending signal", pct: 22, color: "#16A34A" },
        ],
      },
      {
        title: "The Last of Us S2",
        genre: "Drama",
        confidence: 0.86,
        reasons: [
          { label: "Similar users completed", pct: 42, color: "#0A7B8C" },
          { label: "Content affinity", pct: 32, color: "#F0A500" },
          { label: "Trending signal", pct: 26, color: "#16A34A" },
        ],
      },
      {
        title: "Dark S4",
        genre: "Sci-Fi",
        confidence: 0.80,
        reasons: [
          { label: "Genre affinity", pct: 48, color: "#0A7B8C" },
          { label: "Similar users", pct: 36, color: "#F0A500" },
          { label: "Completion signal", pct: 16, color: "#16A34A" },
        ],
      },
      {
        title: "House of the Dragon S3",
        genre: "Fantasy",
        confidence: 0.74,
        reasons: [
          { label: "Similar users", pct: 45, color: "#0A7B8C" },
          { label: "Trending signal", pct: 35, color: "#F0A500" },
          { label: "Social proof", pct: 20, color: "#16A34A" },
        ],
      },
      {
        title: "Wednesday S2",
        genre: "Horror",
        confidence: 0.68,
        reasons: [
          { label: "Genre affinity", pct: 42, color: "#0A7B8C" },
          { label: "Trending signal", pct: 38, color: "#F0A500" },
          { label: "Thumbnail CTR", pct: 20, color: "#16A34A" },
        ],
      },
      {
        title: "The White Lotus S3",
        genre: "Drama",
        confidence: 0.62,
        reasons: [
          { label: "Similar users", pct: 50, color: "#0A7B8C" },
          { label: "Trending signal", pct: 30, color: "#F0A500" },
          { label: "Social proof", pct: 20, color: "#16A34A" },
        ],
      },
      {
        title: "The Bear S4",
        genre: "Drama",
        confidence: 0.55,
        reasons: [
          { label: "Content affinity", pct: 48, color: "#0A7B8C" },
          { label: "Similar users", pct: 36, color: "#F0A500" },
          { label: "Freshness", pct: 16, color: "#16A34A" },
        ],
      },
    ],
    profileDrift: [
      { signal: "Sci-Fi affinity", change: "+0.07 this week", direction: "up" },
      { signal: "Avg session length", change: "+14 min vs last week", direction: "up" },
      { signal: "Comedy affinity", change: "-0.03 this week", direction: "down" },
      { signal: "Peak viewing hour", change: "Stable at 9–11pm EST", direction: "stable" },
    ],
  },
  "CH-1104": {
    id: "CH-1104",
    name: "Sophie L.",
    profile: "London · Drama+Thriller · Mobile · High LTV",
    avatar: "SL",
    churnRisk: 0.05,
    ltv: 840,
    primaryDevice: "iOS",
    location: "London, UK",
    plan: "SVOD Premium",
    genres: [
      { genre: "Drama", affinity: 0.88 },
      { genre: "Thriller", affinity: 0.76 },
      { genre: "Romance", affinity: 0.64 },
      { genre: "Documentary", affinity: 0.52 },
      { genre: "Comedy", affinity: 0.44 },
      { genre: "Sci-Fi", affinity: 0.32 },
      { genre: "Action", affinity: 0.20 },
      { genre: "Horror", affinity: 0.08 },
    ],
    languages: ["English", "French"],
    peakHour: "8–10 PM GMT (Weekdays)",
    recommendations: [
      {
        title: "The White Lotus S3",
        genre: "Drama",
        confidence: 0.95,
        reasons: [
          { label: "Genre affinity", pct: 44, color: "#0A7B8C" },
          { label: "Similar users completed", pct: 36, color: "#F0A500" },
          { label: "Trending signal", pct: 20, color: "#16A34A" },
        ],
      },
      {
        title: "The Last of Us S2",
        genre: "Drama",
        confidence: 0.90,
        reasons: [
          { label: "Content affinity", pct: 46, color: "#0A7B8C" },
          { label: "Genre affinity", pct: 32, color: "#F0A500" },
          { label: "Social proof", pct: 22, color: "#16A34A" },
        ],
      },
      {
        title: "Emily in Paris S5",
        genre: "Romance",
        confidence: 0.84,
        reasons: [
          { label: "Genre affinity", pct: 48, color: "#0A7B8C" },
          { label: "Language match", pct: 30, color: "#F0A500" },
          { label: "Series continuation", pct: 22, color: "#16A34A" },
        ],
      },
      {
        title: "The Bear S4",
        genre: "Drama",
        confidence: 0.78,
        reasons: [
          { label: "Similar users", pct: 44, color: "#0A7B8C" },
          { label: "Content affinity", pct: 36, color: "#F0A500" },
          { label: "Trending signal", pct: 20, color: "#16A34A" },
        ],
      },
      {
        title: "Squid Game S3",
        genre: "Thriller",
        confidence: 0.72,
        reasons: [
          { label: "Trending signal", pct: 50, color: "#0A7B8C" },
          { label: "Similar users", pct: 30, color: "#F0A500" },
          { label: "Genre affinity", pct: 20, color: "#16A34A" },
        ],
      },
      {
        title: "House of the Dragon S3",
        genre: "Fantasy",
        confidence: 0.64,
        reasons: [
          { label: "Similar users", pct: 52, color: "#0A7B8C" },
          { label: "Trending signal", pct: 32, color: "#F0A500" },
          { label: "Social proof", pct: 16, color: "#16A34A" },
        ],
      },
      {
        title: "Wednesday S2",
        genre: "Horror",
        confidence: 0.56,
        reasons: [
          { label: "Trending signal", pct: 60, color: "#0A7B8C" },
          { label: "Similar users", pct: 40, color: "#F0A500" },
        ],
      },
      {
        title: "Dark S4",
        genre: "Sci-Fi",
        confidence: 0.48,
        reasons: [
          { label: "Language match", pct: 45, color: "#0A7B8C" },
          { label: "Trending signal", pct: 35, color: "#F0A500" },
          { label: "Similar users", pct: 20, color: "#16A34A" },
        ],
      },
    ],
    profileDrift: [
      { signal: "Drama affinity", change: "+0.05 this week", direction: "up" },
      { signal: "Ad completion rate", change: "+9% vs last week", direction: "up" },
      { signal: "Session frequency", change: "Stable at 6x/week", direction: "stable" },
      { signal: "Horror affinity", change: "-0.02 this week", direction: "down" },
    ],
  },
  "CH-7733": {
    id: "CH-7733",
    name: "Gabriel M.",
    profile: "São Paulo · Drama+Romance · Android · Churn risk 0.72",
    avatar: "GM",
    churnRisk: 0.72,
    ltv: 98,
    primaryDevice: "Android Mobile",
    location: "São Paulo, Brazil",
    plan: "AVOD Free",
    genres: [
      { genre: "Drama", affinity: 0.76 },
      { genre: "Romance", affinity: 0.62 },
      { genre: "Comedy", affinity: 0.50 },
      { genre: "Action", affinity: 0.36 },
      { genre: "Thriller", affinity: 0.28 },
      { genre: "Sci-Fi", affinity: 0.18 },
      { genre: "Documentary", affinity: 0.12 },
      { genre: "Horror", affinity: 0.06 },
    ],
    languages: ["Portuguese", "Spanish"],
    peakHour: "8–10 PM BRT (Weekends)",
    recommendations: [
      {
        title: "Emily in Paris S5",
        genre: "Romance",
        confidence: 0.88,
        reasons: [
          { label: "Genre affinity", pct: 46, color: "#0A7B8C" },
          { label: "Similar users", pct: 36, color: "#F0A500" },
          { label: "Language match", pct: 18, color: "#16A34A" },
        ],
      },
      {
        title: "The White Lotus S3",
        genre: "Drama",
        confidence: 0.82,
        reasons: [
          { label: "Similar users completed", pct: 50, color: "#0A7B8C" },
          { label: "Genre affinity", pct: 32, color: "#F0A500" },
          { label: "Trending signal", pct: 18, color: "#16A34A" },
        ],
      },
      {
        title: "The Bear S4",
        genre: "Drama",
        confidence: 0.74,
        reasons: [
          { label: "Genre affinity", pct: 44, color: "#0A7B8C" },
          { label: "Trending signal", pct: 36, color: "#F0A500" },
          { label: "Social proof", pct: 20, color: "#16A34A" },
        ],
      },
      {
        title: "Squid Game S3",
        genre: "Thriller",
        confidence: 0.64,
        reasons: [
          { label: "Trending signal", pct: 58, color: "#0A7B8C" },
          { label: "Similar users", pct: 42, color: "#F0A500" },
        ],
      },
      {
        title: "Wednesday S2",
        genre: "Horror",
        confidence: 0.54,
        reasons: [
          { label: "Trending signal", pct: 62, color: "#0A7B8C" },
          { label: "Similar users", pct: 38, color: "#F0A500" },
        ],
      },
      {
        title: "Stranger Things S5",
        genre: "Sci-Fi",
        confidence: 0.46,
        reasons: [
          { label: "Trending signal", pct: 68, color: "#0A7B8C" },
          { label: "Similar users", pct: 32, color: "#F0A500" },
        ],
      },
      {
        title: "House of the Dragon S3",
        genre: "Fantasy",
        confidence: 0.40,
        reasons: [
          { label: "Trending signal", pct: 72, color: "#0A7B8C" },
          { label: "Similar users", pct: 28, color: "#F0A500" },
        ],
      },
      {
        title: "The Last of Us S2",
        genre: "Drama",
        confidence: 0.35,
        reasons: [
          { label: "Trending signal", pct: 75, color: "#0A7B8C" },
          { label: "Similar users", pct: 25, color: "#F0A500" },
        ],
      },
    ],
    profileDrift: [
      { signal: "Session frequency", change: "-3 sessions vs last week", direction: "down" },
      { signal: "Session length", change: "-16 min vs prior avg", direction: "down" },
      { signal: "No new content in preferred genre", change: "6 days without new Drama", direction: "down" },
      { signal: "Drama affinity", change: "Stable but engagement falling", direction: "stable" },
    ],
  },
  "CH-2290": {
    id: "CH-2290",
    name: "Yuna K.",
    profile: "Seoul · Korean Drama+Thriller · Smart TV · New subscriber",
    avatar: "YK",
    churnRisk: 0.28,
    ltv: 240,
    primaryDevice: "Samsung Smart TV",
    location: "Seoul, South Korea",
    plan: "SVOD Standard",
    genres: [
      { genre: "Thriller", affinity: 0.58 },
      { genre: "Drama", affinity: 0.52 },
      { genre: "Sci-Fi", affinity: 0.42 },
      { genre: "Romance", affinity: 0.36 },
      { genre: "Action", affinity: 0.30 },
      { genre: "Comedy", affinity: 0.24 },
      { genre: "Horror", affinity: 0.16 },
      { genre: "Documentary", affinity: 0.10 },
    ],
    languages: ["Korean", "English"],
    peakHour: "9–11 PM KST (Weekends)",
    recommendations: [
      {
        title: "Squid Game S3",
        genre: "Thriller",
        confidence: 0.94,
        reasons: [
          { label: "Language match", pct: 42, color: "#0A7B8C" },
          { label: "Trending signal", pct: 36, color: "#F0A500" },
          { label: "Cold start geo default", pct: 22, color: "#16A34A" },
        ],
      },
      {
        title: "Stranger Things S5",
        genre: "Sci-Fi",
        confidence: 0.80,
        reasons: [
          { label: "Trending signal", pct: 54, color: "#0A7B8C" },
          { label: "Cold start default", pct: 30, color: "#F0A500" },
          { label: "Genre affinity", pct: 16, color: "#16A34A" },
        ],
      },
      {
        title: "Dark S4",
        genre: "Sci-Fi",
        confidence: 0.74,
        reasons: [
          { label: "Trending signal", pct: 56, color: "#0A7B8C" },
          { label: "Genre affinity building", pct: 28, color: "#F0A500" },
          { label: "Cold start default", pct: 16, color: "#16A34A" },
        ],
      },
      {
        title: "Severance S2",
        genre: "Sci-Fi",
        confidence: 0.68,
        reasons: [
          { label: "Trending signal", pct: 60, color: "#0A7B8C" },
          { label: "Cold start default", pct: 40, color: "#F0A500" },
        ],
      },
      {
        title: "The Last of Us S2",
        genre: "Drama",
        confidence: 0.62,
        reasons: [
          { label: "Trending signal", pct: 62, color: "#0A7B8C" },
          { label: "Cold start default", pct: 38, color: "#F0A500" },
        ],
      },
      {
        title: "Wednesday S2",
        genre: "Horror",
        confidence: 0.55,
        reasons: [
          { label: "Trending signal", pct: 65, color: "#0A7B8C" },
          { label: "Cold start default", pct: 35, color: "#F0A500" },
        ],
      },
      {
        title: "House of the Dragon S3",
        genre: "Fantasy",
        confidence: 0.48,
        reasons: [
          { label: "Trending signal", pct: 70, color: "#0A7B8C" },
          { label: "Cold start default", pct: 30, color: "#F0A500" },
        ],
      },
      {
        title: "The White Lotus S3",
        genre: "Drama",
        confidence: 0.42,
        reasons: [
          { label: "Trending signal", pct: 72, color: "#0A7B8C" },
          { label: "Geo default", pct: 28, color: "#F0A500" },
        ],
      },
    ],
    profileDrift: [
      { signal: "Cold start active", change: "< 5 sessions recorded", direction: "stable" },
      { signal: "Thriller affinity building", change: "+0.14 from initial", direction: "up" },
      { signal: "Session length growing", change: "avg 44 min — above platform avg", direction: "up" },
      { signal: "Language preference", change: "Korean content dominant so far", direction: "stable" },
    ],
  },
  "CH-5561": {
    id: "CH-5561",
    name: "Priya S.",
    profile: "Toronto · Comedy+Romance · iOS · Ad-averse",
    avatar: "PS",
    churnRisk: 0.22,
    ltv: 480,
    primaryDevice: "iOS",
    location: "Toronto, Canada",
    plan: "SVOD Standard",
    genres: [
      { genre: "Comedy", affinity: 0.90 },
      { genre: "Romance", affinity: 0.82 },
      { genre: "Drama", affinity: 0.58 },
      { genre: "Documentary", affinity: 0.42 },
      { genre: "Thriller", affinity: 0.28 },
      { genre: "Sci-Fi", affinity: 0.22 },
      { genre: "Action", affinity: 0.14 },
      { genre: "Horror", affinity: 0.04 },
    ],
    languages: ["English", "French"],
    peakHour: "10 PM–12 AM EST (Weekdays)",
    recommendations: [
      {
        title: "Emily in Paris S5",
        genre: "Romance",
        confidence: 0.96,
        reasons: [
          { label: "Genre affinity", pct: 50, color: "#0A7B8C" },
          { label: "Series continuation", pct: 30, color: "#F0A500" },
          { label: "Language match", pct: 20, color: "#16A34A" },
        ],
      },
      {
        title: "The Bear S4",
        genre: "Drama",
        confidence: 0.88,
        reasons: [
          { label: "Genre affinity", pct: 44, color: "#0A7B8C" },
          { label: "Similar users completed", pct: 36, color: "#F0A500" },
          { label: "Time-of-day affinity", pct: 20, color: "#16A34A" },
        ],
      },
      {
        title: "The White Lotus S3",
        genre: "Drama",
        confidence: 0.80,
        reasons: [
          { label: "Similar users", pct: 46, color: "#0A7B8C" },
          { label: "Content affinity", pct: 34, color: "#F0A500" },
          { label: "Trending signal", pct: 20, color: "#16A34A" },
        ],
      },
      {
        title: "Wednesday S2",
        genre: "Horror",
        confidence: 0.72,
        reasons: [
          { label: "Trending signal", pct: 52, color: "#0A7B8C" },
          { label: "Similar users", pct: 34, color: "#F0A500" },
          { label: "Thumbnail CTR", pct: 14, color: "#16A34A" },
        ],
      },
      {
        title: "House of the Dragon S3",
        genre: "Fantasy",
        confidence: 0.64,
        reasons: [
          { label: "Similar users", pct: 50, color: "#0A7B8C" },
          { label: "Trending signal", pct: 36, color: "#F0A500" },
          { label: "Social proof", pct: 14, color: "#16A34A" },
        ],
      },
      {
        title: "Stranger Things S5",
        genre: "Sci-Fi",
        confidence: 0.54,
        reasons: [
          { label: "Trending signal", pct: 58, color: "#0A7B8C" },
          { label: "Similar users", pct: 42, color: "#F0A500" },
        ],
      },
      {
        title: "Squid Game S3",
        genre: "Thriller",
        confidence: 0.44,
        reasons: [
          { label: "Trending signal", pct: 65, color: "#0A7B8C" },
          { label: "Similar users", pct: 35, color: "#F0A500" },
        ],
      },
      {
        title: "The Last of Us S2",
        genre: "Drama",
        confidence: 0.38,
        reasons: [
          { label: "Trending signal", pct: 70, color: "#0A7B8C" },
          { label: "Similar users", pct: 30, color: "#F0A500" },
        ],
      },
    ],
    profileDrift: [
      { signal: "Comedy affinity", change: "+0.09 this week", direction: "up" },
      { signal: "Ad skip rate", change: "91% — top decile", direction: "down" },
      { signal: "Frequency cap hit", change: "4x daily limit hit this week", direction: "down" },
      { signal: "Romance affinity", change: "Stable at 0.82", direction: "stable" },
    ],
  },
};

export const allDemoUserIds = Object.keys(demoUsers);

// ── Feature Weights (Recommendation Engine Radar) ─────────────────────────────
export const featureWeights = [
  { feature: "Collaborative Filter", weight: 0.28, fullMark: 1 },
  { feature: "Content Affinity", weight: 0.24, fullMark: 1 },
  { feature: "Trending Score", weight: 0.14, fullMark: 1 },
  { feature: "Completion Signal", weight: 0.12, fullMark: 1 },
  { feature: "Language Match", weight: 0.10, fullMark: 1 },
  { feature: "Thumbnail CTR", weight: 0.09, fullMark: 1 },
  { feature: "Freshness", weight: 0.08, fullMark: 1 },
  { feature: "Time-of-Day", weight: 0.07, fullMark: 1 },
  { feature: "Social Proof", weight: 0.05, fullMark: 1 },
];

// ── A/B Thumbnail Performance ─────────────────────────────────────────────────
export const abThumbnailData = [
  { title: "Stranger Things S5", variantA: 4.6, variantB: 7.2, winner: "B" },
  { title: "White Lotus S3", variantA: 5.4, variantB: 4.8, winner: "A" },
  { title: "Squid Game S3", variantA: 3.9, variantB: 8.1, winner: "B" },
  { title: "Severance S2", variantA: 6.2, variantB: 5.7, winner: "A" },
  { title: "Wednesday S2", variantA: 4.2, variantB: 6.4, winner: "B" },
];

// ── Genre Distribution Shift (weekly) ────────────────────────────────────────
export const genreShiftData = [
  { week: "W-4", Drama: 28, Thriller: 16, SciFi: 18, Comedy: 16, Action: 12, Other: 10 },
  { week: "W-3", Drama: 27, Thriller: 17, SciFi: 19, Comedy: 16, Action: 11, Other: 10 },
  { week: "W-2", Drama: 26, Thriller: 18, SciFi: 20, Comedy: 15, Action: 11, Other: 10 },
  { week: "W-1", Drama: 25, Thriller: 19, SciFi: 22, Comedy: 15, Action: 10, Other: 9 },
  { week: "This week", Drama: 24, Thriller: 20, SciFi: 24, Comedy: 14, Action: 10, Other: 8 },
];

// ── Recommendation Acceptance Rate ────────────────────────────────────────────
export const recAcceptanceRate = Array.from({ length: 14 }, (_, i) => ({
  day: `D-${13 - i}`,
  acceptance: Math.round(42 + Math.sin(i * 0.6) * 8),
  impressions: Math.round(18000 + i * 200),
}));

// ── Cold Start vs Warm Users ──────────────────────────────────────────────────
export const coldWarmData = [
  { name: "Cold Start (<5 sessions)", value: 3920, color: "#F0A500" },
  { name: "Warm (5–20 sessions)", value: 8240, color: "#0A7B8C" },
  { name: "Loyal (20+ sessions)", value: 38840, color: "#16A34A" },
];

// ── Series Continuation Rate ──────────────────────────────────────────────────
export const seriesContinuationData = [
  { genre: "Sci-Fi", rate: 82, color: "#3498DB" },
  { genre: "Thriller", rate: 78, color: "#9B59B6" },
  { genre: "Drama", rate: 72, color: "#0A7B8C" },
  { genre: "Fantasy", rate: 70, color: "#F0A500" },
  { genre: "Comedy", rate: 62, color: "#16A34A" },
  { genre: "Action", rate: 58, color: "#DC2626" },
  { genre: "Romance", rate: 54, color: "#E91E8C" },
  { genre: "Horror", rate: 48, color: "#8E44AD" },
];

// ── Content Intelligence ──────────────────────────────────────────────────────
export const contentCompletionRates = [
  { title: "Stranger Things S5", genre: "Sci-Fi", completionRate: 88, churnContrib: -0.09, roi: 5.4 },
  { title: "Squid Game S3", genre: "Thriller", completionRate: 86, churnContrib: -0.08, roi: 5.1 },
  { title: "Severance S2", genre: "Sci-Fi", completionRate: 84, churnContrib: -0.07, roi: 4.8 },
  { title: "The Last of Us S2", genre: "Drama", completionRate: 82, churnContrib: -0.07, roi: 4.4 },
  { title: "The White Lotus S3", genre: "Drama", completionRate: 80, churnContrib: -0.06, roi: 4.0 },
  { title: "House of the Dragon S3", genre: "Fantasy", completionRate: 77, churnContrib: -0.05, roi: 3.6 },
  { title: "Wednesday S2", genre: "Horror", completionRate: 75, churnContrib: -0.05, roi: 3.3 },
  { title: "Dark S4", genre: "Sci-Fi", completionRate: 72, churnContrib: -0.04, roi: 3.0 },
  { title: "The Bear S4", genre: "Drama", completionRate: 70, churnContrib: -0.04, roi: 2.8 },
  { title: "Emily in Paris S5", genre: "Romance", completionRate: 67, churnContrib: -0.03, roi: 2.4 },
];

// ── Content Gap Analysis ──────────────────────────────────────────────────────
export const contentGapData = [
  { genre: "Sci-Fi", demand: 1.0, supply: 0.52, ratio: 1.9, color: "#3498DB" },
  { genre: "Thriller", demand: 0.94, supply: 0.72, ratio: 1.3, color: "#9B59B6" },
  { genre: "Drama", demand: 0.88, supply: 0.90, ratio: 0.98, color: "#0A7B8C" },
  { genre: "Comedy", demand: 0.82, supply: 0.62, ratio: 1.32, color: "#F0A500" },
  { genre: "Romance", demand: 0.76, supply: 0.44, ratio: 1.7, color: "#E91E8C" },
  { genre: "Action", demand: 0.70, supply: 0.68, ratio: 1.03, color: "#DC2626" },
  { genre: "Documentary", demand: 0.54, supply: 0.64, ratio: 0.84, color: "#16A34A" },
  { genre: "Horror", demand: 0.46, supply: 0.34, ratio: 1.35, color: "#8E44AD" },
];

// ── Language Preference Shift (6 months) ─────────────────────────────────────
export const languageShiftData = [
  { month: "Sep", English: 58, Spanish: 12, Korean: 10, French: 8, German: 5, Japanese: 4, Portuguese: 3 },
  { month: "Oct", English: 57, Spanish: 12, Korean: 11, French: 8, German: 5, Japanese: 4, Portuguese: 3 },
  { month: "Nov", English: 56, Spanish: 13, Korean: 11, French: 8, German: 5, Japanese: 4, Portuguese: 3 },
  { month: "Dec", English: 55, Spanish: 13, Korean: 12, French: 8, German: 5, Japanese: 4, Portuguese: 3 },
  { month: "Jan", English: 54, Spanish: 13, Korean: 13, French: 8, German: 5, Japanese: 4, Portuguese: 3 },
  { month: "Feb", English: 53, Spanish: 13, Korean: 14, French: 8, German: 5, Japanese: 4, Portuguese: 3 },
  { month: "Mar", English: 52, Spanish: 13, Korean: 15, French: 8, German: 5, Japanese: 4, Portuguese: 3 },
];

// ── Content ROI Index ─────────────────────────────────────────────────────────
export const contentROI = [
  { title: "Stranger Things S5", cost: 8.4, adRevenue: 24.2, engagement: 0.92, roi: 5.4 },
  { title: "Squid Game S3", cost: 5.2, adRevenue: 14.8, engagement: 0.90, roi: 5.1 },
  { title: "Severance S2", cost: 4.8, adRevenue: 12.6, engagement: 0.88, roi: 4.8 },
  { title: "The Last of Us S2", cost: 9.2, adRevenue: 22.0, engagement: 0.86, roi: 4.4 },
  { title: "The White Lotus S3", cost: 6.0, adRevenue: 13.6, engagement: 0.84, roi: 4.0 },
  { title: "House of Dragon S3", cost: 11.2, adRevenue: 22.4, engagement: 0.81, roi: 3.6 },
  { title: "Wednesday S2", cost: 5.6, adRevenue: 10.0, engagement: 0.78, roi: 3.3 },
  { title: "Dark S4", cost: 3.2, adRevenue: 6.2, engagement: 0.76, roi: 3.0 },
  { title: "The Bear S4", cost: 4.0, adRevenue: 7.2, engagement: 0.74, roi: 2.8 },
  { title: "Emily in Paris S5", cost: 3.8, adRevenue: 5.8, engagement: 0.70, roi: 2.4 },
];

// ── Global Vitals (base values, header will animate these) ────────────────────
export const baseVitals = {
  activeViewers: 12347,
  dau: 12400,
  adImpressions: 284720,
  adRevenueCents: 2840000, // $28,400 in cents
  healthStatus: "healthy" as "healthy" | "degraded" | "critical",
};
