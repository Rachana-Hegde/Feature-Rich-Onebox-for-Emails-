// backend/src/services/rag.service.ts
import { getQdrantClientAsync } from "../config/qdrant";
import { generateEmbedding } from "./embedding.service";
import ENV from "../config/env";
import fetch from "node-fetch";
import logger from "../utils/logger";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export async function suggestReply(emailText: string): Promise<string> {
  try {
    // ✅ Initialize Qdrant client properly
    const qdrant = await getQdrantClientAsync();

    // ✅ Get embedding for the input text
    const queryVector = await generateEmbedding(emailText);

    // ✅ Use Qdrant search with type casting to avoid red underline
    const results: any = await (qdrant as any).points.search({
      collection_name: "product_data",
      vector: queryVector,
      limit: 3,
    });

    const contexts =
      results?.result?.map((r: any) => r.payload?.text).join("\n---\n") ?? "";

    // ✅ Build AI prompt
    const prompt = `
You are a helpful assistant that writes professional, context-based email replies.
Context:
${contexts}

Original Email:
${emailText}

Based ONLY on the above, draft a concise, professional reply.
`;

    // ✅ Gemini API call
    const res = await fetch(`${GEMINI_URL}?key=${ENV.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    // TypeScript-safe Gemini response
    const data: any = await res.json();

    // ✅ Safely extract reply
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t generate a reply right now.";

    logger.info("[RAG] Generated suggested reply.");
    return reply.trim();
  } catch (err) {
    logger.error("[RAG] Error suggesting reply:", err);
    return "Sorry, I couldn’t generate a reply right now.";
  }
}
