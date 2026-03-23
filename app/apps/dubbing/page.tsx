"use client";

import { useState, useRef, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import {
  Mic2, Globe, Play, Pause, Download, CheckCircle2,
  Loader2, Radio, Volume2, ArrowRight, Languages,
} from "lucide-react";

// ── Content clips with sample scripts ─────────────────────────────────────────
const CLIPS = [
  {
    id: "st5",
    title: "Stranger Things S5",
    genre: "Sci-Fi",
    duration: "0:08",
    script: "The Upside Down is spreading. We don't have much time. We need to close the gate before it's too late.",
  },
  {
    id: "sg3",
    title: "Squid Game S3",
    genre: "Thriller",
    duration: "0:07",
    script: "You came back. I knew you would. The game is different this time. Are you ready to play?",
  },
  {
    id: "wed2",
    title: "Wednesday S2",
    genre: "Horror",
    duration: "0:09",
    script: "I find human emotions to be an unnecessary inconvenience. Yet somehow, you've managed to surprise me.",
  },
  {
    id: "sev2",
    title: "Severance S2",
    genre: "Sci-Fi",
    duration: "0:08",
    script: "Your outie doesn't remember this conversation. But I do. That's what makes me dangerous.",
  },
];

// ── Languages ─────────────────────────────────────────────────────────────────
const LANGUAGES = [
  { label: "English", code: "en", flag: "🇺🇸" },
  { label: "Spanish", code: "es", flag: "🇪🇸" },
  { label: "Korean", code: "ko", flag: "🇰🇷" },
  { label: "French", code: "fr", flag: "🇫🇷" },
  { label: "German", code: "de", flag: "🇩🇪" },
  { label: "Japanese", code: "ja", flag: "🇯🇵" },
  { label: "Portuguese", code: "pt", flag: "🇧🇷" },
  { label: "Hindi", code: "hi", flag: "🇮🇳" },
  { label: "Italian", code: "it", flag: "🇮🇹" },
  { label: "Dutch", code: "nl", flag: "🇳🇱" },
];

// All 29 supported language codes for the coverage matrix
const ALL_SUPPORTED = ["en","es","ko","fr","de","ja","pt","hi","ar","nl","it","pl","tr","sv","da","no","fi","uk","cs","el","ro","hu","bg","ms","sk","hr","tl","ta","id"];

type Stage = "idle" | "asr" | "nmt" | "tts" | "render" | "done";

interface LatencyEntry { call: string; ms: number }

const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";

export default function DubbingPOC() {
  const [selectedClip, setSelectedClip] = useState(CLIPS[0]);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[1]); // Spanish default
  const [stage, setStage] = useState<Stage>("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [synthTime, setSynthTime] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stageTimes, setStageTimes] = useState<Record<string, number>>({});
  const [latencyHistory, setLatencyHistory] = useState<LatencyEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const callCount = useRef(0);

  const handleDub = useCallback(async () => {
    if (stage === "asr" || stage === "nmt" || stage === "tts" || stage === "render") return;

    setError(null);
    setAudioUrl(null);
    setSynthTime(null);
    setTranslatedText(null);
    setIsPlaying(false);
    setStageTimes({});

    const start = Date.now();
    const times: Record<string, number> = {};

    // ASR stage (simulated — source language detection)
    setStage("asr");
    await new Promise(r => setTimeout(r, 160 + Math.random() * 80));
    times.asr = Date.now() - start;

    // NMT stage — real translation via MyMemory API
    setStage("nmt");
    let textToSynth = selectedClip.script;
    try {
      // Skip translation if target is English
      if (selectedLang.code !== "en") {
        const transRes = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(selectedClip.script)}&langpair=en|${selectedLang.code}`
        );
        const transData = await transRes.json();
        const translated = transData?.responseData?.translatedText;
        if (translated && transData.responseStatus === 200) {
          textToSynth = translated;
          setTranslatedText(translated);
        }
      }
    } catch {
      // Translation failed — fall back to English, still produce audio
    }
    times.nmt = Date.now() - start;

    // TTS stage — real ElevenLabs API call with translated text
    setStage("tts");
    try {
      const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128&optimize_streaming_latency=3`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": apiKey ?? "",
          },
          body: JSON.stringify({
            text: textToSynth,
            model_id: "eleven_multilingual_v2",
            language_code: selectedLang.code,
            voice_settings: { stability: 0.5, similarity_boost: 0.75, speed: 1.0 },
          }),
        }
      );

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`ElevenLabs API error ${res.status}: ${msg}`);
      }

      const blob = await res.blob();
      times.tts = Date.now() - start;

      // Audio render stage (brief finalization)
      setStage("render");
      await new Promise(r => setTimeout(r, 80 + Math.random() * 60));
      times.render = Date.now() - start;

      const url = URL.createObjectURL(blob);
      const totalMs = Date.now() - start;

      setAudioUrl(url);
      setSynthTime(totalMs);
      setStageTimes(times);
      setStage("done");

      // Update latency history
      callCount.current += 1;
      setLatencyHistory(prev => {
        const next = [...prev, { call: `#${callCount.current}`, ms: totalMs }];
        return next.slice(-8);
      });

      // Auto-play
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err: unknown) {
      setStage("idle");
      setError(err instanceof Error ? err.message : "Dubbing failed. Check API key.");
    }
  }, [selectedClip, selectedLang, stage]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stageInfo = [
    { key: "asr", label: "ASR", sublabel: "Speech Recognition", detail: "Source: English detected" },
    {
      key: "nmt", label: "NMT", sublabel: "MyMemory Neural Translation",
      detail: translatedText
        ? `"${translatedText.slice(0, 48)}…"`
        : `en → ${selectedLang.code} (${selectedLang.label})`,
    },
    { key: "tts", label: "TTS Synthesis", sublabel: "ElevenLabs multilingual_v2", detail: `Voice: ${VOICE_ID.slice(0, 8)}…` },
    { key: "render", label: "Audio Render", sublabel: "Output format", detail: "mp3_44100_128" },
  ];

  const stageOrder: Stage[] = ["asr", "nmt", "tts", "render", "done"];
  const getStageStatus = (key: string): "idle" | "active" | "done" => {
    if (stage === "idle") return "idle";
    if (stage === "done") return "done";
    const currentIdx = stageOrder.indexOf(stage);
    const stageIdx = stageOrder.indexOf(key as Stage);
    if (stageIdx < currentIdx) return "done";
    if (stageIdx === currentIdx) return "active";
    return "idle";
  };

  const stageColor = (s: "idle" | "active" | "done") =>
    s === "done" ? "#16A34A" : s === "active" ? "#0A7B8C" : "#E0E4EA";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Mic2 size={18} style={{ color: "#0A7B8C" }} />
            <h1 className="text-xl font-bold" style={{ color: "#1A1A2E" }}>AI Realtime Dubbing</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ background: "rgba(22,163,74,0.1)", color: "#16A34A", border: "1px solid rgba(22,163,74,0.25)" }}>
              Live Demo
            </span>
          </div>
          <p className="text-sm" style={{ color: "#64748B" }}>
            ElevenLabs <span className="font-medium" style={{ color: "#0A7B8C" }}>eleven_multilingual_v2</span> · 29 languages · Real synthesis
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Languages Supported" value="29" icon={<Globe size={16} />} />
        <StatCard label="Model" value="multilingual_v2" icon={<Radio size={16} />} accent="#9B59B6" />
        <StatCard
          label="Last Synthesis"
          value={synthTime ? `${(synthTime / 1000).toFixed(2)}s` : "—"}
          icon={<Mic2 size={16} />}
          accent="#F0A500"
        />
        <StatCard label="Active Dub Streams" value="3,840" delta="+12% vs yesterday" deltaType="up" icon={<Volume2 size={16} />} accent="#16A34A" />
      </div>

      {/* Main 3-col layout */}
      <div className="grid grid-cols-3 gap-4">

        {/* Left — Content + Language Selector */}
        <Card>
          <CardHeader title="Content Clip" subtitle="Select a clip to dub" />
          <div className="space-y-2 mb-4">
            {CLIPS.map(clip => (
              <button key={clip.id} onClick={() => { setSelectedClip(clip); setAudioUrl(null); setStage("idle"); setStageTimes({}); setTranslatedText(null); }}
                className="w-full text-left p-3 rounded-lg transition-all"
                style={{
                  background: selectedClip.id === clip.id ? "rgba(10,123,140,0.08)" : "#F0F2F5",
                  border: selectedClip.id === clip.id ? "1px solid rgba(10,123,140,0.3)" : "1px solid #E0E4EA",
                }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold" style={{ color: "#1A1A2E" }}>{clip.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{ background: "rgba(10,123,140,0.1)", color: "#0A7B8C" }}>{clip.genre}</span>
                </div>
                <p className="text-[10px] leading-relaxed" style={{ color: "#64748B" }}>&ldquo;{clip.script.slice(0, 60)}…&rdquo;</p>
              </button>
            ))}
          </div>

          <div className="mb-4">
            <label className="text-xs font-medium mb-2 block" style={{ color: "#64748B" }}>
              <Languages size={11} className="inline mr-1" />
              Target Language
            </label>
            <div className="flex flex-wrap gap-1.5">
              {LANGUAGES.map(lang => (
                <button key={lang.code} onClick={() => { setSelectedLang(lang); setAudioUrl(null); setStage("idle"); setTranslatedText(null); }}
                  className="px-2 py-1 rounded-full text-[11px] font-medium transition-all"
                  style={{
                    background: selectedLang.code === lang.code ? "rgba(10,123,140,0.1)" : "#F0F2F5",
                    color: selectedLang.code === lang.code ? "#0A7B8C" : "#64748B",
                    border: selectedLang.code === lang.code ? "1px solid rgba(10,123,140,0.4)" : "1px solid #E0E4EA",
                  }}>
                  {lang.flag} {lang.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleDub}
            disabled={stage === "asr" || stage === "nmt" || stage === "tts" || stage === "render"}
            className="w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
            style={{
              background: (stage === "asr" || stage === "nmt" || stage === "tts" || stage === "render")
                ? "#F0F2F5" : "linear-gradient(135deg, #0A7B8C, #0D9BAF)",
              color: (stage === "asr" || stage === "nmt" || stage === "tts" || stage === "render") ? "#94A3B8" : "white",
            }}>
            {(stage === "asr" || stage === "nmt" || stage === "tts" || stage === "render") ? (
              <><Loader2 size={14} className="animate-spin" /> Synthesising…</>
            ) : (
              <>Dub Now <ArrowRight size={14} /></>
            )}
          </button>

          {error && (
            <div className="mt-3 p-2 rounded-lg text-[11px]"
              style={{ background: "rgba(220,38,38,0.08)", color: "#DC2626", border: "1px solid rgba(220,38,38,0.2)" }}>
              {error}
            </div>
          )}
        </Card>

        {/* Center — Pipeline */}
        <Card>
          <CardHeader title="Dubbing Pipeline" subtitle="Stage-by-stage processing" />
          <div className="space-y-3">
            {stageInfo.map((s, i) => {
              const status = getStageStatus(s.key);
              const color = stageColor(status);
              const time = stageTimes[s.key];
              return (
                <div key={s.key}>
                  <div className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ background: status === "active" ? "rgba(10,123,140,0.06)" : "#F0F2F5",
                      border: `1px solid ${status === "active" ? "rgba(10,123,140,0.2)" : "#E0E4EA"}` }}>
                    {/* Status dot */}
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}20`, border: `1.5px solid ${color}` }}>
                      {status === "done" ? (
                        <CheckCircle2 size={12} style={{ color }} />
                      ) : status === "active" ? (
                        <Loader2 size={12} style={{ color }} className="animate-spin" />
                      ) : (
                        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold" style={{ color: "#1A1A2E" }}>{s.label}</span>
                        {time && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                            style={{ background: "rgba(22,163,74,0.1)", color: "#16A34A" }}>
                            {time}ms
                          </span>
                        )}
                      </div>
                      <div className="text-[10px]" style={{ color: "#64748B" }}>{s.sublabel}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: "#94A3B8" }}>{s.detail}</div>
                    </div>
                  </div>
                  {i < stageInfo.length - 1 && (
                    <div className="flex justify-center my-0.5">
                      <div className="w-px h-3" style={{ background: "#E0E4EA" }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {stage === "done" && synthTime && (
            <div className="mt-4 p-3 rounded-lg text-center"
              style={{ background: "rgba(10,123,140,0.06)", border: "1px solid rgba(10,123,140,0.15)" }}>
              <div className="text-lg font-bold font-mono" style={{ color: "#0A7B8C" }}>{(synthTime / 1000).toFixed(2)}s</div>
              <div className="text-[10px] mt-0.5" style={{ color: "#64748B" }}>End-to-end synthesis time</div>
            </div>
          )}
        </Card>

        {/* Right — Audio Output */}
        <Card>
          <CardHeader title="Audio Output" subtitle={`${selectedLang.flag} ${selectedLang.label} dub — George voice`} />

          <div className="flex flex-col items-center justify-center py-6 gap-4">
            {/* Status */}
            <div className="text-center">
              {stage === "idle" && <p className="text-sm" style={{ color: "#94A3B8" }}>Select a clip and hit Dub Now</p>}
              {(stage === "asr" || stage === "nmt") && (
                <div className="flex items-center gap-2 text-sm" style={{ color: "#64748B" }}>
                  <Loader2 size={14} className="animate-spin" /> Preparing pipeline…
                </div>
              )}
              {stage === "tts" && (
                <div className="flex items-center gap-2 text-sm" style={{ color: "#0A7B8C" }}>
                  <Loader2 size={14} className="animate-spin" /> Synthesising with ElevenLabs…
                </div>
              )}
              {stage === "render" && (
                <div className="flex items-center gap-2 text-sm" style={{ color: "#16A34A" }}>
                  <Loader2 size={14} className="animate-spin" /> Finalising audio…
                </div>
              )}
            </div>

            {/* Player */}
            {audioUrl && (
              <div className="w-full space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <button onClick={togglePlay}
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
                    style={{ background: "linear-gradient(135deg, #0A7B8C, #0D9BAF)", color: "white",
                      boxShadow: "0 4px 16px rgba(10,123,140,0.3)" }}>
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                </div>

                {/* Waveform bars (decorative) */}
                <div className="flex items-center justify-center gap-0.5 h-10">
                  {Array.from({ length: 32 }, (_, i) => (
                    <div key={i} className="rounded-full transition-all"
                      style={{
                        width: 3,
                        height: isPlaying ? `${20 + Math.sin(i * 0.8) * 14 + Math.random() * 8}px` : `${8 + Math.sin(i * 0.6) * 6}px`,
                        background: isPlaying ? "#0A7B8C" : "#CBD5E1",
                        transition: isPlaying ? "height 0.15s ease" : "height 0.3s ease",
                      }} />
                  ))}
                </div>

                <div className="text-center text-[11px] space-y-1">
                  <div style={{ color: "#64748B" }}>
                    <span className="font-medium" style={{ color: "#1A1A2E" }}>{selectedClip.title}</span>
                    {" · "}{selectedLang.flag} {selectedLang.label}
                  </div>
                  {synthTime && (
                    <div style={{ color: "#0A7B8C" }}>
                      Synthesised in <span className="font-mono font-bold">{(synthTime / 1000).toFixed(2)}s</span>
                    </div>
                  )}
                </div>

                <a href={audioUrl} download={`${selectedClip.id}_${selectedLang.code}.mp3`}
                  className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-medium"
                  style={{ background: "#F0F2F5", color: "#64748B", border: "1px solid #E0E4EA" }}>
                  <Download size={12} />
                  Download MP3
                </a>
              </div>
            )}

            <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden" />
          </div>

          {/* Voice info */}
          <div className="p-3 rounded-lg" style={{ background: "#F0F2F5", border: "1px solid #E0E4EA" }}>
            <div className="text-[10px] font-medium mb-1" style={{ color: "#64748B" }}>Voice Configuration</div>
            <div className="space-y-0.5 text-[10px]">
              <div className="flex justify-between">
                <span style={{ color: "#94A3B8" }}>Voice ID</span>
                <span className="font-mono" style={{ color: "#1A1A2E" }}>{VOICE_ID.slice(0, 12)}…</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#94A3B8" }}>Model</span>
                <span style={{ color: "#0A7B8C" }}>eleven_multilingual_v2</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#94A3B8" }}>Stability</span>
                <span style={{ color: "#1A1A2E" }}>0.50</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "#94A3B8" }}>Latency mode</span>
                <span style={{ color: "#16A34A" }}>Optimised (3)</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-4">

        {/* Language Coverage Matrix */}
        <Card>
          <CardHeader title="Language Coverage" subtitle="Supported dubbing pairs (source: English)" />
          <div className="flex flex-wrap gap-1.5">
            {ALL_SUPPORTED.map(code => {
              const lang = LANGUAGES.find(l => l.code === code);
              const isSelected = code === selectedLang.code;
              return (
                <div key={code}
                  className="px-2 py-1 rounded text-[10px] font-mono font-medium"
                  style={{
                    background: isSelected ? "rgba(10,123,140,0.12)" : "rgba(22,163,74,0.06)",
                    color: isSelected ? "#0A7B8C" : "#16A34A",
                    border: `1px solid ${isSelected ? "rgba(10,123,140,0.3)" : "rgba(22,163,74,0.2)"}`,
                  }}>
                  {lang ? `${lang.flag} ${code}` : code}
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-3 text-[10px]">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.2)" }} />
              <span style={{ color: "#64748B" }}>Supported (29)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ background: "rgba(10,123,140,0.12)", border: "1px solid rgba(10,123,140,0.3)" }} />
              <span style={{ color: "#64748B" }}>Currently selected</span>
            </div>
          </div>
        </Card>

        {/* Latency History */}
        <Card>
          <CardHeader title="Synthesis Latency History" subtitle="Last 8 API calls (ms)" />
          {latencyHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 gap-2">
              <Mic2 size={24} style={{ color: "#E0E4EA" }} />
              <p className="text-xs" style={{ color: "#94A3B8" }}>Run your first dub to see latency data</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={latencyHistory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" />
                <XAxis dataKey="call" tick={{ fill: "#94A3B8", fontSize: 10 }} tickLine={false} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} tickLine={false} axisLine={false}
                  tickFormatter={v => `${v}ms`} />
                <Tooltip
                  contentStyle={{ background: "#FFFFFF", border: "1px solid #E0E4EA", borderRadius: 8 }}
                  itemStyle={{ color: "#0A7B8C" }}
                  labelStyle={{ color: "#64748B" }}
                  formatter={(v) => [`${v}ms`, "Synthesis time"]} />
                <Line type="monotone" dataKey="ms" stroke="#0A7B8C" strokeWidth={2}
                  dot={{ fill: "#0A7B8C", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  );
}
