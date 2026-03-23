import { NextRequest, NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

function extractVideoId(url: string): string | null {
  // Handles: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const patterns = [
    /youtu\.be\/([^?&\s]+)/,
    /youtube\.com\/watch\?.*v=([^&\s]+)/,
    /youtube\.com\/embed\/([^?&\s]+)/,
    /youtube\.com\/shorts\/([^?&\s]+)/,
    /youtube\.com\/v\/([^?&\s]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { youtubeUrl } = await req.json();

    if (!youtubeUrl) {
      return NextResponse.json({ error: "youtubeUrl is required" }, { status: 400 });
    }

    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      return NextResponse.json({ error: "Could not extract video ID from URL" }, { status: 400 });
    }

    let transcriptItems;
    try {
      transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    } catch {
      return NextResponse.json(
        { error: "No transcript available for this video. It may be private, have no captions, or captions may be disabled." },
        { status: 422 }
      );
    }

    // Concatenate transcript text, limit to ~800 chars for a sensible TTS clip
    const fullText = transcriptItems
      .map((t) => t.text.replace(/\[.*?\]/g, "").trim()) // remove [Music], [Applause] etc.
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    const transcript = fullText.length > 800 ? fullText.slice(0, 800).trimEnd() + "…" : fullText;

    return NextResponse.json({ videoId, transcript });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
