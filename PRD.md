# ChillingApp — AI Analytics Dashboard
## Product Requirements Document

**Viewership-Powered Ads Placement · Recommendation Engine**

| Field | Detail |
|---|---|
| Platform | chillingapp.com |
| Dashboard Type | Admin Analytics — Demo |
| Prepared by | TheNineHertz |
| Version | 1.1 |
| Date | March 2026 |
| Event | Convergence India 2026 — Bharat Mandapam, New Delhi |

---

## 01 · Executive Summary

ChillingApp (chillingapp.com) is a growing OTT streaming platform available on web, Android, iOS, Fire TV, and Samsung Smart TV. As the platform scales its content library and subscriber base, two revenue and retention levers become critical: viewership-powered ad monetization and an AI-driven content recommendation engine.

This document specifies a unified **Admin Analytics Dashboard** that captures, visualizes, and exposes every data point powering both systems. The dashboard serves two simultaneous purposes:

- **Operational tool** — enables ChillingApp's content, ad ops, and product teams to act on real-time and historical intelligence.
- **Demo asset** — provides TheNineHertz with a live, data-rich demonstration to show prospective OTT clients at Convergence India 2026 exactly what AI analytics infrastructure looks like in production.

> **Demo context — Convergence India 2026**
> This dashboard will be populated with realistic synthetic data modeled on ChillingApp's catalog, user demographics, and content categories. It will run as a live hosted demo (read-only) so TheNineHertz team can walk through every screen with a prospect in under 8 minutes, showing concrete AI value without exposing any real user data.

---

## 02 · Product Vision & Goals

### Vision Statement

A single pane of glass where every viewership signal that trains the recommendation engine and powers ad placement decisions is visible, queryable, and actionable — in real time.

### Primary Goals

- Surface all AI input signals for Viewership-Powered Ads and the Recommendation Engine in one dashboard, with segment-level and user-cohort granularity.
- Enable ad operations teams to monitor SSAI performance, CPM, fill rate, and audience segment revenue with live refresh.
- Enable content teams to understand what the recommendation engine is surfacing and why — full explainability layer.
- Provide a compelling, trustworthy demo narrative for the TheNineHertz sales team at industry events.

### Success Metrics for the Demo

| Metric | Target | Measurement |
|---|---|---|
| Prospect demo completion rate | >80% complete full walkthrough | Session tracking |
| Avg. demo session duration | >7 minutes | Engagement log |
| Lead interest conversion (demo → call) | >35% | CRM attribution |
| Data freshness visible to prospect | Real-time / <30s lag (synthetic) | Dashboard timestamp |

### Success Metrics for Production (post-demo)

| Metric | Target |
|---|---|
| Ad operations team active weekly usage | >80% of team weekly |
| Content team weekly engagement | >60% of team weekly |
| Churn risk model acting rate | >25% of flagged users receive intervention |
| SSAI alert response time | <5 minutes from alert to action |

---

## 03 · Platform Context — ChillingApp

| Attribute | Detail |
|---|---|
| Platform URL | chillingapp.com |
| Platform builder | Muvi (white-label OTT infrastructure) |
| Devices supported | Web, Android, iOS, Amazon Fire TV, Samsung Smart TV |
| Content type | Movies, web series, originals (VOD-first, Indian content focus) |
| Monetization model | SVOD + AVOD (ad-supported free tier) |
| Target audience | Indian diaspora + domestic — primarily Hindi, regional language content |
| Content catalog (estimated) | 500–2,000 titles across genres |
| Primary markets | India, UAE, UK, USA — diaspora focus |

The dashboard will model data around ChillingApp's actual catalog structure: Hindi films, regional content, web series, and originals. All synthetic data will be genre-realistic and demographically aligned to the diaspora + Indian domestic audience profile.

---

## 04 · Data Points Architecture — What Gets Captured

The dashboard visualizes two data pipelines that share a common event ingestion layer but diverge at the intelligence layer. Every data point below is both an AI training signal and a real-time dashboard metric.

---

### 4.1 · Viewership Event Stream (Shared Foundation)

These events are the raw materials for both ad targeting and recommendation. Every subscriber action on ChillingApp generates a timestamped event that flows into both pipelines.

