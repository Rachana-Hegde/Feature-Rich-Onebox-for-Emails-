// backend/src/services/imap.service.ts
import Imap from "node-imap";
import { simpleParser, ParsedMail } from "mailparser";
import { getImapAccounts } from "../config/imapConfig";
import { indexEmail } from "./email.service";
import { DEFAULT_CATEGORY } from "../models/email.model";
import logger from "../utils/logger";

interface ImapConnection {
  id: string;
  imap: Imap;
}

// Safe types for mailparser addresses
interface AddressItem {
  name?: string;
  address: string;
}

interface AddressObjectSafe {
  value?: AddressItem[];
  text?: string;
}

/**
 * Initialize and start IMAP listeners for all configured accounts
 */
export async function startImapListeners() {
  const accounts = getImapAccounts();
  if (!accounts.length) {
    logger.warn("No IMAP accounts configured. Skipping IMAP sync.");
    return;
  }

  for (const acc of accounts) {
    const imap = new Imap({
      user: acc.user,
      password: acc.password,
      host: acc.host,
      port: acc.port,
      tls: acc.tls,
      autotls: "always",
      keepalive: {
        interval: acc.keepalive?.interval ?? 1000 * 60 * 25,
        idleTimeout: acc.keepalive?.idleTimeout ?? 1000 * 60 * 29,
      },
    });

    imap.once("ready", () => openInboxAndListen(acc.id, imap, acc.mailbox));
    imap.once("error", (err: any) => logger.error(`IMAP error for ${acc.id}:`, err));
    imap.once("end", () => logger.info(`IMAP connection ended for ${acc.id}`));

    imap.connect();
  }
}

function openInboxAndListen(accountId: string, imap: Imap, mailbox: string) {
  imap.openBox(mailbox, true, (err: Error | null, box: Imap.Box) => {
    if (err) throw err;
    logger.info(`IMAP connected: ${accountId} → ${mailbox}`);

    // Real-time new mail event
    imap.on("mail", (numNewMsgs: number) => {
      logger.info(`[${accountId}] ${numNewMsgs} new mail(s)`);
      fetchLatestEmails(accountId, imap, box.messages.total);
    });
  });
}

function fetchLatestEmails(accountId: string, imap: Imap, totalMessages: number) {
  const fetcher = imap.seq.fetch(`${totalMessages}:*`, {
    bodies: "",
    markSeen: false,
  });

  fetcher.on("message", (msg: Imap.ImapMessage) => {
    let buffer = "";

    msg.on("body", (stream: NodeJS.ReadableStream) => {
      stream.on("data", (chunk: Buffer) => {
        buffer += chunk.toString("utf8");
      });
    });

    msg.once("end", async () => {
      try {
        const parsed: ParsedMail = await simpleParser(buffer);

        // Safely extract 'to' addresses
        const toAddresses = ((parsed.to ?? {}) as AddressObjectSafe).value ?? [];
        const toEmails = toAddresses.map((v) => v.address);

        await indexEmail({
          id: parsed.messageId ?? `msg-${Date.now()}`,
          accountId,
          folder: "INBOX",
          subject: parsed.subject ?? "(No Subject)",
          body: parsed.text ?? "",
          from: parsed.from?.text ?? "",
          to: toEmails,
          date: parsed.date ?? new Date(),
          aiCategory: DEFAULT_CATEGORY,
          indexedAt: new Date(),
        });

        logger.info(`[${accountId}] Indexed new email: ${parsed.subject}`);
      } catch (err) {
        logger.error("Error parsing new email:", err);
      }
    });
  });

  fetcher.once("error", (err: any) => logger.error("Fetch error:", err));
}
