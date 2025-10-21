// backend/src/services/embedding.service.ts
import fetch from "node-fetch";
import ENV from "../config/env";

const GEMINI_EMBED_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent";

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const res = await fetch(`${GEMINI_EMBED_URL}?key=${ENV.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "embedding-001",
        content: { parts: [{ text }] },
      }),
    });

    // 👇 Use any type to safely extract embedding
    const data: any = await res.json();

    // ✅ Fix: access embedding with optional chaining and fallback
    const embedding = data?.embedding?.values ?? data?.embedding?.[0]?.values;

    if (!embedding) {
      console.error("[Embedding] No embedding found in response:", data);
      return [];
    }

    return embedding;
  } catch (error) {
    console.error("[Embedding] Error generating embedding:", error);
    return [];
  }
}