| Event Type | Data Fields Captured | Used in Ads | Used in Rec Engine |
|---|---|---|---|
| Content play started | user_id, content_id, genre, language, device, resolution, timestamp, geo | Yes | Yes |
| Content play completed | user_id, content_id, completion_pct, session_duration, drop_off_point | Yes | Yes |
| Mid-roll ad shown | user_id, ad_id, ad_slot_position, content_context_genre, timestamp | Yes | Signal |
| Ad skipped / completed | user_id, ad_id, skip_at_second, completion_pct, post_ad_action | Yes | No |
| Search query | user_id, query_text, query_lang, results_shown, result_clicked | Context | Yes |
| Content browsed (no play) | user_id, content_id, hover_duration, thumbnail_variant_shown | No | Yes |
| Watchlist add / remove | user_id, content_id, action, source_screen, timestamp | Context | Yes |
| Like / dislike / rating | user_id, content_id, rating_value, timestamp | No | Yes (strong) |
| Share content | user_id, content_id, share_platform, timestamp | Context | Yes |
| Session start / end | user_id, device, session_duration, content_count, timestamp, geo | Yes | Yes |
| Subscription event | user_id, plan_type, payment_method, geo, timestamp | Yes | Context |
| Language / subtitle toggle | user_id, content_id, from_lang, to_lang, timestamp | Context | Yes |

---

### 4.2 · Viewer Profile & Segment Signals

Aggregated from the event stream, these are the persistent attributes used to build audience segments for ad targeting and user taste profiles for recommendations.

| Signal Category | Data Points | Update Frequency |
|---|---|---|
| Content affinity scores | Genre affinity (0–1.0): Drama, Action, Romance, Thriller, Comedy, Horror, Documentary | Every session |
| Language preference | Primary and secondary language, subtitle vs dubbed preference ratio | Daily |
| Device profile | Primary device, secondary device, time-on-device distribution | Daily |
| Viewing time patterns | Peak viewing hours (heatmap), weekday vs weekend ratio, avg session length | Daily |
| Binge behavior | Avg episodes per session, binge completion rate, series abandonment point | Per series |
| Content recency bias | Preference for new releases vs catalog, recency window in days | Weekly |
| Geographic & demo segment | City tier (metro/T2/T3), country, inferred age band, device price band | On login |
| Ad interaction profile | Ad completion rate, category affinity from ad clicks, skip latency average | Per session |
| Social signals | Content shared count, referral source (social/direct/organic) | Per session |
| Churn risk score | ML-computed probability (0–1.0), contributing signals, delta vs prior week | Daily |

---

### 4.3 · Ad Placement Intelligence Signals (AVOD / SSAI)

These data points are specific to the Viewership-Powered Ads pipeline and are used to optimize ad slot selection, audience targeting, and CPM maximization.

| Signal | Description | Dashboard Visualization |
|---|---|---|
| Contextual genre match score | How well the ad category aligns with the content being watched at insertion point (0–1.0) | Heatmap by content genre |
| Optimal ad break position | ML-predicted best insertion second within a content asset (engagement trough detection) | Timeline chart per asset |
| Audience segment CPM index | Effective CPM by audience segment — metro vs T2, language, device, time band | Ranked bar chart |
| Fill rate by slot type | Pre-roll vs mid-roll vs post-roll fill rate — live and historical | Stacked area chart |
| Ad completion rate by segment | Which audience segments complete ads most frequently (by genre context and slot) | Segment matrix table |
| Brand safety score | Content safety classification per asset (0–10) driving brand-safe ad eligibility | Asset-level badge |
| Frequency cap compliance | User-level ad frequency vs cap limit — daily unique ad impressions per user | Distribution histogram |
| Revenue per viewer session | Total ad revenue attributed per viewing session by content type and device | Trend line + bar |
| SSAI delivery health | Latency of server-side stitch, error rate, fallback rate — live operational metric | Status gauge + time series |
| First-party audience export | Segment size, estimated CPM premium vs. open exchange, available for DSP activation | Segment cards |

---

### 4.4 · Recommendation Engine Signals

These are the real-time and historical inputs that the recommendation ML model ingests, plus the explainability outputs that let the ChillingApp team understand why content is being surfaced to each user segment.

