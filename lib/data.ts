// ────────────────────────────────────────────────────────────────────────────
// ChillingApp AI Analytics Dashboard — Synthetic Data Layer
// ────────────────────────────────────────────────────────────────────────────

// ── Viewership Heatmap (7 days × 24 hours) ──────────────────────────────────
// Values 0–100 representing relative viewing intensity
export const heatmapData: number[][] = [
  // Sun
  [5,3,2,2,1,1,2,4,8,12,18,22,25,28,30,35,40,52,65,82,95,90,75,45],
  // Mon
  [4,2,2,1,1,1,2,5,10,15,18,20,22,24,26,28,32,45,68,88,92,85,68,38],
  // Tue
  [4,2,2,1,1,1,2,5,10,14,17,19,21,23,25,27,31,44,66,86,90,83,65,36],
  // Wed
  [4,2,2,1,1,1,2,5,10,14,17,20,22,24,26,28,32,46,67,87,91,84,66,37],
  // Thu
  [5,3,2,1,1,1,2,5,10,15,18,21,23,25,27,29,33,47,68,89,93,86,68,38],
  // Fri
  [6,4,3,2,1,1,2,5,10,15,20,24,27,30,33,36,42,56,72,91,96,92,78,52],
  // Sat
  [8,5,4,3,2,2,3,6,12,18,28,38,45,50,54,60,68,75,82,94,97,93,80,58],
];

export const heatmapDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const heatmapHours = Array.from({ length: 24 }, (_, i) =>
  i === 0 ? "12am" : i < 12 ? `${i}am` : i === 12 ? "12pm" : `${i - 12}pm`
);

// ── DAU / MAU Trend (30 days) ────────────────────────────────────────────────
const today = new Date("2026-03-22");
export const dauMauTrend = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(today);
  d.setDate(d.getDate() - (29 - i));
  const label = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  const base = 11800 + Math.sin(i * 0.4) * 600;
  const dau = Math.round(base + Math.random() * 400);
  const mau = Math.round(48000 + i * 60 + Math.random() * 500);
  return { date: label, DAU: dau, MAU: mau };
});

// ── Genre Treemap ─────────────────────────────────────────────────────────────
export const genreData = [
  { name: "Drama", value: 2840, color: "#0A7B8C" },
  { name: "Action", value: 2210, color: "#F0A500" },
  { name: "Romance", value: 1980, color: "#E74C3C" },
  { name: "Thriller", value: 1750, color: "#9B59B6" },
  { name: "Comedy", value: 1520, color: "#2ECC71" },
  { name: "Family", value: 980, color: "#3498DB" },
  { name: "Documentary", value: 640, color: "#F39C12" },
  { name: "Horror", value: 480, color: "#8E44AD" },
];

// ── Device Distribution ───────────────────────────────────────────────────────
export const deviceData = [
  { name: "Android Mobile", value: 38, color: "#0A7B8C" },
  { name: "Smart TV", value: 26, color: "#F0A500" },
  { name: "iOS", value: 18, color: "#2ECC71" },
  { name: "Web Browser", value: 12, color: "#9B59B6" },
  { name: "Fire TV", value: 6, color: "#E74C3C" },
];

// ── Geo Distribution ──────────────────────────────────────────────────────────
export const geoData = [
  { region: "India Metro", users: 19000, pct: 38, color: "#0A7B8C" },
  { region: "India T2/T3", users: 15500, pct: 31, color: "#0D9BAF" },
  { region: "UAE", users: 5500, pct: 11, color: "#F0A500" },
  { region: "UK", users: 4500, pct: 9, color: "#2ECC71" },
  { region: "USA", users: 3500, pct: 7, color: "#9B59B6" },
  { region: "Other", users: 2000, pct: 4, color: "#8888A8" },
];

