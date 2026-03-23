"use client";

import { useState, useRef, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import {
  Mic2, Globe, Play, Pause, Download, CheckCircle2,
  Loader2, Radio, Volume2, ArrowRight, Languages, Volume, VolumeX,
} from "lucide-react";

const BASE = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/";

// ── Content clips ─────────────────────────────────────────────────────────────
const CLIPS = [
  {
    id: "st5",
    title: "Stranger Things S5",
    genre: "Sci-Fi",
    duration: "0:08",
    accentColor: "#3498DB",
    videoUrl: `${BASE}ForBiggerJoyrides.mp4`,
    script: "The Upside Down is spreading. We don't have much time. We need to close the gate before it's too late.",
  },
  {
    id: "sg3",
    title: "Squid Game S3",
    genre: "Thriller",
    duration: "0:07",
    accentColor: "#DC2626",
    videoUrl: `${BASE}ForBiggerMeltdowns.mp4`,
    script: "You came back. I knew you would. The game is different this time. Are you ready to play?",
  },
  {
    id: "wed2",
    title: "Wednesday S2",
    genre: "Horror",
    duration: "0:09",
    accentColor: "#8E44AD",
    videoUrl: `${BASE}ForBiggerBlazes.mp4`,
    script: "I find human emotions to be an unnecessary inconvenience. Yet somehow, you've managed to surprise me.",
  },
  {
    id: "sev2",
    title: "Severance S2",
    genre: "Sci-Fi",
    duration: "0:08",
    accentColor: "#0A7B8C",
    videoUrl: `${BASE}ForBiggerEscapes.mp4`,
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

const ALL_SUPPORTED = ["en","es","ko","fr","de","ja","pt","hi","ar","nl","it","pl","tr","sv","da","no","fi","uk","cs","el","ro","hu","bg","ms","sk","hr","tl","ta","id"];

type Stage = "idle" | "asr" | "nmt" | "tts" | "render" | "done";
interface LatencyEntry { call: string; ms: number }

const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";

export default function DubbingPOC() {
  const [selectedClip, setSelectedClip] = useState(CLIPS[0]);
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

  const resetClip = (clip: typeof CLIPS[0]) => {
    setSelectedClip(clip);
    setAudioUrl(null);
    setStage("idle");
    setStageTimes({});
    setTranslatedText(null);
    setIsDubbed(false);
    setIsPlaying(false);
    // Reset video to muted original
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      audio?.pause();
      setIsPlaying(false);
    } else {
      video.play();
      if (isDubbed && audio) audio.play();
      setIsPlaying(true);
    }
  };

  const handleDub = useCallback(async () => {
    if (stage === "asr" || stage === "nmt" || stage === "tts" || stage === "render") return;

    setError(null);
    setAudioUrl(null);
    setSynthTime(null);
    setTranslatedText(null);
    setIsPlaying(false);
    setIsDubbed(false);
    setStageTimes({});

    // Ensure video is playing (muted) as visual backdrop during pipeline
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play();
    }

    const start = Date.now();
    const times: Record<string, number> = {};

    setStage("asr");
    await new Promise(r => setTimeout(r, 160 + Math.random() * 80));
    times.asr = Date.now() - start;

    // NMT — real translation
    setStage("nmt");
    let textToSynth = selectedClip.script;
    try {
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
      // fall back to English
    }
    times.nmt = Date.now() - start;

    // TTS — real ElevenLabs call
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

      setStage("render");
      await new Promise(r => setTimeout(r, 80 + Math.random() * 60));
      times.render = Date.now() - start;

      const url = URL.createObjectURL(blob);
      const totalMs = Date.now() - start;

      setAudioUrl(url);
      setSynthTime(totalMs);
      setStageTimes(times);
      setStage("done");
      setIsDubbed(true);

      callCount.current += 1;
      setLatencyHistory(prev => [...prev, { call: `#${callCount.current}`, ms: totalMs }].slice(-8));

      // Mute video, play dubbed audio + video in sync
      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      setIsPlaying(true);
    } catch (err: unknown) {
      setStage("idle");
      setError(err instanceof Error ? err.message : "Dubbing failed. Check API key.");
      if (videoRef.current) videoRef.current.muted = true;
    }
  }, [selectedClip, selectedLang, stage]);

  const stageInfo = [
    { key: "asr", label: "ASR", sublabel: "Speech Recognition", detail: "Source: English detected" },
    {
      key: "nmt", label: "NMT", sublabel: "MyMemory Neural Translation",
      detail: translatedText
        ? `"${translatedText.slice(0, 46)}…"`
        : `en → ${selectedLang.code} (${selectedLang.label})`,
    },
    { key: "tts", label: "TTS Synthesis", sublabel: "ElevenLabs multilingual_v2", detail: `Voice: ${VOICE_ID.slice(0, 8)}…` },
    { key: "render", label: "Audio Render", sublabel: "Output format", detail: "mp3_44100_128" },
  ];

  const stageOrder: Stage[] = ["asr", "nmt", "tts", "render", "done"];
  const getStageStatus = (key: string): "idle" | "active" | "done" => {
    if (stage === "idle") return "idle";
    if (stage === "done") return "done";
    const ci = stageOrder.indexOf(stage);
    const si = stageOrder.indexOf(key as Stage);
    if (si < ci) return "done";
    if (si === ci) return "active";
    return "idle";
  };
  const stageColor = (s: "idle" | "active" | "done") =>
    s === "done" ? "#16A34A" : s === "active" ? "#0A7B8C" : "#E0E4EA";

  const isBusy = stage === "asr" || stage === "nmt" || stage === "tts" || stage === "render";

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
        <StatCard
          label="Last Synthesis"
          value={synthTime ? `${(synthTime / 1000).toFixed(2)}s` : "—"}
          icon={<Mic2 size={16} />}
          accent="#F0A500"
        />
        <StatCard label="Active Dub Streams" value="3,840" delta="+12% vs yesterday" deltaType="up" icon={<Volume2 size={16} />} accent="#16A34A" />
      </div>

      {/* ── VIDEO PLAYER (full width) ─────────────────────────────────────── */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div className="relative" style={{ height: 340 }}>
          {/* Video element */}
          <video
            ref={videoRef}
            key={selectedClip.id}
            src={selectedClip.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full"
            style={{ objectFit: "cover" }}
            onEnded={() => {
              if (audioRef.current) audioRef.current.pause();
              setIsPlaying(false);
            }}
          />

          {/* Dark overlay */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)" }} />

          {/* Top-left: show info */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm"
              style={{ background: "rgba(0,0,0,0.55)", color: "white" }}>
              {selectedClip.title}
            </div>
            <div className="px-2 py-1 rounded-full text-[10px] font-medium backdrop-blur-sm"
              style={{ background: `${selectedClip.accentColor}CC`, color: "white" }}>
              {selectedClip.genre}
            </div>
          </div>

          {/* Top-right: DUBBED badge */}
          {isDubbed && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm pulse-dot"
              style={{ background: "rgba(10,123,140,0.85)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>
              <Mic2 size={12} />
              <span className="text-[11px] font-semibold">DUBBED · {selectedLang.flag} {selectedLang.label}</span>
            </div>
          )}

          {/* Pipeline running indicator */}
          {isBusy && (
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm"
              style={{ background: "rgba(0,0,0,0.6)", color: "white" }}>
              <Loader2 size={12} className="animate-spin" />
              <span className="text-[11px]">Processing pipeline…</span>
            </div>
          )}

          {/* Bottom controls bar */}
          <div className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center gap-3">
            {/* Play/pause */}
            <button onClick={togglePlay}
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
              style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)", color: "white" }}>
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            {/* Track label */}
            <div className="flex-1 min-w-0">
              {isDubbed ? (
                <div>
                  <div className="text-xs font-medium text-white truncate">
                    {selectedClip.title} — {selectedLang.flag} Dubbed track active
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
                    Original audio muted · ElevenLabs multilingual_v2
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-xs font-medium text-white">{selectedClip.title}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {stage === "idle" ? "Select language and click Dub Now →" : "Dubbing pipeline running…"}
                  </div>
                </div>
              )}
            </div>

            {/* Audio indicator */}
            <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "rgba(255,255,255,0.7)" }}>
              {isDubbed ? (
                <><Mic2 size={12} style={{ color: "#0D9BAF" }} /><span style={{ color: "#0D9BAF" }}>Dubbed</span></>
              ) : (
                <><VolumeX size={12} /><span>Muted</span></>
              )}
            </div>

            {/* Download — only when dubbed */}
            {audioUrl && (
              <a href={audioUrl} download={`${selectedClip.id}_${selectedLang.code}.mp3`}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all"
                style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.2)", color: "white" }}>
                <Download size={11} />
                MP3
              </a>
            )}
          </div>
        </div>

        {/* Clip selector tabs — below video */}
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
      </Card>

      {/* ── 3-col: Language + Pipeline + Audio controls ───────────────────── */}
      <div className="grid grid-cols-3 gap-4">

        {/* Left — Language + Dub button */}
        <Card>
          <CardHeader title="Dub Settings" subtitle="Select target language and synthesise" />

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
            <div className="text-[10px] font-medium mb-1" style={{ color: "#64748B" }}>Original script</div>
            <p className="text-[11px] leading-relaxed italic" style={{ color: "#1A1A2E" }}>
              &ldquo;{selectedClip.script}&rdquo;
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

          <button onClick={handleDub} disabled={isBusy}
            className="w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all"
            style={{
              background: isBusy ? "#F0F2F5" : "linear-gradient(135deg, #0A7B8C, #0D9BAF)",
              color: isBusy ? "#94A3B8" : "white",
            }}>
            {isBusy ? (
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
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}20`, border: `1.5px solid ${color}` }}>
                      {status === "done" ? <CheckCircle2 size={12} style={{ color }} />
                        : status === "active" ? <Loader2 size={12} style={{ color }} className="animate-spin" />
                        : <div className="w-2 h-2 rounded-full" style={{ background: color }} />}
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
                      <div className="text-[10px] mt-0.5 truncate" style={{ color: "#94A3B8" }}>{s.detail}</div>
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

        {/* Right — Audio track info + Voice config */}
        <Card>
          <CardHeader title="Dubbed Track" subtitle={`${selectedLang.flag} ${selectedLang.label} — George voice`} />

          <div className="flex flex-col gap-4">
            {/* Track status */}
            <div className="p-3 rounded-lg flex items-center gap-3"
              style={{ background: isDubbed ? "rgba(10,123,140,0.06)" : "#F0F2F5",
                border: `1px solid ${isDubbed ? "rgba(10,123,140,0.2)" : "#E0E4EA"}` }}>
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

            {/* Waveform when playing */}
            {isDubbed && (
              <div className="flex items-center justify-center gap-0.5 h-10 px-2">
                {Array.from({ length: 32 }, (_, i) => (
                  <div key={i} className="rounded-full"
                    style={{
                      width: 3,
                      height: isPlaying ? `${18 + Math.sin(i * 0.8) * 12}px` : `${6 + Math.sin(i * 0.6) * 5}px`,
                      background: isPlaying ? "#0A7B8C" : "#CBD5E1",
                      transition: "height 0.2s ease",
                    }} />
                ))}
              </div>
            )}

            {/* Download */}
            {audioUrl && (
              <a href={audioUrl} download={`${selectedClip.id}_${selectedLang.code}.mp3`}
                className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium"
                style={{ background: "#F0F2F5", color: "#64748B", border: "1px solid #E0E4EA" }}>
                <Download size={12} />
                Download dubbed MP3
              </a>
            )}

            <audio ref={audioRef} onEnded={() => { setIsPlaying(false); }} className="hidden" />

            {/* Voice config */}
            <div className="p-3 rounded-lg" style={{ background: "#F0F2F5", border: "1px solid #E0E4EA" }}>
              <div className="text-[10px] font-medium mb-1.5" style={{ color: "#64748B" }}>Voice Configuration</div>
              <div className="space-y-1 text-[10px]">
                {[
                  ["Voice ID", `${VOICE_ID.slice(0, 12)}…`],
                  ["Model", "eleven_multilingual_v2"],
                  ["Stability", "0.50"],
                  ["Latency mode", "Optimised (3)"],
                ].map(([k, v]) => (
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
                <Tooltip contentStyle={{ background: "#FFFFFF", border: "1px solid #E0E4EA", borderRadius: 8 }}
                  itemStyle={{ color: "#0A7B8C" }} labelStyle={{ color: "#64748B" }}
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
