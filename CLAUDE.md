# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **ChillingApp AI Analytics Dashboard** — a demo-first admin dashboard for an OTT streaming platform built by TheNineHertz. The primary purpose is a **live demo at Convergence India 2026 (March 23–25, Bharat Mandapam, New Delhi)** using realistic synthetic data for 50,000 users. See [PRD.md](PRD.md) for full specifications.

## Target Tech Stack (per PRD)

- **Frontend:** Next.js 14 + TailwindCSS, Recharts or Chart.js for visualizations
- **Backend/API:** Python FastAPI for ML serving endpoints
- **Data stores:** ClickHouse (hot/real-time metrics), PostgreSQL + Redis (user profiles)
- **Synthetic data seeder:** Node.js + Faker.js
- **Auth:** Auth0 or AWS Cognito (role-based)

## Dashboard Screens

Five primary screens plus a global header:

| # | Screen | Primary Purpose |
|---|---|---|
| 0 | Global Header | Live platform vitals (DAU, ad revenue, health status) |
| 1 | Viewership Overview | DAU/MAU trends, session heatmap (7×24), geo distribution |
| 2 | Viewer Intelligence | Audience segment builder, churn risk, LTV scoring |
| 3 | Ads Performance | CPM by segment, SSAI health, fill rate, ad completion |
| 4 | Recommendation Engine | Per-user explainability panel, feature weight radar, A/B CTR |
| 5 | Content Intelligence | Completion rates, content gap analysis, content ROI index |

## Key Design Constraints

- **Demo URL must be publicly accessible** (no login for read-only demo mode)
- All screens must load within **2 seconds** on 4G
- Recommendation explainability must respond within **1 second** for pre-seeded user IDs
- SSAI health panel refreshes every **30 seconds** (simulated live)
- Segment builder returns results within **3 seconds** for any filter combo

## Synthetic Data Parameters

Seed per `PRD.md` Appendix A:
- 50,000 total users, ~12,400 active in last 30 days
- 847 content titles across 8 genres, 7 languages, 5 device types
- Peak viewing window: 21:00–23:00 IST
- Avg daily ad revenue: ₹28,400
- Top CPM segment: UK Diaspora · Hindi · Mobile · 28–40 → ₹210 CPM

## Pre-Seeded Demo User IDs

| User ID | Profile | Demo Use Case |
|---|---|---|
| CH-4821 | Metro Delhi · Hindi Thriller · Smart TV · mid-series | Recommendation explainability |
| CH-1104 | UK diaspora · Hindi+English · Mobile · High LTV | CPM segment + ad completion |
| CH-7733 | T2 Jaipur · Regional Drama · Android · Churn risk 0.72 | Churn risk panel |
| CH-2290 | UAE · Hindi+Malayalam · Smart TV · New subscriber | Cold start recommendation |
| CH-5561 | Mumbai Metro · Comedy+Romance · iOS · Ad-averse | Frequency cap + ad skip analysis |

## ChillingApp Branding

Colors specified in PRD for the viewership heatmap (and consistent with chillingapp.com):
- Low activity: `#E8F5F0`
- Medium activity: `#0A7B8C`
- Peak activity: `#F0A500`

## Audience Segment CPM Reference

Key segments for the CPM matrix widget (pre-populated synthetic values):
- Metro India · Hindi · Smart TV · 25–34 → ₹185 CPM
- Diaspora UK · English+Hindi · Mobile · 28–40 → ₹210 CPM
- T2 India · Hindi · Android · 18–28 → ₹75 CPM
- Diaspora UAE · Hindi · Smart TV · 30–45 → ₹195 CPM
- T3 India · Regional · Low-data device → ₹40 CPM

## Recommendation Engine Feature Weights

Used to render the explainability panel and radar chart:
- Collaborative filter: 0.28
- Content-based affinity: 0.24
- Trending score: 0.14
- Completion signal: 0.12
- Language match: 0.10
- Thumbnail CTR: 0.09
- Freshness score: 0.08
- Time-of-day affinity: 0.07
- Social proof: 0.05
- Series continuation: contextual override (0.95 when active)
- Explicit feedback: direct override