// ── Top 10 Trending Content ───────────────────────────────────────────────────
export const trendingContent = [
  { id: "C-001", title: "Mirzapur S3", genre: "Thriller", lang: "Hindi", plays: 8420, velocity: [45,52,61,68,74,82,88,92,96,100], delta: "+18%" },
  { id: "C-002", title: "Panchayat S4", genre: "Drama", lang: "Hindi", plays: 7840, velocity: [38,42,50,58,65,70,76,80,84,88], delta: "+14%" },
  { id: "C-003", title: "Scam 2026", genre: "Thriller", lang: "Hindi", plays: 6920, velocity: [20,30,45,55,62,68,72,76,80,85], delta: "+22%" },
  { id: "C-004", title: "Heeramandi S2", genre: "Drama", lang: "Hindi", plays: 6540, velocity: [60,62,65,67,68,70,72,73,75,76], delta: "+8%" },
  { id: "C-005", title: "Maharaj 2", genre: "Action", lang: "Hindi", plays: 5980, velocity: [30,40,50,58,64,68,72,75,78,80], delta: "+16%" },
  { id: "C-006", title: "Farzi S2", genre: "Thriller", lang: "Hindi", plays: 5420, velocity: [55,58,60,62,64,65,67,68,70,72], delta: "+6%" },
  { id: "C-007", title: "Jubilee Part 2", genre: "Drama", lang: "Hindi", plays: 4980, velocity: [40,44,48,52,56,60,63,65,67,70], delta: "+10%" },
  { id: "C-008", title: "Kohrra S2", genre: "Thriller", lang: "Punjabi", plays: 4540, velocity: [25,32,40,48,54,59,63,66,68,70], delta: "+19%" },
  { id: "C-009", title: "Made in Heaven S3", genre: "Romance", lang: "Hindi", plays: 4220, velocity: [50,52,54,55,56,57,58,59,60,62], delta: "+5%" },
  { id: "C-010", title: "Dhoom Dhaam S2", genre: "Comedy", lang: "Hindi", plays: 3980, velocity: [35,38,42,46,49,52,55,57,59,62], delta: "+12%" },
];

// ── CPM Segment Matrix ────────────────────────────────────────────────────────
export const cpmSegments = [
  { segment: "Diaspora UK · English+Hindi · Mobile · 28–40", size: 4200, cpm: 210, completion: 82, topAd: "Remittance / Travel", color: "#F0A500" },
  { segment: "Diaspora UAE · Hindi · Smart TV · 30–45", size: 3100, cpm: 195, completion: 80, topAd: "Real Estate / Finance", color: "#E8A000" },
  { segment: "Metro India · Hindi · Smart TV · 25–34", size: 12400, cpm: 185, completion: 78, topAd: "FMCG / Fashion", color: "#0A7B8C" },
  { segment: "Metro India · Drama · Binge User", size: 8900, cpm: 155, completion: 74, topAd: "Streaming / OTT", color: "#0D9BAF" },
  { segment: "T2 India · Hindi · Android · 18–28", size: 28600, cpm: 75, completion: 65, topAd: "Ed-Tech / Finance", color: "#2ECC71" },
  { segment: "T3 India · Regional · Low-data device", size: 42000, cpm: 40, completion: 55, topAd: "Telecom / FMCG", color: "#8888A8" },
];

// ── Fill Rate by Slot ─────────────────────────────────────────────────────────
export const fillRateData = Array.from({ length: 24 }, (_, i) => ({
  hour: heatmapHours[i],
  preRoll: Math.round(78 + Math.sin(i * 0.5) * 12),
  midRoll: Math.round(72 + Math.sin(i * 0.4 + 1) * 15),
  postRoll: Math.round(58 + Math.sin(i * 0.3 + 2) * 10),
}));

// ── Ad Completion Rate by Segment × Time ─────────────────────────────────────
export const adCompletionMatrix = [
  { segment: "Metro · Smart TV", morning: 72, afternoon: 68, evening: 81, night: 85 },
  { segment: "Diaspora UK", morning: 78, afternoon: 74, evening: 86, night: 88 },
  { segment: "T2 Android", morning: 58, afternoon: 62, evening: 69, night: 72 },
  { segment: "UAE · Hindi", morning: 70, afternoon: 67, evening: 82, night: 84 },
  { segment: "T3 Regional", morning: 50, afternoon: 53, evening: 60, night: 62 },
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
    date: d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    revenue: Math.round(24000 + i * 150 + Math.sin(i * 0.5) * 3000),
  };
});

// ── Audience Segments (for Viewer Intelligence) ───────────────────────────────
export const audienceSegments = [
  { label: "All Active Users", size: 12400, cpm: 118, churnPct: 10, ltv: 3200 },
  { label: "Metro Hindi Smart TV 25–34", size: 4820, cpm: 185, churnPct: 7, ltv: 5800 },
  { label: "Diaspora UK Mobile", size: 1640, cpm: 210, churnPct: 5, ltv: 8400 },
  { label: "T2 Android Binge", size: 3280, cpm: 75, churnPct: 16, ltv: 1200 },
  { label: "UAE Smart TV Hindi", size: 1100, cpm: 195, churnPct: 6, ltv: 7200 },
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
  month: new Date(2025, i).toLocaleDateString("en-IN", { month: "short" }),
  avgLTV: Math.round(2800 + i * 120 + Math.sin(i) * 200),
}));

