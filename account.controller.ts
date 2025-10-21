// backend/src/controllers/account.controller.ts
import { Request, Response } from "express";
import { getImapAccounts } from "../config/imapConfig";
import logger from "../utils/logger";

export async function getAccounts(req: Request, res: Response) {
  try {
    const accounts = getImapAccounts();
    res.json({ success: true, data: accounts });
  } catch (err) {
    logger.error("Error fetching accounts:", err);
    res.status(500).json({ success: false, error: "Failed to get accounts" });
  }
}
