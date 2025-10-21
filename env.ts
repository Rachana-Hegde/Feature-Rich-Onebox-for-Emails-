// backend/src/config/env.ts
import dotenv from "dotenv";

dotenv.config();

export type ImapAccountEnv = {
  id: string;            // unique identifier for the account (used as accountId)
  user: string;
  password: string;
  host: string;
  port?: number;
  tls?: boolean;
  mailbox?: string;      // e.g., "INBOX"
};

// Helper to parse boolean-like env vars
function parseBool(value?: string, defaultVal = false): boolean {
  if (value === undefined) return defaultVal;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

// Parse a JSON list of IMAP accounts or fallback to singular set of env vars.
// You can set IMAP_ACCOUNTS as JSON string:
// IMAP_ACCOUNTS='[{"id":"acct1","user":"u","password":"p","host":"imap.example.com","port":993,"tls":true}]'
function loadImapAccounts(): ImapAccountEnv[] {
  const raw = process.env.IMAP_ACCOUNTS;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) throw new Error("IMAP_ACCOUNTS must be a JSON array");
      return parsed.map((a, idx) => ({
        id: a.id ?? `account-${idx}`,
        user: String(a.user),
        password: String(a.password),
        host: String(a.host),
        port: a.port ? Number(a.port) : 993,
        tls: a.tls === undefined ? true : Boolean(a.tls),
        mailbox: a.mailbox ?? "INBOX",
      }));
    } catch (err) {
      throw new Error(`Failed to parse IMAP_ACCOUNTS: ${(err as Error).message}`);
    }
  }

  // Fallback single-account env vars (IMAP_USER, IMAP_PASS, IMAP_HOST)
  if (process.env.IMAP_USER && process.env.IMAP_PASS && process.env.IMAP_HOST) {
    return [
      {
        id: process.env.IMAP_ID ?? "default",
        user: process.env.IMAP_USER,
        password: process.env.IMAP_PASS,
        host: process.env.IMAP_HOST,
        port: process.env.IMAP_PORT ? Number(process.env.IMAP_PORT) : 993,
        tls: parseBool(process.env.IMAP_TLS, true),
        mailbox: process.env.IMAP_MAILBOX ?? "INBOX",
      },
    ];
  }

  // If none provided, return empty array (caller should decide)
  return [];
}

const IMAP_ACCOUNTS = loadImapAccounts();

function required(name: string, val?: string | undefined): string {
  if (!val) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return val;
}

export const ENV = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: process.env.PORT ? Number(process.env.PORT) : 4000,

  // Elasticsearch
  ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL ?? "http://localhost:9200",
  ELASTICSEARCH_USERNAME: process.env.ELASTICSEARCH_USERNAME ?? undefined,
  ELASTICSEARCH_PASSWORD: process.env.ELASTICSEARCH_PASSWORD ?? undefined,

  // Qdrant vector DB (REST)
  QDRANT_URL: process.env.QDRANT_URL ?? "http://localhost:6333",
  QDRANT_API_KEY: process.env.QDRANT_API_KEY ?? undefined, // optional

  // Gemini / LLM API key
  GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? undefined, // optional but recommended

  // Webhooks / Notifications
  SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL ?? undefined,
  WEBHOOK_SITE_URL: process.env.WEBHOOK_SITE_URL ?? undefined,

  // IMAP accounts (array)
  IMAP_ACCOUNTS,

  // Other optional config
  LOG_LEVEL: process.env.LOG_LEVEL ?? "info",
};

// Basic runtime checks (warn or throw as appropriate)
if (ENV.IMAP_ACCOUNTS.length === 0) {
  // Not throwing here — some environments (tests) may not have IMAP accounts.
  console.warn(
    "[env] Warning: No IMAP accounts configured. Set IMAP_ACCOUNTS or IMAP_USER/IMAP_PASS/IMAP_HOST in .env"
  );
}

export default ENV;