// ── Watch-time funnel by segment ──────────────────────────────────────────────
export const watchTimeFunnel = [
  { stage: "Session Start", metro: 4820, diaspora: 1640, t2: 3280 },
  { stage: "10 min+", metro: 4100, diaspora: 1480, t2: 2400 },
  { stage: "30 min+", metro: 3200, diaspora: 1280, t2: 1600 },
  { stage: "Full episode", metro: 2600, diaspora: 1100, t2: 1100 },
  { stage: "Next episode", metro: 1900, diaspora: 860, t2: 680 },
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
    name: "Arjun M.",
    profile: "Metro Delhi · Hindi Thriller binge · Smart TV · Mid-series",
    avatar: "AM",
    churnRisk: 0.12,
    ltv: 6200,
    primaryDevice: "Samsung Smart TV",
    location: "Delhi, India",
    plan: "SVOD Premium",
    genres: [
      { genre: "Thriller", affinity: 0.88 },
      { genre: "Action", affinity: 0.72 },
      { genre: "Drama", affinity: 0.61 },
      { genre: "Comedy", affinity: 0.32 },
      { genre: "Romance", affinity: 0.18 },
      { genre: "Documentary", affinity: 0.15 },
      { genre: "Horror", affinity: 0.10 },
      { genre: "Family", affinity: 0.08 },
    ],
    languages: ["Hindi", "English"],
    peakHour: "9–11 PM IST (Fri/Sat)",
    recommendations: [
      {
        title: "Scam 2026",
        genre: "Thriller",
        confidence: 0.94,
        reasons: [
          { label: "Similar users completed", pct: 42, color: "#0A7B8C" },
          { label: "Genre affinity", pct: 28, color: "#F0A500" },
          { label: "Series continuation", pct: 18, color: "#2ECC71" },
          { label: "Trending signal", pct: 12, color: "#9B59B6" },
        ],
      },
      {
        title: "Mirzapur S3",
        genre: "Thriller",
        confidence: 0.91,
        reasons: [
          { label: "Series continuation", pct: 55, color: "#0A7B8C" },
          { label: "Genre affinity", pct: 25, color: "#F0A500" },
          { label: "Trending signal", pct: 20, color: "#2ECC71" },
        ],
      },
      {
        title: "Panchayat S4",
        genre: "Drama",
        confidence: 0.82,
        reasons: [
          { label: "Similar users completed", pct: 38, color: "#0A7B8C" },
          { label: "Content affinity", pct: 32, color: "#F0A500" },
          { label: "Language match", pct: 18, color: "#2ECC71" },
          { label: "Social proof", pct: 12, color: "#9B59B6" },
        ],
      },
      {
        title: "Maharaj 2",
        genre: "Action",
        confidence: 0.76,
        reasons: [
          { label: "Genre affinity", pct: 45, color: "#0A7B8C" },
          { label: "Similar users", pct: 35, color: "#F0A500" },
          { label: "Freshness", pct: 20, color: "#2ECC71" },
        ],
      },
      {
        title: "Kohrra S2",
        genre: "Thriller",
        confidence: 0.72,
        reasons: [
          { label: "Genre affinity", pct: 50, color: "#0A7B8C" },
          { label: "Content affinity", pct: 30, color: "#F0A500" },
          { label: "Thumbnail CTR", pct: 20, color: "#2ECC71" },
        ],
      },
      {
        title: "Farzi S2",
        genre: "Thriller",
        confidence: 0.68,
        reasons: [
          { label: "Similar users", pct: 40, color: "#0A7B8C" },
          { label: "Genre affinity", pct: 35, color: "#F0A500" },
          { label: "Social proof", pct: 25, color: "#2ECC71" },
        ],
      },
      {
        title: "Heeramandi S2",
        genre: "Drama",
        confidence: 0.61,
        reasons: [
          { label: "Language match", pct: 40, color: "#0A7B8C" },
          { label: "Trending", pct: 35, color: "#F0A500" },
          { label: "Completion signal", pct: 25, color: "#2ECC71" },
        ],
      },
      {
        title: "Jubilee Part 2",
        genre: "Drama",
        confidence: 0.58,
        reasons: [
          { label: "Content affinity", pct: 45, color: "#0A7B8C" },
          { label: "Similar users", pct: 35, color: "#F0A500" },
          { label: "Freshness", pct: 20, color: "#2ECC71" },
        ],
      },
    ],
    profileDrift: [
      { signal: "Thriller affinity", change: "+0.06 this week", direction: "up" },
      { signal: "Avg session length", change: "+12 min vs last week", direction: "up" },
      { signal: "Comedy affinity", change: "-0.04 this week", direction: "down" },
      { signal: "Peak viewing hour", change: "Stable at 9–11pm", direction: "stable" },
    ],
  },
  "CH-1104": {
    id: "CH-1104",
    name: "Priya S.",
    profile: "UK Diaspora · Hindi+English · Mobile · High LTV",
    avatar: "PS",
    churnRisk: 0.05,
    ltv: 9400,
    primaryDevice: "iOS",
    location: "London, UK",
    plan: "SVOD Premium",
    genres: [
      { genre: "Drama", affinity: 0.82 },
      { genre: "Romance", affinity: 0.78 },
      { genre: "Thriller", affinity: 0.60 },
      { genre: "Comedy", affinity: 0.55 },
      { genre: "Action", affinity: 0.30 },
      { genre: "Documentary", affinity: 0.28 },
      { genre: "Family", affinity: 0.20 },
      { genre: "Horror", affinity: 0.05 },
    ],
    languages: ["Hindi", "English"],
    peakHour: "8–10 PM GMT (Weekdays)",
    recommendations: [
      {
        title: "Made in Heaven S3",
        genre: "Romance",
        confidence: 0.96,
        reasons: [
          { label: "Genre affinity", pct: 40, color: "#0A7B8C" },
          { label: "Series continuation", pct: 35, color: "#F0A500" },
          { label: "Similar users", pct: 25, color: "#2ECC71" },
        ],
      },
      {
        title: "Heeramandi S2",
        genre: "Drama",
        confidence: 0.89,
        reasons: [
          { label: "Content affinity", pct: 45, color: "#0A7B8C" },
          { label: "Language match", pct: 30, color: "#F0A500" },
          { label: "Social proof", pct: 25, color: "#2ECC71" },
        ],
      },
      {
        title: "Jubilee Part 2",
        genre: "Drama",
        confidence: 0.84,
        reasons: [
          { label: "Similar users completed", pct: 42, color: "#0A7B8C" },
          { label: "Genre affinity", pct: 35, color: "#F0A500" },
          { label: "Trending", pct: 23, color: "#2ECC71" },
        ],
      },
      {
        title: "Scam 2026",
        genre: "Thriller",
        confidence: 0.72,
        reasons: [
          { label: "Trending signal", pct: 45, color: "#0A7B8C" },
          { label: "Similar users", pct: 35, color: "#F0A500" },
          { label: "Language match", pct: 20, color: "#2ECC71" },
        ],
      },
      {
        title: "Panchayat S4",
        genre: "Drama",
        confidence: 0.68,
        reasons: [
          { label: "Similar users", pct: 50, color: "#0A7B8C" },
          { label: "Language match", pct: 30, color: "#F0A500" },
          { label: "Social proof", pct: 20, color: "#2ECC71" },
        ],
      },
      {
        title: "Dhoom Dhaam S2",
        genre: "Comedy",
        confidence: 0.62,
        reasons: [
          { label: "Genre affinity", pct: 45, color: "#0A7B8C" },
          { label: "Trending", pct: 35, color: "#F0A500" },
          { label: "Thumbnail CTR", pct: 20, color: "#2ECC71" },
        ],
      },
      {
        title: "Farzi S2",
        genre: "Thriller",
        confidence: 0.55,
        reasons: [
          { label: "Similar users", pct: 40, color: "#0A7B8C" },
          { label: "Content affinity", pct: 40, color: "#F0A500" },
          { label: "Freshness", pct: 20, color: "#2ECC71" },
        ],
      },
      {
        title: "Maharaj 2",
        genre: "Action",
        confidence: 0.48,
        reasons: [
          { label: "Trending", pct: 55, color: "#0A7B8C" },
          { label: "Similar users", pct: 45, color: "#F0A500" },
        ],
      },
    ],
    profileDrift: [
      { signal: "Drama affinity", change: "+0.04 this week", direction: "up" },
      { signal: "Ad completion rate", change: "+8% vs last week", direction: "up" },
      { signal: "Session frequency", change: "Stable at 5x/week", direction: "stable" },
      { signal: "Action affinity", change: "-0.02 this week", direction: "down" },
    ],
  },
  "CH-7733": {
    id: "CH-7733",
    name: "Ramesh K.",
    profile: "T2 Jaipur · Regional Drama · Android · Churn risk 0.72",
    avatar: "RK",
    churnRisk: 0.72,
    ltv: 980,
    primaryDevice: "Android Mobile",
    location: "Jaipur, India",
    plan: "AVOD Free",
    genres: [
      { genre: "Drama", affinity: 0.74 },
      { genre: "Family", affinity: 0.60 },
      { genre: "Comedy", affinity: 0.48 },
      { genre: "Romance", affinity: 0.35 },
      { genre: "Action", affinity: 0.28 },
      { genre: "Thriller", affinity: 0.20 },
      { genre: "Documentary", affinity: 0.12 },
      { genre: "Horror", affinity: 0.05 },
    ],
    languages: ["Hindi", "Rajasthani"],
    peakHour: "7–9 PM IST (Weekends)",
    recommendations: [
      {
        title: "Panchayat S4",
        genre: "Drama",
        confidence: 0.88,
        reasons: [
          { label: "Genre affinity", pct: 45, color: "#0A7B8C" },
          { label: "Similar users", pct: 35, color: "#F0A500" },
          { label: "Language match", pct: 20, color: "#2ECC71" },
        ],
      },
      {
        title: "Heeramandi S2",
        genre: "Drama",
        confidence: 0.82,
        reasons: [
          { label: "Similar users completed", pct: 50, color: "#0A7B8C" },
          { label: "Language match", pct: 30, color: "#F0A500" },
          { label: "Trending", pct: 20, color: "#2ECC71" },
        ],
      },
      {
        title: "Dhoom Dhaam S2",
        genre: "Comedy",
        confidence: 0.74,
        reasons: [
          { label: "Genre affinity", pct: 40, color: "#0A7B8C" },
          { label: "Trending", pct: 35, color: "#F0A500" },
          { label: "Social proof", pct: 25, color: "#2ECC71" },
        ],
      },
      {
        title: "Jubilee Part 2",
        genre: "Drama",
        confidence: 0.68,
        reasons: [
          { label: "Content affinity", pct: 45, color: "#0A7B8C" },
          { label: "Similar users", pct: 40, color: "#F0A500" },
          { label: "Freshness", pct: 15, color: "#2ECC71" },
        ],
      },
      {
        title: "Made in Heaven S3",
        genre: "Romance",
        confidence: 0.55,
        reasons: [
          { label: "Trending", pct: 50, color: "#0A7B8C" },
          { label: "Language match", pct: 30, color: "#F0A500" },
          { label: "Similar users", pct: 20, color: "#2ECC71" },
        ],
      },
      {
        title: "Mirzapur S3",
        genre: "Thriller",
        confidence: 0.48,
        reasons: [
          { label: "Trending signal", pct: 60, color: "#0A7B8C" },
          { label: "Similar users", pct: 40, color: "#F0A500" },
        ],
      },
      {
        title: "Farzi S2",
        genre: "Thriller",
        confidence: 0.42,
        reasons: [
          { label: "Trending", pct: 65, color: "#0A7B8C" },
          { label: "Similar users", pct: 35, color: "#F0A500" },
        ],
      },
      {
        title: "Maharaj 2",
        genre: "Action",
        confidence: 0.38,
        reasons: [
          { label: "Trending", pct: 70, color: "#0A7B8C" },
          { label: "Similar users", pct: 30, color: "#F0A500" },
        ],
      },
    ],
    profileDrift: [
      { signal: "Session frequency", change: "-3 sessions vs last week", direction: "down" },
      { signal: "Session length", change: "-18 min vs prior avg", direction: "down" },
      { signal: "No new content in preferred genre", change: "7 days without regional drama", direction: "down" },
      { signal: "Drama affinity", change: "Stable but engagement falling", direction: "stable" },
    ],
  },
  "CH-2290": {
    id: "CH-2290",
    name: "Faizal A.",
    profile: "UAE · Hindi+Malayalam · Smart TV · New subscriber",
    avatar: "FA",
    churnRisk: 0.28,
    ltv: 2400,
    primaryDevice: "Samsung Smart TV",
    location: "Dubai, UAE",
    plan: "SVOD Standard",
    genres: [
      { genre: "Action", affinity: 0.55 },
      { genre: "Drama", affinity: 0.48 },
      { genre: "Thriller", affinity: 0.42 },
      { genre: "Comedy", affinity: 0.38 },
      { genre: "Family", affinity: 0.32 },
      { genre: "Romance", affinity: 0.28 },
      { genre: "Documentary", affinity: 0.20 },
      { genre: "Horror", affinity: 0.12 },
    ],
    languages: ["Hindi", "Malayalam"],
    peakHour: "9–11 PM GST (Weekends)",
    recommendations: [
      {
        title: "Maharaj 2",
        genre: "Action",
        confidence: 0.82,
        reasons: [
          { label: "Trending signal", pct: 45, color: "#0A7B8C" },
          { label: "Cold start geo default", pct: 35, color: "#F0A500" },
          { label: "Language match", pct: 20, color: "#2ECC71" },
        ],
      },
      {
        title: "Mirzapur S3",
        genre: "Thriller",
        confidence: 0.78,
        reasons: [
          { label: "Trending signal", pct: 55, color: "#0A7B8C" },
          { label: "Geo segment default", pct: 30, color: "#F0A500" },
          { label: "Language match", pct: 15, color: "#2ECC71" },
        ],
      },
      {
        title: "Scam 2026",
        genre: "Thriller",
        confidence: 0.74,
        reasons: [
          { label: "Trending signal", pct: 60, color: "#0A7B8C" },
          { label: "Cold start default", pct: 40, color: "#F0A500" },
        ],
      },
      {
        title: "Panchayat S4",
        genre: "Drama",
        confidence: 0.68,
        reasons: [
          { label: "Trending", pct: 50, color: "#0A7B8C" },
          { label: "Geo segment default", pct: 35, color: "#F0A500" },
          { label: "Language match", pct: 15, color: "#2ECC71" },
        ],
      },
      {
        title: "Heeramandi S2",
        genre: "Drama",
        confidence: 0.62,
        reasons: [
          { label: "Trending", pct: 55, color: "#0A7B8C" },
          { label: "Cold start default", pct: 45, color: "#F0A500" },
        ],
      },
      {
        title: "Dhoom Dhaam S2",
        genre: "Comedy",
        confidence: 0.58,
        reasons: [
          { label: "Trending", pct: 60, color: "#0A7B8C" },
          { label: "Cold start default", pct: 40, color: "#F0A500" },
        ],
      },
      {
        title: "Farzi S2",
        genre: "Thriller",
        confidence: 0.52,
        reasons: [
          { label: "Trending", pct: 65, color: "#0A7B8C" },
          { label: "Cold start default", pct: 35, color: "#F0A500" },
        ],
      },
      {
        title: "Made in Heaven S3",
        genre: "Romance",
        confidence: 0.45,
        reasons: [
          { label: "Trending", pct: 70, color: "#0A7B8C" },
          { label: "Geo default", pct: 30, color: "#F0A500" },
        ],
      },
    ],
    profileDrift: [
      { signal: "Cold start active", change: "< 5 sessions recorded", direction: "stable" },
      { signal: "Action affinity building", change: "+0.12 from initial", direction: "up" },
      { signal: "Session length", change: "Growing: avg 38 min", direction: "up" },
      { signal: "Language preference", change: "Hindi primary confirmed", direction: "stable" },
    ],
  },
  "CH-5561": {
    id: "CH-5561",
    name: "Sneha R.",
    profile: "Mumbai Metro · Comedy+Romance · iOS · Ad-averse",
    avatar: "SR",
    churnRisk: 0.22,
    ltv: 4800,
    primaryDevice: "iOS",
    location: "Mumbai, India",
    plan: "SVOD Standard",
    genres: [
      { genre: "Comedy", affinity: 0.86 },
      { genre: "Romance", affinity: 0.80 },
      { genre: "Drama", affinity: 0.55 },
      { genre: "Thriller", affinity: 0.30 },
      { genre: "Action", affinity: 0.20 },
      { genre: "Family", affinity: 0.18 },
      { genre: "Documentary", affinity: 0.10 },
      { genre: "Horror", affinity: 0.04 },
    ],
    languages: ["Hindi", "English", "Marathi"],
    peakHour: "10 PM–12 AM IST (Weekdays)",
    recommendations: [
      {
        title: "Dhoom Dhaam S2",
        genre: "Comedy",
        confidence: 0.94,
        reasons: [
          { label: "Genre affinity", pct: 48, color: "#0A7B8C" },
          { label: "Similar users completed", pct: 32, color: "#F0A500" },
          { label: "Time-of-day affinity", pct: 20, color: "#2ECC71" },
        ],
      },
      {
        title: "Made in Heaven S3",
        genre: "Romance",
        confidence: 0.90,
        reasons: [
          { label: "Genre affinity", pct: 50, color: "#0A7B8C" },
          { label: "Series continuation", pct: 30, color: "#F0A500" },
          { label: "Similar users", pct: 20, color: "#2ECC71" },
        ],
      },
      {
        title: "Heeramandi S2",
        genre: "Drama",
        confidence: 0.78,
        reasons: [
          { label: "Content affinity", pct: 42, color: "#0A7B8C" },
          { label: "Language match", pct: 35, color: "#F0A500" },
          { label: "Trending", pct: 23, color: "#2ECC71" },
        ],
      },
      {
        title: "Panchayat S4",
        genre: "Drama",
        confidence: 0.72,
        reasons: [
          { label: "Similar users", pct: 45, color: "#0A7B8C" },
          { label: "Language match", pct: 35, color: "#F0A500" },
          { label: "Social proof", pct: 20, color: "#2ECC71" },
        ],
      },
      {
        title: "Jubilee Part 2",
        genre: "Drama",
        confidence: 0.65,
        reasons: [
          { label: "Content affinity", pct: 48, color: "#0A7B8C" },
          { label: "Similar users", pct: 35, color: "#F0A500" },
          { label: "Trending", pct: 17, color: "#2ECC71" },
        ],
      },
      {
        title: "Farzi S2",
        genre: "Thriller",
        confidence: 0.52,
        reasons: [
          { label: "Trending signal", pct: 55, color: "#0A7B8C" },
          { label: "Similar users", pct: 45, color: "#F0A500" },
        ],
      },
      {
        title: "Scam 2026",
        genre: "Thriller",
        confidence: 0.46,
        reasons: [
          { label: "Trending signal", pct: 65, color: "#0A7B8C" },
          { label: "Similar users", pct: 35, color: "#F0A500" },
        ],
      },
      {
        title: "Kohrra S2",
        genre: "Thriller",
        confidence: 0.40,
        reasons: [
          { label: "Trending", pct: 70, color: "#0A7B8C" },
          { label: "Similar users", pct: 30, color: "#F0A500" },
        ],
      },
    ],
    profileDrift: [
      { signal: "Comedy affinity", change: "+0.08 this week", direction: "up" },
      { signal: "Ad skip rate", change: "88% — highest quartile", direction: "down" },
      { signal: "Frequency cap hit", change: "3x daily limit hit this week", direction: "down" },
      { signal: "Romance affinity", change: "Stable at 0.80", direction: "stable" },
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
  { title: "Mirzapur S3", variantA: 4.2, variantB: 6.8, winner: "B" },
  { title: "Panchayat S4", variantA: 5.1, variantB: 4.7, winner: "A" },
  { title: "Scam 2026", variantA: 3.8, variantB: 7.2, winner: "B" },
  { title: "Heeramandi S2", variantA: 6.2, variantB: 5.9, winner: "A" },
  { title: "Maharaj 2", variantA: 4.4, variantB: 5.8, winner: "B" },
];

// ── Genre Distribution Shift (weekly) ────────────────────────────────────────
export const genreShiftData = [
  { week: "W-4", Drama: 28, Thriller: 18, Comedy: 16, Romance: 14, Action: 12, Other: 12 },
  { week: "W-3", Drama: 27, Thriller: 19, Comedy: 16, Romance: 14, Action: 12, Other: 12 },
  { week: "W-2", Drama: 26, Thriller: 21, Comedy: 15, Romance: 14, Action: 12, Other: 12 },
  { week: "W-1", Drama: 25, Thriller: 23, Comedy: 15, Romance: 14, Action: 12, Other: 11 },
  { week: "This week", Drama: 24, Thriller: 25, Comedy: 15, Romance: 14, Action: 12, Other: 10 },
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
  { name: "Loyal (20+ sessions)", value: 38840, color: "#2ECC71" },
];

// ── Series Continuation Rate ──────────────────────────────────────────────────
export const seriesContinuationData = [
  { genre: "Thriller", rate: 78, color: "#9B59B6" },
  { genre: "Drama", rate: 72, color: "#0A7B8C" },
  { genre: "Comedy", rate: 65, color: "#F0A500" },
  { genre: "Action", rate: 62, color: "#E74C3C" },
  { genre: "Romance", rate: 58, color: "#E91E8C" },
  { genre: "Horror", rate: 48, color: "#8E44AD" },
  { genre: "Family", rate: 45, color: "#3498DB" },
  { genre: "Documentary", rate: 38, color: "#2ECC71" },
];

// ── Content Intelligence ──────────────────────────────────────────────────────
export const contentCompletionRates = [
  { title: "Mirzapur S3", genre: "Thriller", completionRate: 84, churnContrib: -0.08, roi: 4.2 },
  { title: "Panchayat S4", genre: "Drama", completionRate: 82, churnContrib: -0.06, roi: 3.8 },
  { title: "Scam 2026", genre: "Thriller", completionRate: 80, churnContrib: -0.07, roi: 5.1 },
  { title: "Heeramandi S2", genre: "Drama", completionRate: 76, churnContrib: -0.04, roi: 3.2 },
  { title: "Made in Heaven S3", genre: "Romance", completionRate: 74, churnContrib: -0.05, roi: 2.8 },
  { title: "Maharaj 2", genre: "Action", completionRate: 72, churnContrib: -0.03, roi: 3.5 },
  { title: "Jubilee Part 2", genre: "Drama", completionRate: 70, churnContrib: -0.04, roi: 2.4 },
  { title: "Farzi S2", genre: "Thriller", completionRate: 68, churnContrib: -0.02, roi: 2.2 },
  { title: "Dhoom Dhaam S2", genre: "Comedy", completionRate: 65, churnContrib: -0.03, roi: 2.6 },
  { title: "Kohrra S2", genre: "Thriller", completionRate: 63, churnContrib: -0.02, roi: 1.9 },
];

// ── Content Gap Analysis ──────────────────────────────────────────────────────
export const contentGapData = [
  { genre: "Romance", demand: 1.0, supply: 0.42, ratio: 2.4, color: "#E91E8C" },
  { genre: "Thriller", demand: 0.95, supply: 0.78, ratio: 1.2, color: "#9B59B6" },
  { genre: "Drama", demand: 0.88, supply: 0.92, ratio: 0.96, color: "#0A7B8C" },
  { genre: "Comedy", demand: 0.80, supply: 0.60, ratio: 1.33, color: "#F0A500" },
  { genre: "Action", demand: 0.76, supply: 0.70, ratio: 1.09, color: "#E74C3C" },
  { genre: "Family", demand: 0.55, supply: 0.42, ratio: 1.31, color: "#3498DB" },
  { genre: "Documentary", demand: 0.45, supply: 0.55, ratio: 0.82, color: "#2ECC71" },
  { genre: "Horror", demand: 0.38, supply: 0.28, ratio: 1.36, color: "#8E44AD" },
];

// ── Language Preference Shift (6 months) ─────────────────────────────────────
export const languageShiftData = [
  { month: "Sep", Hindi: 52, Tamil: 14, Telugu: 12, Kannada: 6, Bengali: 6, Marathi: 5, English: 5 },
  { month: "Oct", Hindi: 51, Tamil: 14, Telugu: 12, Kannada: 7, Bengali: 6, Marathi: 5, English: 5 },
  { month: "Nov", Hindi: 50, Tamil: 15, Telugu: 12, Kannada: 7, Bengali: 6, Marathi: 5, English: 5 },
  { month: "Dec", Hindi: 49, Tamil: 15, Telugu: 13, Kannada: 7, Bengali: 6, Marathi: 5, English: 5 },
  { month: "Jan", Hindi: 48, Tamil: 15, Telugu: 13, Kannada: 7, Bengali: 7, Marathi: 5, English: 5 },
  { month: "Feb", Hindi: 47, Tamil: 16, Telugu: 13, Kannada: 8, Bengali: 7, Marathi: 5, English: 4 },
  { month: "Mar", Hindi: 46, Tamil: 16, Telugu: 14, Kannada: 8, Bengali: 7, Marathi: 5, English: 4 },
];

// ── Content ROI Index ─────────────────────────────────────────────────────────
export const contentROI = [
  { title: "Scam 2026", cost: 1.2, adRevenue: 4.8, engagement: 0.92, roi: 5.1 },
  { title: "Mirzapur S3", cost: 2.1, adRevenue: 6.2, engagement: 0.88, roi: 4.2 },
  { title: "Panchayat S4", cost: 0.8, adRevenue: 2.6, engagement: 0.86, roi: 3.8 },
  { title: "Maharaj 2", cost: 1.5, adRevenue: 4.0, engagement: 0.76, roi: 3.5 },
  { title: "Heeramandi S2", cost: 1.8, adRevenue: 4.4, engagement: 0.80, roi: 3.2 },
  { title: "Made in Heaven S3", cost: 1.0, adRevenue: 2.4, engagement: 0.78, roi: 2.8 },
  { title: "Dhoom Dhaam S2", cost: 0.6, adRevenue: 1.4, engagement: 0.68, roi: 2.6 },
  { title: "Jubilee Part 2", cost: 1.4, adRevenue: 2.8, engagement: 0.74, roi: 2.4 },
  { title: "Farzi S2", cost: 0.9, adRevenue: 1.6, engagement: 0.72, roi: 2.2 },
  { title: "Kohrra S2", cost: 0.7, adRevenue: 1.2, engagement: 0.66, roi: 1.9 },
];

// ── Global Vitals (base values, header will animate these) ────────────────────
export const baseVitals = {
  activeViewers: 12347,
  dau: 12400,
  adImpressions: 284720,
  adRevenuePaise: 2840000, // ₹28,400 in paise
  healthStatus: "healthy" as "healthy" | "degraded" | "critical",
};
