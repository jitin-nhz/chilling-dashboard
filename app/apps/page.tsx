"use client";

import Link from "next/link";
import { Mic2, ScanLine, ImagePlay, ArrowRight, Zap } from "lucide-react";

const apps = [
  {
    id: "dubbing",
    title: "AI Realtime Dubbing",
    description: "Dub any content clip into 29 languages using ElevenLabs multilingual AI. Live synthesis with pipeline visualizer.",
    icon: Mic2,
    techBadge: "ElevenLabs · eleven_multilingual_v2",
    status: "live" as const,
    href: "/apps/dubbing",
    accentColor: "#0A7B8C",
  },
  {
    id: "scene-seg",
    title: "AI Scene Segmentation",
    description: "Automatically detect content boundaries and engagement troughs for smarter mid-roll ad placement.",
    icon: ScanLine,
    techBadge: "Computer Vision · Frame Analysis",
    status: "soon" as const,
    href: null,
    accentColor: "#9B59B6",
  },
  {
    id: "thumbnail-gen",
    title: "Smart Thumbnail Generator",
    description: "Generate and A/B test thumbnails using generative AI — optimised per audience segment for maximum CTR.",
    icon: ImagePlay,
    techBadge: "Generative AI · Stable Diffusion",
    status: "soon" as const,
    href: null,
    accentColor: "#F0A500",
  },
];

export default function AppsGallery() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold" style={{ color: "#1A1A2E" }}>Apps</h1>
        <p className="text-sm mt-1" style={{ color: "#64748B" }}>
          POC Gallery — AI-powered tools built on top of the ChillingApp data platform
        </p>
      </div>

      {/* Apps grid */}
      <div className="grid grid-cols-3 gap-6">
        {apps.map((app) => {
          const Icon = app.icon;
          const isLive = app.status === "live";

          const card = (
            <div
              key={app.id}
              className="rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200"
              style={{
                background: "#FFFFFF",
                border: `1px solid ${isLive ? "rgba(10, 123, 140, 0.25)" : "#E0E4EA"}`,
                opacity: isLive ? 1 : 0.6,
                boxShadow: isLive ? "0 2px 12px rgba(10,123,140,0.08)" : "none",
                cursor: isLive ? "pointer" : "default",
              }}
            >
              {/* Icon + status */}
              <div className="flex items-start justify-between">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${app.accentColor}15` }}
                >
                  <Icon size={22} style={{ color: app.accentColor }} />
                </div>
                {isLive ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                    style={{ background: "rgba(22,163,74,0.1)", color: "#16A34A", border: "1px solid rgba(22,163,74,0.25)" }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-dot" />
                    Live Demo
                  </div>
                ) : (
                  <div className="px-2.5 py-1 rounded-full text-[10px] font-medium"
                    style={{ background: "#F0F2F5", color: "#94A3B8", border: "1px solid #E0E4EA" }}>
                    Coming Soon
                  </div>
                )}
              </div>

              {/* Title + description */}
              <div>
                <h2 className="text-base font-bold mb-1.5" style={{ color: "#1A1A2E" }}>{app.title}</h2>
                <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{app.description}</p>
              </div>

              {/* Tech badge */}
              <div className="flex items-center gap-1.5">
                <Zap size={11} style={{ color: app.accentColor }} />
                <span className="text-[11px] font-medium" style={{ color: app.accentColor }}>{app.techBadge}</span>
              </div>

              {/* CTA */}
              {isLive && (
                <div className="flex items-center gap-1.5 text-sm font-semibold mt-auto pt-2"
                  style={{ color: app.accentColor, borderTop: "1px solid #F0F2F5" }}>
                  Launch app
                  <ArrowRight size={15} />
                </div>
              )}
            </div>
          );

          return isLive ? (
            <Link key={app.id} href={app.href!} className="block hover:-translate-y-0.5 transition-transform">
              {card}
            </Link>
          ) : (
            <div key={app.id}>{card}</div>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="text-xs" style={{ color: "#94A3B8" }}>
        Apps are experimental POCs built by TheNineHertz to demonstrate AI capabilities on top of the ChillingApp platform.
      </p>
    </div>
  );
}
