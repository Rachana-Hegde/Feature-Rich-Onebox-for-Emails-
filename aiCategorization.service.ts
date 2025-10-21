// backend/src/services/aiCategorization.service.ts
import ENV from "../config/env";
import fetch from "node-fetch";
import { getElasticsearchClient } from "../config/elasticsearch";
import { EMAIL_INDEX_NAME, AICategory } from "../models/email.model";
import logger from "../utils/logger";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export async function categorizeEmail(emailId: string, bodyText: string): Promise<AICategory> {
  if (!ENV.GEMINI_API_KEY) {
    logger.warn("GEMINI_API_KEY not set, returning Uncategorized");
    return "Uncategorized";
  }

  const systemPrompt =
    "You are an expert email classifier. Categorize the given email text into one of: Interested, Meeting Booked, Not Interested, Spam, or Out of Office.";

  const payload = {
    contents: [{ parts: [{ text: `${systemPrompt}\n\nEmail:\n${bodyText}` }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          category: {
            type: "string",
            enum: [
              "Interested",
              "Meeting Booked",
              "Not Interested",
              "Spam",
              "Out of Office",
            ],
          },
        },
      },
    },
  };

  try {
    const res = await fetch(`${GEMINI_URL}?key=${ENV.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    const category =
      data?.candidates?.[0]?.content?.parts?.[0]?.json?.category ??
      "Uncategorized";

    const client = getElasticsearchClient();
    await client.update({
      index: EMAIL_INDEX_NAME,
      id: emailId,
      body: { doc: { aiCategory: category } },
    });

    logger.info(`[AI] Email ${emailId} categorized as ${category}`);
    return category as AICategory;
  } catch (err) {
    logger.error("[AI] Categorization error:", err);
    return "Uncategorized";
  }
}
