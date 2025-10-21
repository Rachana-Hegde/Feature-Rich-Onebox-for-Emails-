// backend/src/services/webhook.service.ts
import ENV from "../config/env";
import fetch from "node-fetch";
import logger from "../utils/logger";

export async function triggerWebhook(emailData: any) {
  try {
    if (ENV.SLACK_WEBHOOK_URL) {
      await fetch(ENV.SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `📩 *Interested Lead* \n*From:* ${emailData.from}\n*Subject:* ${emailData.subject}`,
        }),
      });
    }

    if (ENV.WEBHOOK_SITE_URL) {
      await fetch(ENV.WEBHOOK_SITE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "InterestedLead",
          email: emailData,
        }),
      });
    }

    logger.info(`[Webhook] Triggered for email ${emailData.id}`);
  } catch (err) {
    logger.error("[Webhook] Error triggering webhook:", err);
  }
}