| Signal / Feature | Description | Model Weight (indicative) |
|---|---|---|
| Collaborative filter score | Similarity to users with matched taste profiles — weighted by recency | High (0.28) |
| Content-based affinity score | Embedding similarity between watched content and candidate content | High (0.24) |
| Trending score (platform-wide) | Velocity of plays in last 6h / 24h / 7d — normalized by catalog age | Medium (0.14) |
| Completion signal | Whether similar users completed the candidate content (churn predictor) | Medium (0.12) |
| Freshness score | Recency of content addition to catalog — decays over time | Low-Medium (0.08) |
| Language match score | Content language vs user primary/secondary language preference | High when relevant (0.10) |
| Thumbnail CTR (A/B) | Historical click-through rate per thumbnail variant shown to this user cohort | Medium (0.09) |
| Series continuation signal | Whether user is mid-series — elevates next-episode above all else | Contextual (0.95 when active) |
| Time-of-day affinity | Content genre preferred by user at this specific hour band (e.g., comedy at 10pm) | Medium (0.07) |
| Social proof signal | Content shared or rated highly by users in the same geo segment | Low (0.05) |
| Explicit feedback signal | Liked, disliked, or rated — overrides model output directly | Override |
| Cold start fallback | For new users: geo + device band defaults + trending (used for <5 sessions) | Active for new users |

---

## 05 · Dashboard — Screens & Modules

The dashboard is organized into five primary screens, each targeting a distinct role: ad operations, content strategy, product/data teams, and executive overview. All screens share a live data bar at the top showing platform-wide vitals.

| Screen / Module | Key Widgets & Charts | Data Sources / Signals |
|---|---|---|
| **0. Global Header** | Live active viewers counter, current DAU, total ad impressions today, total ad revenue today, platform health status (green/amber/red) | Real-time event stream, SSAI delivery API, session tracker |
| **1. Viewership Overview** | DAU/MAU trend (30d), session heatmap by hour × day, content starts by genre (treemap), device distribution (donut), geo distribution (India map + globe), top 10 trending content with velocity sparklines | Event stream aggregate, session DB, geo lookup |
| **2. Viewer Intelligence** | Audience segment builder (filter by genre, language, device, geo, churn risk), segment size indicator, cohort watch-time distribution, content completion funnel by segment, churn risk gauge per segment, LTV score distribution | Profile signal DB, ML scoring API, cohort engine |
| **3. Ads Performance** | CPM by segment (ranked bars), fill rate live gauge (pre/mid/post-roll), ad completion rate heatmap (segment × time), SSAI health status panel, contextual match score histogram, brand safety classification breakdown, daily revenue trend line, audience segment export interface | SSAI logs, ad server API, CPM feed, brand safety model |
| **4. Recommendation Engine** | Recommendation score explorer (pick any user ID to see ranked content + explanations), feature weight breakdown (radar chart), A/B thumbnail performance (side-by-side CTR), platform-wide genre distribution shift (weekly), series continuation rate by genre, cold start vs warm user distribution, recommendation acceptance rate trend | ML model API, A/B test engine, feature importance API |
| **5. Content Intelligence** | Top performing content by completion rate, content by churn-contribution score, content gap analysis (genre demand vs supply index), newly added vs catalog CPM comparison, language preference shift trend (6-month), content ROI index (cost vs ad revenue + engagement) | Content DB, completion events, ad revenue attribution |

---

## 06 · Key Widget Specifications

### 6.1 · Real-Time Viewership Heatmap

A 7×24 matrix (day × hour) showing content consumption intensity using a color gradient from cool (low activity) to warm (high activity). ChillingApp data will show characteristic spikes at 9–11pm IST on weekdays and 3–11pm IST on weekends, reflecting the diaspora evening viewing behavior.

- **X-axis:** Hour of day (0–23 IST)
- **Y-axis:** Day of week
- **Color:** Gradient from `#E8F5F0` (low) → `#0A7B8C` (medium) → `#F0A500` (peak)
- **Interaction:** Click any cell to drill into genre breakdown for that time band
- **Demo insight to highlight:** *"This is exactly the window your highest-CPM ads should run — the engine knows this automatically."*

---

### 6.2 · Audience Segment CPM Matrix

A ranked table of audience segments sorted by effective CPM, showing which viewer cohorts are worth most to advertisers. This is the core of the viewership-powered ads story.

| Segment Name | Size (est.) | Avg CPM | Completion Rate | Top Ad Category |
|---|---|---|---|---|
| Metro India · Hindi · Smart TV · 25–34 | ~12,400 | ₹185 | 78% | FMCG / Fashion |
| Diaspora UK · English+Hindi · Mobile · 28–40 | ~4,200 | ₹210 | 82% | Remittance / Travel |
| T2 India · Hindi · Android · 18–28 | ~28,600 | ₹75 | 65% | Ed-Tech / Finance |
| Metro India · Drama genre · Binge user | ~8,900 | ₹155 | 74% | Streaming / OTT |
| Diaspora UAE · Hindi · Smart TV · 30–45 | ~3,100 | ₹195 | 80% | Real Estate / Finance |
| T3 India · Regional · Low-data device | ~42,000 | ₹40 | 55% | Telecom / FMCG |

