import { Request, Response } from "express";
import { suggestReply } from "../services/rag.service";
import { getElasticsearchClient } from "../config/elasticsearch";
import { EMAIL_INDEX_NAME, EmailDocument } from "../models/email.model";
import logger from "../utils/logger";

/**
 * POST /api/emails/:id/suggest-reply
 */
export async function suggestReplyController(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const client = getElasticsearchClient();

    const emailDoc = await client.get({
      index: EMAIL_INDEX_NAME,
      id,
    });

    const emailText = (emailDoc._source as EmailDocument)?.body ?? "";
    const reply = await suggestReply(emailText);

    res.json({
      success: true,
      emailId: id,
      suggestedReply: reply,
    });
  } catch (err) {
    logger.error("Error suggesting reply:", err);
    res.status(500).json({ success: false, error: "Failed to generate reply" });
  }
}
