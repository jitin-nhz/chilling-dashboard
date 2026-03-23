"use client";

import { useState, useRef, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import {
  Mic2, Globe, Play, Pause, Download, CheckCircle2,
  Loader2, Radio, Volume2, ArrowRight, Languages, Volume, VolumeX, Link, Film,
} from "lucide-react";

const BASE = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/";

const CLIPS = [
  { id: "st5",  title: "Stranger Things S5", genre: "Sci-Fi",   accentColor: "#3498DB", videoUrl: `${BASE}ForBiggerJoyrides.mp4`,   script: "The Upside Down is spreading. We don't have much time. We need to close the gate before it's too late." },
  { id: "sg3",  title: "Squid Game S3",       genre: "Thriller", accentColor: "#DC2626", videoUrl: `${BASE}ForBiggerMeltdowns.mp4`,  script: "You came back. I knew you would. The game is different this time. Are you ready to play?" },
  { id: "wed2", title: "Wednesday S2",         genre: "Horror",   accentColor: "#8E44AD", videoUrl: `${BASE}ForBiggerBlazes.mp4`,     script: "I find human emotions to be an unnecessary inconvenience. Yet somehow, you've managed to surprise me." },
  { id: "sev2", title: "Severance S2",         genre: "Sci-Fi",   accentColor: "#0A7B8C", videoUrl: `${BASE}ForBiggerEscapes.mp4`,    script: "Your outie doesn't remember this conversation. But I do. That's what makes me dangerous." },
];

const LANGUAGES = [
  { label: "English",    code: "en", flag: "🇺🇸" },
  { label: "Spanish",    code: "es", flag: "🇪🇸" },
  { label: "Korean",     code: "ko", flag: "🇰🇷" },
  { label: "French",     code: "fr", flag: "🇫🇷" },
  { label: "German",     code: "de", flag: "🇩🇪" },
  { label: "Japanese",   code: "ja", flag: "🇯🇵" },
  { label: "Portuguese", code: "pt", flag: "🇧🇷" },
  { label: "Hindi",      code: "hi", flag: "🇮🇳" },
  { label: "Italian",    code: "it", flag: "🇮🇹" },
  { label: "Dutch",      code: "nl", flag: "🇳🇱" },
];

const ALL_SUPPORTED = ["en","es","ko","fr","de","ja","pt","hi","ar","nl","it","pl","tr","sv","da","no","fi","uk","cs","el","ro","hu","bg","ms","sk","hr","tl","ta","id"];

type Stage = "idle" | "asr" | "nmt" | "tts" | "render" | "done";
type Mode = "preset" | "youtube";
interface LatencyEntry { call: string; ms: number }

const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";

export default function DubbingPOC() {
  const [mode, setMode] = useState<Mode>("preset");

  // Preset state
  const [selectedClip, setSelectedClip] = useState(CLIPS[0]);

  // YouTube state
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [youtubeTranscript, setYoutubeTranscript] = useState<string | null>(null);

  // Shared state
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[1]);
  const [stage, setStage] = useState<Stage>("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [synthTime, setSynthTime] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stageTimes, setStageTimes] = useState<Record<string, number>>({});
  const [latencyHistory, setLatencyHistory] = useState<LatencyEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isDubbed, setIsDubbed] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const callCount = useRef(0);

  const isBusy = stage === "asr" || stage === "nmt" || stage === "tts" || stage === "render";

  const resetState = () => {
    setAudioUrl(null); setStage("idle"); setStageTimes({});
    setTranslatedText(null); setIsDubbed(false); setIsPlaying(false); setError(null);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
    if (videoRef.current) videoRef.current.muted = true;
  };

  const resetClip = (clip: typeof CLIPS[0]) => { setSelectedClip(clip); resetState(); };

  const togglePlay = () => {
    const audio = audioRef.current;
    const video = videoRef.current;
    if (isPlaying) {
      audio?.pause(); video?.pause(); setIsPlaying(false);
    } else {
      if (isDubbed) { audio?.play(); video?.play(); }
      else video?.play();
      setIsPlaying(true);
    }
  };

  // ── Shared TTS call via API route ─────────────────────────────────────────
  const callTTS = async (text: string, langCode: string): Promise<{ blob: Blob; translated: string }> => {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, langCode }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? `TTS failed (${res.status})`);
    }
    const blob = await res.blob();
    const translatedHeader = res.headers.get("X-Translated-Text");
    const translated = translatedHeader ? decodeURIComponent(translatedHeader) : text;
    return { blob, translated };
  };

  // ── Preset clip dub ───────────────────────────────────────────────────────
  const handlePresetDub = useCallback(async () => {
    if (isBusy) return;
    resetState();
    const start = Date.now();
    const times: Record<string, number> = {};

    if (videoRef.current) { videoRef.current.muted = true; videoRef.current.play(); }

    setStage("asr");
    await new Promise(r => setTimeout(r, 160 + Math.random() * 80));
    times.asr = Date.now() - start;

    setStage("nmt");
    try {
      const { blob, translated } = await callTTS(selectedClip.script, selectedLang.code);
      times.nmt = Date.now() - start; // NMT + TTS combined in the API route

      setTranslatedText(translated);
      times.tts = Date.now() - start;

      setStage("render");
      await new Promise(r => setTimeout(r, 80));
      times.render = Date.now() - start;

      const url = URL.createObjectURL(blob);
      const totalMs = Date.now() - start;
      finaliseDub(url, totalMs, times);
    } catch (err: unknown) {
      setStage("idle");
      setError(err instanceof Error ? err.message : "Dubbing failed.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClip, selectedLang, isBusy]);

  // ── YouTube URL dub ───────────────────────────────────────────────────────
  const handleYouTubeDub = useCallback(async () => {
    if (isBusy || !youtubeUrl.trim()) return;
    resetState();
    setYoutubeVideoId(null); setYoutubeTranscript(null);
    const start = Date.now();
    const times: Record<string, number> = {};

    // ASR — fetch YouTube transcript
    setStage("asr");
    try {
      const dubRes = await fetch("/api/dub", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtubeUrl }),
      });
      const dubData = await dubRes.json();
      if (!dubRes.ok) throw new Error(dubData.error ?? "Transcript fetch failed");

      setYoutubeVideoId(dubData.videoId);
      setYoutubeTranscript(dubData.transcript);
      times.asr = Date.now() - start;

      // NMT + TTS via /api/tts
      setStage("nmt");
      const { blob, translated } = await callTTS(dubData.transcript, selectedLang.code);
      setTranslatedText(translated);
      times.nmt = Date.now() - start;
      times.tts = Date.now() - start;

      setStage("render");
      await new Promise(r => setTimeout(r, 80));
      times.render = Date.now() - start;

      const url = URL.createObjectURL(blob);
      const totalMs = Date.now() - start;
      finaliseDub(url, totalMs, times);
    } catch (err: unknown) {
      setStage("idle");
      setError(err instanceof Error ? err.message : "Dubbing failed.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeUrl, selectedLang, isBusy]);

  const finaliseDub = (url: string, totalMs: number, times: Record<string, number>) => {
    setAudioUrl(url); setSynthTime(totalMs); setStageTimes(times);
    setStage("done"); setIsDubbed(true);
    callCount.current += 1;
    setLatencyHistory(prev => [...prev, { call: `#${callCount.current}`, ms: totalMs }].slice(-8));

    if (audioRef.current) { audioRef.current.src = url; audioRef.current.currentTime = 0; audioRef.current.play(); }
    if (videoRef.current) { videoRef.current.muted = true; videoRef.current.currentTime = 0; videoRef.current.play(); }
    setIsPlaying(true);
  };

  const stageInfo = [
    { key: "asr",    label: "ASR",          sublabel: mode === "youtube" ? "YouTube Transcript" : "Speech Recognition",  detail: mode === "youtube" ? (youtubeTranscript ? `"${youtubeTranscript.slice(0,50)}…"` : "Fetching transcript…") : "Source: English detected" },
    { key: "nmt",    label: "NMT",          sublabel: "MyMemory Neural Translation",                                      detail: translatedText ? `"${translatedText.slice(0,46)}…"` : `en → ${selectedLang.code} (${selectedLang.label})` },
    { key: "tts",    label: "TTS Synthesis", sublabel: "ElevenLabs multilingual_v2",                                      detail: `Voice: ${VOICE_ID.slice(0, 8)}…` },
    { key: "render", label: "Audio Render",  sublabel: "Output format",                                                   detail: "mp3_44100_128" },
  ];

  const stageOrder: Stage[] = ["asr", "nmt", "tts", "render", "done"];
  const getStageStatus = (key: string): "idle" | "active" | "done" => {
    if (stage === "idle") return "idle";
    if (stage === "done") return "done";
    const ci = stageOrder.indexOf(stage), si = stageOrder.indexOf(key as Stage);
    if (si < ci) return "done"; if (si === ci) return "active"; return "idle";
  };
  const stageColor = (s: "idle" | "active" | "done") =>
    s === "done" ? "#16A34A" : s === "active" ? "#0A7B8C" : "#E0E4EA";

  const showTitle = mode === "youtube" && youtubeVideoId
    ? `YouTube: ${youtubeVideoId}`
    : selectedClip.title;
  const showGenre = mode === "youtube" ? "YouTube" : selectedClip.genre;
  const showAccent = mode === "youtube" ? "#DC2626" : selectedClip.accentColor;

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Languages Supported" value="29" icon={<Globe size={16} />} />
        <StatCard label="Model" value="multilingual_v2" icon={<Radio size={16} />} accent="#9B59B6" />
        <StatCard label="Last Synthesis" value={synthTime ? `${(synthTime / 1000).toFixed(2)}s` : "—"} icon={<Mic2 size={16} />} accent="#F0A500" />
        <StatCard label="Active Dub Streams" value="3,840" delta="+12% vs yesterday" deltaType="up" icon={<Volume2 size={16} />} accent="#16A34A" />
      </div>

      {/* ── Mode toggle ──────────────────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: "#F0F2F5", border: "1px solid #E0E4EA" }}>
        {([["preset", Film, "Preset Clips"], ["youtube", Link, "YouTube URL"]] as const).map(([m, Icon, label]) => (
          <button key={m} onClick={() => { setMode(m); resetState(); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: mode === m ? "#FFFFFF" : "transparent",
              color: mode === m ? "#0A7B8C" : "#64748B",
              boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* ── VIDEO AREA ───────────────────────────────────────────────────────── */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div className="relative" style={{ height: 340 }}>

          {/* Preset: HTML video */}
          {mode === "preset" && (
            <video ref={videoRef} key={selectedClip.id} src={selectedClip.videoUrl}
              autoPlay loop muted playsInline className="w-full h-full"
              style={{ objectFit: "cover" }}
              onEnded={() => { audioRef.current?.pause(); setIsPlaying(false); }} />
          )}

          {/* YouTube: iframe embed OR placeholder */}
          {mode === "youtube" && (
            youtubeVideoId ? (
              <iframe
                key={youtubeVideoId}
                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&loop=1&playlist=${youtubeVideoId}&controls=0&rel=0`}
                className="w-full h-full"
                style={{ border: "none", pointerEvents: "none" }}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3"
                style={{ background: "linear-gradient(135deg, #1A1A2E, #0F0F1A)" }}>
                <Link size={40} style={{ color: "#2A2A45" }} />
                <p className="text-sm font-medium" style={{ color: "#64748B" }}>Paste a YouTube URL below and click Dub Now</p>
              </div>
            )
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)" }} />

          {/* Top-left: title + genre */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm"
              style={{ background: "rgba(0,0,0,0.55)", color: "white" }}>{showTitle}</div>
            <div className="px-2 py-1 rounded-full text-[10px] font-medium backdrop-blur-sm"
              style={{ background: `${showAccent}CC`, color: "white" }}>{showGenre}</div>
          </div>

          {/* Top-right: DUBBED or PROCESSING badge */}
          {isDubbed && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm"
              style={{ background: "rgba(10,123,140,0.85)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>
              <Mic2 size={12} />
              <span className="text-[11px] font-semibold">DUBBED · {selectedLang.flag} {selectedLang.label}</span>
            </div>
          )}
          {isBusy && (
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm"
              style={{ background: "rgba(0,0,0,0.6)", color: "white" }}>
              <Loader2 size={12} className="animate-spin" />
              <span className="text-[11px]">Processing pipeline…</span>
            </div>
          )}

          {/* Bottom controls */}
          <div className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center gap-3">
            <button onClick={togglePlay}
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)", color: "white" }}>
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <div className="flex-1 min-w-0">
              {isDubbed ? (
                <div>
                  <div className="text-xs font-medium text-white truncate">{showTitle} — {selectedLang.flag} Dubbed track active</div>
                  <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>Original audio muted · ElevenLabs multilingual_v2</div>
                </div>
              ) : (
                <div>
                  <div className="text-xs font-medium text-white">{showTitle}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {stage === "idle" ? "Select language and click Dub Now →" : "Dubbing pipeline running…"}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "rgba(255,255,255,0.7)" }}>
              {isDubbed ? <><Mic2 size={12} style={{ color: "#0D9BAF" }} /><span style={{ color: "#0D9BAF" }}>Dubbed</span></>
                : <><VolumeX size={12} /><span>Muted</span></>}
            </div>
            {audioUrl && (
              <a href={audioUrl} download={`${mode === "youtube" ? youtubeVideoId : selectedClip.id}_${selectedLang.code}.mp3`}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium"
                style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.2)", color: "white" }}>
                <Download size={11} /> MP3
              </a>
            )}
          </div>
        </div>

        {/* Preset clip tabs (only in preset mode) */}
        {mode === "preset" && (
          <div className="flex border-t" style={{ borderColor: "#E0E4EA" }}>
            {CLIPS.map(clip => (
              <button key={clip.id} onClick={() => resetClip(clip)}
                className="flex-1 py-2.5 px-3 text-xs font-medium transition-all text-center"
                style={{
                  background: selectedClip.id === clip.id ? "rgba(10,123,140,0.06)" : "transparent",
                  color: selectedClip.id === clip.id ? "#0A7B8C" : "#64748B",
                  borderBottom: selectedClip.id === clip.id ? "2px solid #0A7B8C" : "2px solid transparent",
                }}>
                {clip.title}
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* ── 3-col: Settings + Pipeline + Track info ─────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">

        {/* Left — Language + Source input */}
        <Card>
          <CardHeader title="Dub Settings" subtitle={mode === "youtube" ? "YouTube URL → select language → Dub" : "Select language and synthesise"} />

          {/* YouTube URL input (only in youtube mode) */}
          {mode === "youtube" && (
            <div className="mb-4">
              <label className="text-xs font-medium mb-2 block" style={{ color: "#64748B" }}>YouTube Video URL</label>
              <div className="relative">
                <Link size={13} className="absolute left-3 top-2.5" style={{ color: "#94A3B8" }} />
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={e => { setYoutubeUrl(e.target.value); resetState(); setYoutubeVideoId(null); }}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg text-xs"
                  style={{ background: "#F0F2F5", border: "1px solid #E0E4EA", color: "#1A1A2E" }}
                />
              </div>
              <p className="text-[10px] mt-1" style={{ color: "#94A3B8" }}>
                Public videos with auto-captions supported
              </p>
            </div>
          )}

          {/* Language selector */}
          <div className="mb-4">
            <label className="text-xs font-medium mb-2 block" style={{ color: "#64748B" }}>
              <Languages size={11} className="inline mr-1" />
              Target Language
            </label>
            <div className="flex flex-wrap gap-1.5">
              {LANGUAGES.map(lang => (
                <button key={lang.code}
                  onClick={() => { setSelectedLang(lang); setAudioUrl(null); setStage("idle"); setTranslatedText(null); setIsDubbed(false); }}
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

          {/* Script preview */}
          <div className="mb-4 p-3 rounded-lg" style={{ background: "#F0F2F5", border: "1px solid #E0E4EA" }}>
            <div className="text-[10px] font-medium mb-1" style={{ color: "#64748B" }}>
              {mode === "youtube" ? (youtubeTranscript ? "Extracted transcript" : "Transcript will appear here") : "Original script"}
            </div>
            <p className="text-[11px] leading-relaxed italic" style={{ color: "#1A1A2E" }}>
              {mode === "youtube"
                ? (youtubeTranscript ? `"${youtubeTranscript.slice(0, 160)}…"` : "—")
                : `"${selectedClip.script}"`
              }
            </p>
            {translatedText && (
              <>
                <div className="w-full h-px my-2" style={{ background: "#E0E4EA" }} />
                <div className="text-[10px] font-medium mb-1" style={{ color: "#0A7B8C" }}>
                  {selectedLang.flag} Translated ({selectedLang.label})
                </div>
                <p className="text-[11px] leading-relaxed italic" style={{ color: "#0A7B8C" }}>
                  &ldquo;{translatedText}&rdquo;
                </p>
              </>
            )}
          </div>

          <button
            onClick={mode === "youtube" ? handleYouTubeDub : handlePresetDub}
            disabled={isBusy || (mode === "youtube" && !youtubeUrl.trim())}
            className="w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
            style={{
              background: (isBusy || (mode === "youtube" && !youtubeUrl.trim())) ? "#F0F2F5" : "linear-gradient(135deg, #0A7B8C, #0D9BAF)",
              color: (isBusy || (mode === "youtube" && !youtubeUrl.trim())) ? "#94A3B8" : "white",
            }}>
            {isBusy ? <><Loader2 size={14} className="animate-spin" /> Synthesising…</> : <>Dub Now <ArrowRight size={14} /></>}
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
                    style={{ background: status === "active" ? "rgba(10,123,140,0.06)" : "#F0F2F5", border: `1px solid ${status === "active" ? "rgba(10,123,140,0.2)" : "#E0E4EA"}` }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}20`, border: `1.5px solid ${color}` }}>
                      {status === "done" ? <CheckCircle2 size={12} style={{ color }} />
                        : status === "active" ? <Loader2 size={12} style={{ color }} className="animate-spin" />
                        : <div className="w-2 h-2 rounded-full" style={{ background: color }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold" style={{ color: "#1A1A2E" }}>{s.label}</span>
                        {time && <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(22,163,74,0.1)", color: "#16A34A" }}>{time}ms</span>}
                      </div>
                      <div className="text-[10px]" style={{ color: "#64748B" }}>{s.sublabel}</div>
                      <div className="text-[10px] mt-0.5 truncate" style={{ color: "#94A3B8" }}>{s.detail}</div>
                    </div>
                  </div>
                  {i < stageInfo.length - 1 && <div className="flex justify-center my-0.5"><div className="w-px h-3" style={{ background: "#E0E4EA" }} /></div>}
                </div>
              );
            })}
          </div>
          {stage === "done" && synthTime && (
            <div className="mt-4 p-3 rounded-lg text-center" style={{ background: "rgba(10,123,140,0.06)", border: "1px solid rgba(10,123,140,0.15)" }}>
              <div className="text-lg font-bold font-mono" style={{ color: "#0A7B8C" }}>{(synthTime / 1000).toFixed(2)}s</div>
              <div className="text-[10px] mt-0.5" style={{ color: "#64748B" }}>End-to-end synthesis time</div>
            </div>
          )}
        </Card>

        {/* Right — Track info */}
        <Card>
          <CardHeader title="Dubbed Track" subtitle={`${selectedLang.flag} ${selectedLang.label} — George voice`} />
          <div className="flex flex-col gap-4">
            <div className="p-3 rounded-lg flex items-center gap-3"
              style={{ background: isDubbed ? "rgba(10,123,140,0.06)" : "#F0F2F5", border: `1px solid ${isDubbed ? "rgba(10,123,140,0.2)" : "#E0E4EA"}` }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: isDubbed ? "linear-gradient(135deg,#0A7B8C,#0D9BAF)" : "#E0E4EA" }}>
                {isDubbed ? <Volume size={18} style={{ color: "white" }} /> : <VolumeX size={18} style={{ color: "#94A3B8" }} />}
              </div>
              <div>
                <div className="text-xs font-semibold" style={{ color: isDubbed ? "#0A7B8C" : "#94A3B8" }}>
                  {isDubbed ? "Dubbed audio track ready" : "No dubbed track yet"}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: "#64748B" }}>
                  {isDubbed ? `Plays over video · ${(synthTime! / 1000).toFixed(2)}s synthesis` : "Hit Dub Now to generate"}
                </div>
              </div>
            </div>

            {isDubbed && (
              <div className="flex items-center justify-center gap-0.5 h-10 px-2">
                {Array.from({ length: 32 }, (_, i) => (
                  <div key={i} className="rounded-full" style={{ width: 3, height: isPlaying ? `${18 + Math.sin(i * 0.8) * 12}px` : `${6 + Math.sin(i * 0.6) * 5}px`, background: isPlaying ? "#0A7B8C" : "#CBD5E1", transition: "height 0.2s ease" }} />
                ))}
              </div>
            )}

            {audioUrl && (
              <a href={audioUrl} download={`${mode === "youtube" ? youtubeVideoId : selectedClip.id}_${selectedLang.code}.mp3`}
                className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium"
                style={{ background: "#F0F2F5", color: "#64748B", border: "1px solid #E0E4EA" }}>
                <Download size={12} /> Download dubbed MP3
              </a>
            )}

            <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden" />

            <div className="p-3 rounded-lg" style={{ background: "#F0F2F5", border: "1px solid #E0E4EA" }}>
              <div className="text-[10px] font-medium mb-1.5" style={{ color: "#64748B" }}>Voice Configuration</div>
              <div className="space-y-1 text-[10px]">
                {[["Voice ID", `${VOICE_ID.slice(0, 12)}…`], ["Model", "eleven_multilingual_v2"], ["Stability", "0.50"], ["Latency mode", "Optimised (3)"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span style={{ color: "#94A3B8" }}>{k}</span>
                    <span className="font-mono" style={{ color: k === "Model" ? "#0A7B8C" : k === "Latency mode" ? "#16A34A" : "#1A1A2E" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Bottom row ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Language Coverage" subtitle="Supported dubbing pairs (source: English)" />
          <div className="flex flex-wrap gap-1.5">
            {ALL_SUPPORTED.map(code => {
              const lang = LANGUAGES.find(l => l.code === code);
              const isSelected = code === selectedLang.code;
              return (
                <div key={code} className="px-2 py-1 rounded text-[10px] font-mono font-medium"
                  style={{ background: isSelected ? "rgba(10,123,140,0.12)" : "rgba(22,163,74,0.06)", color: isSelected ? "#0A7B8C" : "#16A34A", border: `1px solid ${isSelected ? "rgba(10,123,140,0.3)" : "rgba(22,163,74,0.2)"}` }}>
                  {lang ? `${lang.flag} ${code}` : code}
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-3 text-[10px]">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.2)" }} /><span style={{ color: "#64748B" }}>Supported (29)</span></div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ background: "rgba(10,123,140,0.12)", border: "1px solid rgba(10,123,140,0.3)" }} /><span style={{ color: "#64748B" }}>Currently selected</span></div>
          </div>
        </Card>

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
                <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}ms`} />
                <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #E0E4EA", borderRadius: 8 }}
                  itemStyle={{ color: "#0A7B8C" }} labelStyle={{ color: "#64748B" }}
                  formatter={(v) => [`${v}ms`, "Synthesis time"]} />
                <Line type="monotone" dataKey="ms" stroke="#0A7B8C" strokeWidth={2} dot={{ fill: "#0A7B8C", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  );
}