---

### 6.3 · Recommendation Explainability Panel

The most compelling demo widget. The operator enters any synthetic User ID and sees:

- Their computed taste profile (genre × language × device affinity radar)
- The top 8 recommended titles with confidence scores
- A feature contribution bar for each recommendation — *"Recommended because: 42% similar users, 28% genre affinity, 18% series continuation, 12% trending"*
- A 'What changed this week' section showing profile drift signals

> **Demo talking point:** *"Look — for User ID CH-4821, the model knows they watch Hindi thrillers on Friday evenings, tend to abandon romance content after episode 2, and are mid-way through a crime series. Every tile they see on their homescreen is built from exactly these signals. We deployed this in 8 weeks."*

---

### 6.4 · SSAI Health Monitor

A live operations panel showing server-side ad insertion health — critical for convincing technical buyers that the infrastructure is production-grade.

- Ad stitch latency (p50 / p95 / p99 in ms) — real-time gauge
- Error rate (stitch failures per 10,000 insertions) — SLA threshold line at 0.1%
- Fallback rate (times client-side fallback was triggered) — historical 24h trend
- Fill rate by slot type — live donut chart (pre-roll, mid-roll, post-roll)
- Ad revenue per minute of content — running total with 1-minute refresh

---

### 6.5 · Audience Segment Builder

An interactive filter panel enabling ad ops and content teams to define any arbitrary viewer cohort and immediately see its size and monetization value.

- **Filter dimensions:** Genre affinity (multi-select), Language (primary + secondary), Device type, Geo tier (metro/T2/T3/diaspora country), Age band, Churn risk range (slider 0–1.0), Plan type (SVOD/AVOD), Viewing frequency (casual/regular/binge)
- **Live outputs:** Estimated segment size (with ± confidence range), Average CPM for segment, Segment completion rate, Recommended top 3 ad categories for this cohort
- **Actions:** Export segment definition as JSON for DSP activation; Save segment with custom label; Compare two segments side-by-side
- **Demo interaction:** Build the segment "Metro India · Hindi · Smart TV · 25–34" live in <30 seconds and arrive at ₹185 CPM with 12,400 users

---

### 6.6 · Content Gap Analysis Chart

A dual-axis chart showing the ratio of genre demand (measured by search queries + watchlist adds with no available content) versus genre supply (titles available in catalog).

- **X-axis:** Content genre
- **Primary Y-axis (bars):** Demand index (normalized to 1.0)
- **Secondary Y-axis (line):** Supply index (normalized to 1.0)
- **Gap indicator:** Color-coded overlay — red if demand/supply ratio >1.5×, green if balanced
- **Demo headline metric:** "Romance demand is 2.4× supply right now — your next commission decision is in this chart."
- **Interaction:** Click any genre bar to see top 10 most-searched titles with zero results

---

### 6.7 · Churn Risk Panel

A cohort-level view of subscriber churn probability, enabling proactive retention campaigns.

- **Risk distribution:** Histogram of churn risk scores (0–1.0) across all active users
- **High-risk cohort:** Users with score >0.70 — count, segment breakdown, avg watch-time decline vs prior 14 days
- **Trigger signals:** Top 5 contributing factors to current high-risk cohort (e.g., "3+ session gaps in 7 days", "abandoned series at episode 2", "no new content in preferred genre added this week")
- **Cohort drill-down:** Click any risk band to see genre, device, geo breakdown
- **Demo user highlight:** CH-7733 (T2 Jaipur · churn risk 0.72) — visible as a named example with full signal breakdown

---

## 07 · Data Refresh Matrix

Different data types have different freshness requirements. This table defines the expected refresh cadence for each widget group.

