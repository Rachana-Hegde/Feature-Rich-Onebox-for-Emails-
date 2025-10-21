// backend/src/controllers/email.controller.ts
import { Request, Response } from "express";
import { searchEmails } from "../services/email.service";
import { getElasticsearchClient } from "../config/elasticsearch";
import { EMAIL_INDEX_NAME, EmailDocument } from "../models/email.model";
import logger from "../utils/logger";

/**
 * Fetch all emails with pagination
 */
export async function getAllEmails(req: Request, res: Response) {
  try {
    const client = getElasticsearchClient();
    const { page = 1, limit = 10 } = req.query;
    const from = (Number(page) - 1) * Number(limit);

    const response = await client.search({
      index: EMAIL_INDEX_NAME,
      from,
      size: Number(limit),
      sort: [{ date: { order: "desc" } }],
    });

    const emails = response.hits.hits.map((hit: any) => hit._source);
    res.json({ success: true, data: emails });
  } catch (err) {
    logger.error("Error fetching emails:", err);
    res.status(500).json({ success: false, error: "Failed to fetch emails" });
  }
}

/**
 * Search and filter emails
 * Example: /api/emails/search?q=meeting&accountId=user@example.com&folder=INBOX
 */
export async function searchEmailsController(req: Request, res: Response) {
  try {
    const query = (req.query.q as string) || "";
    const accountId = (req.query.accountId as string) || "";
    const folder = (req.query.folder as string) || "";

    const results = await searchEmails(query, accountId, folder);
    res.json({ success: true, data: results });
  } catch (err) {
    logger.error("Error searching emails:", err);
    res.status(500).json({ success: false, error: "Search failed" });
  }
}
