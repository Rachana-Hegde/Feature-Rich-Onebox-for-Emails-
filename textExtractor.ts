// backend/src/utils/textExtractor.ts
import { JSDOM } from "jsdom";

/**
 * Extracts and cleans plain text from HTML email body
 * - Removes tags and scripts
 * - Decodes HTML entities
 */
export function extractTextFromHTML(html: string): string {
  if (!html) return "";
  try {
    const dom = new JSDOM(html);
    const text = dom.window.document.body.textContent || "";
    return text.replace(/\s+/g, " ").trim();
  } catch {
    return html;
  }
}

/**
 * Ensures we always have a clean body text from either plain or HTML.
 */
export function getCleanBodyText(html?: string, text?: string): string {
  if (text && text.trim()) return text.trim();
  if (html) return extractTextFromHTML(html);
  return "";
}