| Widget / Data Type | Refresh Interval | Mechanism | Demo Simulation |
|---|---|---|---|
| Global header vitals (active viewers, impressions, revenue) | 10 seconds | WebSocket push | Synthetic counter with realistic variance |
| SSAI health metrics (latency, error rate) | 30 seconds | Polling | Pre-scripted fluctuation pattern |
| Viewership heatmap | 5 minutes | Polling | Static synthetic snapshot, updates on interaction |
| CPM matrix & fill rate | 5 minutes | Polling | Slow drift ±3% to simulate live market |
| Segment builder results | On-demand | REST API call | <3s query against pre-indexed synthetic data |
| Recommendation panel (per user ID) | On-demand | REST API call | <1s from pre-seeded result cache |
| Churn risk scores | Daily refresh | Batch pipeline | Fixed daily snapshot in demo |
| Content gap analysis | Daily refresh | Batch pipeline | Fixed daily snapshot in demo |
| Trend sparklines (top 10 content) | 1 hour | Batch pipeline | Pre-scripted sparkline data |

---

## 08 · Demo Flow — 8-Minute Walkthrough Script

The dashboard is built to support a structured 8-minute demo narrative. Each screen has one primary "wow moment" that converts curiosity into a follow-up conversation.

| Minute | Screen | Action | Talking Point |
|---|---|---|---|
| 0:00 – 1:00 | Global Header | Show live vitals | *"This is ChillingApp's platform — 12,000 active viewers right now, ₹28,400 in ad revenue today, zero infrastructure alerts."* |
| 1:00 – 2:30 | Viewership Overview | Show heatmap + geo map | *"See these 9–11pm spikes? That's not random — it's the optimal ad window. The system knows this. Your campaigns run here automatically."* |
| 2:30 – 4:00 | Viewer Intelligence | Build live segment: metro + Hindi + Smart TV + 25–34 | *"In 3 clicks I've isolated 12,000 viewers worth ₹185 CPM. Your DSP has never given you this. This is your own first-party intelligence."* |
| 4:00 – 5:30 | Ads Performance | Show CPM matrix + SSAI health | *"₹210 CPM for UK diaspora — and zero buffering on ad delivery. That's SSAI. No breaks, no rebuffers. Advertisers pay premium for this."* |
| 5:30 – 7:00 | Recommendation Engine | Enter User ID CH-4821, show recommendations | *"The model recommended a Hindi crime thriller because 42% of similar users completed it, and this user is 3 episodes into the same director's prior series. That's not a guess — it's a signal stack."* |
| 7:00 – 8:00 | Content Intelligence | Show content gap chart | *"Romance demand is 2.4× supply right now. Your next commission decision is in this chart."* |

### Objection Handling — Quick Responses

| Prospect Objection | Suggested Response |
|---|---|
| "How is this different from Google Analytics?" | "GA tells you what happened. This tells you *why* — and what the model is doing about it, in real time." |
| "Can this connect to our existing ad server?" | "Yes — the SSAI layer is HLS-compatible. It integrates with any ad server via VAST/VMAP. We can show you the connector architecture." |
| "What about data privacy / DPDP compliance?" | "All signals are first-party — no third-party cookies. Profile data stays in your data warehouse. We design the export layer to meet DPDP requirements." |
| "How long to go live?" | "Demo-quality like this in 6 weeks. Production-quality with your live Muvi data in 10–12 weeks." |

---

## 09 · Technical Architecture

The dashboard is a Next.js / React frontend backed by a streaming analytics stack. All data ingestion is event-driven. The architecture is cloud-native and deployable on AWS or Azure.

| Layer | Component | Technology Choice | Notes |
|---|---|---|---|
| Event ingestion | Viewer event collector | AWS Kinesis / Apache Kafka | Sub-100ms event publish |
| Stream processing | Real-time aggregation | Apache Flink / Spark Streaming | Computes rolling window metrics |
| Data store — hot | Real-time metrics DB | Apache Druid / ClickHouse | Sub-second dashboard queries |
| Data store — warm | User profile & segment store | PostgreSQL + Redis cache | Profile lookups <10ms |
| ML serving | Recommendation API | Python FastAPI + ONNX model | P99 <80ms inference |
| ML serving | Ad targeting score API | Python FastAPI | Batch + real-time scoring |
| Ad insertion | SSAI engine | AWS MediaTailor / custom SSAI | HLS-compatible, sub-200ms stitch |
| Dashboard frontend | Admin UI | Next.js 14 + TailwindCSS | Chart.js / Recharts for viz |
| Auth & access control | Role-based access | Auth0 / AWS Cognito | Ad Ops / Content / Executive roles |
| Demo environment | Synthetic data layer | Node.js seeder + Faker.js | ChillingApp-realistic data at scale |

