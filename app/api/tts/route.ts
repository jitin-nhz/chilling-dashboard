import { NextRequest, NextResponse } from "next/server";

const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb";

export async function POST(req: NextRequest) {
  try {
    const { text, langCode } = await req.json();

    if (!text || !langCode) {
      return NextResponse.json({ error: "text and langCode are required" }, { status: 400 });
    }

    // ── Translate with MyMemory if not already English ────────────────────────
    let translatedText = text;
    if (langCode !== "en") {
      try {
        const transRes = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${langCode}`
        );
        const transData = await transRes.json();
        const translated = transData?.responseData?.translatedText;
        if (translated && transData.responseStatus === 200) {
          translatedText = translated;
        }
      } catch {
        // translation failed — proceed with original English text
      }
    }

    // ── ElevenLabs TTS ────────────────────────────────────────────────────────
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "ElevenLabs API key not configured" }, { status: 500 });
    }

    const ttsRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128&optimize_streaming_latency=3`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: translatedText,
          model_id: "eleven_multilingual_v2",
          language_code: langCode,
          voice_settings: { stability: 0.5, similarity_boost: 0.75, speed: 1.0 },
        }),
      }
    );

    if (!ttsRes.ok) {
      const msg = await ttsRes.text();
      return NextResponse.json(
        { error: `ElevenLabs API error ${ttsRes.status}: ${msg}` },
        { status: ttsRes.status }
      );
    }

    // Stream the audio bytes back with the translated text in a header
    const audioBuffer = await ttsRes.arrayBuffer();
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "X-Translated-Text": encodeURIComponent(translatedText.slice(0, 200)),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