### Architecture Data Flow

```
Viewer Action on ChillingApp
        │
        ▼
Event Collector (Kinesis / Kafka)
        │
        ├──► Stream Processor (Flink) ──► ClickHouse (hot metrics)
        │                                        │
        │                                        ▼
        │                               Dashboard Frontend (Next.js)
        │                                        ▲
        ├──► Profile Builder (Spark) ──► PostgreSQL + Redis
        │                                        │
        └──► ML Pipeline                         │
              ├── Recommendation Model (ONNX) ───┤
              └── Ad Targeting Model (FastAPI) ──┘
                          │
                          ▼
                    SSAI Engine (MediaTailor)
                          │
                          ▼
                  Ad served into stream
```

### API Shape — Key Endpoints

The following REST endpoints are required by the frontend. All return JSON with a `data` envelope and a `meta.refreshed_at` timestamp.

| Endpoint | Method | Description | Target Response Time |
|---|---|---|---|
| `/api/vitals` | GET | Global header counters — active viewers, DAU, impressions, revenue | <200ms |
| `/api/viewership/heatmap` | GET | 7×24 activity matrix, query params: `?tz=IST` | <500ms |
| `/api/viewership/trending` | GET | Top 10 content with velocity sparklines, 7-day window | <500ms |
| `/api/segments/query` | POST | Segment builder — accepts filter JSON, returns size + CPM + completion | <3s |
| `/api/segments/:id/export` | GET | Download segment definition as JSON for DSP | <1s |
| `/api/ads/cpm-matrix` | GET | Ranked CPM table by segment | <500ms |
| `/api/ads/ssai-health` | GET | SSAI latency, error rate, fallback rate — current window | <200ms |
| `/api/recommend/:user_id` | GET | Top 8 recommendations with feature contribution bars | <1s |
| `/api/content/gap-analysis` | GET | Genre demand vs supply index | <500ms |
| `/api/content/churn-contribution` | GET | Top content by churn-contribution score | <500ms |

---

## 10 · Design System

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#0A7B8C` | Primary actions, active states, chart primary series |
| `--color-accent` | `#F0A500` | Peak indicators, alerts, highlight callouts |
| `--color-surface-low` | `#E8F5F0` | Heatmap low-activity, card backgrounds |
| `--color-success` | `#2ECC71` | Health status green, positive deltas |
| `--color-warning` | `#F39C12` | Amber health state, churn risk medium |
| `--color-danger` | `#E74C3C` | Red health state, churn risk high, SLA breach |
| `--color-neutral-900` | `#1A1A2E` | Primary text, dark backgrounds |
| `--color-neutral-100` | `#F4F6F8` | Page background |

### Typography

- **Headings:** Inter or Poppins — 600 weight
- **Data values / metrics:** Tabular-numeric font (JetBrains Mono or IBM Plex Mono) to keep number columns aligned
- **Body / labels:** Inter — 400/500 weight

### Layout Principles

- **Primary display target:** 1440×900 laptop screen (demo on expo floor)
- **Secondary:** 1920×1080 external monitor (for larger expo booth displays)
- **Sidebar navigation:** 240px fixed width; icon + label; collapses to 64px icon-only mode
- **Global header bar:** 64px fixed top; always visible across all screens
- **Chart containers:** Minimum 300px height; all charts must render meaningful data at 768px wide
- **Empty / loading states:** Every chart must show a skeleton loader — no blank white boxes during data fetch

---

## 11 · User Roles & Access Model

| Role | Screens Accessible | Write Access | Demo Persona |
|---|---|---|---|
| Executive / CEO | Global Header, Viewership Overview, Ads Performance (summary), Content Intelligence | None (read-only) | "The revenue view" |
| Ad Operations Manager | All Ads Performance, Viewer Intelligence, Global Header | Segment export, ad schedule | "The monetization engine" |
| Content Strategist | Content Intelligence, Viewership Overview, Recommendation Engine (read) | Content tagging | "The content ROI view" |
| Data / ML Engineer | All screens + API explorer, Feature weight tuner, Model version dashboard | Model config, threshold tuning | "The AI engine room" |
| TheNineHertz Demo User | All screens (read-only, synthetic data) | None | Expo walkthrough persona |

---

## 12 · Build Plan — Sprint Roadmap

The dashboard is designed to be built in **6 weeks** for the demo-ready version, with a production handover path for ChillingApp or any client who converts post-expo.

| Sprint | Timeline | Deliverables | Owner |
|---|---|---|---|
| Sprint 0 | Week 1 | Project setup, AWS infra provisioning, synthetic data schema design, ChillingApp catalog scrape for realistic content IDs and genre mapping | 9H Engineering |
| Sprint 1 | Weeks 1–2 | Event ingestion pipeline (Kinesis → Flink → ClickHouse), viewer profile builder, real-time session tracker, data seeder for 50,000 synthetic users | 9H Backend |
| Sprint 2 | Weeks 2–3 | Dashboard frontend scaffold (Next.js), Global Header (live counters), Viewership Overview screen (heatmap, geo map, genre treemap) | 9H Frontend |
| Sprint 3 | Weeks 3–4 | Viewer Intelligence screen (segment builder, churn risk), Ads Performance screen (CPM matrix, SSAI health panel, fill rate charts) | 9H Full-stack |
| Sprint 4 | Weeks 4–5 | Recommendation Engine screen (explainability panel, feature weights radar), Content Intelligence screen, A/B thumbnail CTR view | 9H ML + Frontend |
| Sprint 5 | Week 6 | Demo polish (synthetic data tuning, ChillingApp branding, demo script integration, role-based access), QA, deployment to demo URL, walkthrough rehearsal | 9H Full-stack + PM |
| Post-expo | Month 2+ | Production data connector (real Muvi API integration), live SSAI hookup, model training on real events, client handover documentation | 9H + ChillingApp tech |

### Phase 2 Roadmap (Post-Expo — for prospect conversations)

These features are out of scope for Convergence India but should be referenced in sales conversations as committed follow-on capabilities:

| Feature | Description | Est. Timeline |
|---|---|---|
| Predictive budget allocation | Recommends optimal ad budget distribution across segments based on projected CPM and fill rate | Month 3 |
| DSP connector | One-click export of first-party audience segments to Google DV360, The Trade Desk, or any DSP via ID sync | Month 3–4 |
| Content commission intelligence | Ranks proposed content acquisitions by projected engagement score and ad revenue lift | Month 4 |
| Automated churn intervention | Triggers personalized push notification or content recommendation to high-risk users without manual action | Month 4–5 |
| Multi-platform SSAI | Extends SSAI health monitoring and ad insertion to Samsung Smart TV and Amazon Fire TV app layers | Month 5–6 |

---

## 13 · Acceptance Criteria

### Demo Readiness (must pass before Convergence India)

- [ ] All 5 screens load and render synthetic data within 2 seconds on a standard laptop on 4G hotspot
- [ ] Recommendation explainability panel shows results for any of 50 pre-seeded User IDs within 1 second
- [ ] SSAI health panel shows simulated live metrics updating every 30 seconds
- [ ] Segment builder returns cohort size and CPM estimate within 3 seconds for any filter combination
- [ ] All charts and tables are ChillingApp-branded (logo, color palette consistent with chillingapp.com)
- [ ] Demo URL is publicly accessible (no login required for read-only demo mode)
- [ ] Global header vitals update every 10 seconds with realistic synthetic variance
- [ ] Content gap analysis correctly shows Romance demand at 2.4× supply
- [ ] All 5 pre-seeded demo user IDs (CH-4821, CH-1104, CH-7733, CH-2290, CH-5561) return full profiles in the recommendation panel
- [ ] Dashboard renders correctly at 1440×900 and 1920×1080 with no layout breaks
- [ ] Offline fallback: dashboard functions from cached data for at least 10 minutes without an internet connection

### Production Readiness (post-demo, for client delivery)

- [ ] Event pipeline processes 10,000+ events/second without dropped messages
- [ ] Dashboard queries return in <1s for 90-day windows on 1M+ user dataset
- [ ] Recommendation API serves inference at P99 <80ms under 500 concurrent requests
- [ ] SSAI latency for ad stitch is <200ms at P95
- [ ] Role-based access control enforces screen-level and data-level isolation
- [ ] All synthetic data is fully replaced with live data with zero dashboard code changes

---

## 14 · Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Synthetic data feels unrealistic to OTT-savvy prospects | Medium | High | Model data on real OTT benchmark reports (FICCI, EY). Use ChillingApp catalog titles. Pre-brief 9H team on data narrative. |
| Dashboard load time on expo WiFi | Medium | Medium | Pre-cache all dashboard views, use a local Node.js server as fallback, avoid live API calls during demo. |
| Muvi API rate limits prevent real data integration | Low | Medium | Use synthetic data for demo; design connector as a plug-in layer that can swap post-client signup. |
| Prospect asks for feature not in scope | High | Low | Direct to Phase 2 roadmap (§12). Prepare a one-page roadmap card showing next 90-day features. |
| ChillingApp team unavailable for brand approval | Low | Low | Use ChillingApp's public colors from website and add a disclaimer that this is a demonstration build. |
| Expo internet outage | Low | High | Deploy a full offline-capable version (PWA or Electron wrapper) as contingency. All charts use pre-cached data. |
| Demo device theft / damage on expo floor | Low | High | Maintain a second device pre-configured and a QR code to the hosted demo URL as a third fallback. |

---

## Appendix A · Synthetic Data Seeding Spec

For the demo to feel real, the synthetic dataset must be seeded with the following parameters:

```json
{
  "users": 50000,
  "active_last_30d": 12400,
  "content_titles": 847,
  "genres": ["Drama", "Action", "Romance", "Thriller", "Comedy", "Horror", "Documentary", "Family"],
  "languages": ["Hindi", "Tamil", "Telugu", "Kannada", "Bengali", "Marathi", "English"],
  "devices": ["Android Mobile", "iOS", "Web Browser", "Amazon Fire TV", "Samsung Smart TV"],
  "geo_distribution": {
    "India Metro": 0.38,
    "India T2/T3": 0.31,
    "UAE": 0.11,
    "UK": 0.09,
    "USA": 0.07,
    "Other": 0.04
  },
  "peak_viewing_window": "21:00–23:00 IST",
  "avg_session_duration_mins": 42,
  "avg_daily_ad_revenue_inr": 28400,
  "top_cpm_segment": "Diaspora UK · Hindi · Mobile · 28–40 — ₹210 CPM",
  "churn_risk_distribution": {
    "low_0_to_0.3": 0.62,
    "medium_0.3_to_0.7": 0.28,
    "high_0.7_to_1.0": 0.10
  },
  "series_continuation_active_pct": 0.34,
  "cold_start_users_pct": 0.08
}
```

### Content Seeding Guidelines

- Use real ChillingApp catalog genre and title structure where available from the public website
- Series titles: generate 3–6 episode ranges per web series, with realistic episode completion drop-off curves (expect 20–30% drop at episode 3 for new series)
- Content release dates: spread across 36-month window; 15% of titles should be "added in last 30 days" to make freshness signal visible
- Ad inventory: seed 40–60 distinct ad creatives across 8 ad categories (FMCG, Fashion, Finance, Ed-Tech, Telecom, Travel, Real Estate, OTT)

---

## Appendix B · Key Demo User IDs (Pre-Seeded)

| User ID | Profile Summary | Best demo use case |
|---|---|---|
| CH-4821 | Metro Delhi · Hindi Thriller binge · Smart TV · Mid-series | Recommendation explainability |
| CH-1104 | UK diaspora · Hindi + English · Mobile · High LTV | CPM segment + ad completion |
| CH-7733 | T2 Jaipur · Regional Drama · Android · Churn risk 0.72 | Churn risk panel |
| CH-2290 | UAE · Hindi + Malayalam · Smart TV · New subscriber | Cold start recommendation |
| CH-5561 | Mumbai Metro · Comedy + Romance · iOS · Ad-averse | Frequency cap + ad skip analysis |

### Extended Pre-Seeded Users (supporting cast for segment builder demos)

| User ID | Profile Summary | Segment Demo |
|---|---|---|
| CH-3310 | Bengaluru Metro · Tamil + Kannada · Smart TV · 30–40 | South India language segment |
| CH-8802 | USA diaspora · Hindi · Web Browser · 25–35 · High churn risk | Diaspora high-risk cohort |
| CH-6145 | T3 Bihar · Hindi · Android · Low-data device · AVOD | T3 AVOD monetization |
| CH-1977 | London diaspora · English + Hindi · iOS · SVOD · High binge | Premium subscriber profile |
| CH-4400 | Mumbai Metro · Action + Thriller · Web · 18–24 · New user | Gen-Z acquisition funnel |

---

*Prepared by TheNineHertz — Delivery & AI Practice*
*theninehertz.com · HQ: Jaipur, India · Offices: Saudi Arabia & UAE*
*Convergence India 2026 · March 23–25 · Bharat Mandapam, New Delhi*
