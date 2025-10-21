// backend/src/config/imapConfig.ts
import ENV, { ImapAccountEnv } from "./env";

/**
 * This file centralizes IMAP connection option shaping.
 * We'll export:
 *  - a typed interface for IMAP connection options
 *  - a function to return the list of configured accounts
 *
 * The actual connection (e.g., using node-imap or mailjs/imap-client)
 * should consume these objects.
 */

export type ImapConnectionOptions = {
  id: string;           // our account id
  user: string;
  password: string;
  host: string;
  port: number;
  tls: boolean;
  mailbox: string;      // folder to monitor (INBOX by default)
  // optional keepalive settings (recommended)
  keepalive?: {
    interval: number;   // ms between NOOPs or checks
    idleTimeout: number;// ms to re-issue IDLE or reconnect before server times out
  };
};

const DEFAULT_KEEPALIVE = {
  interval: 1000 * 60 * 25,    // 25 minutes - we re-assert IDLE/watchdog before a 30m timeout
  idleTimeout: 1000 * 60 * 29, // 29 minutes - to re-send IDLE or reconnect proactively
};

export function getImapAccounts(): ImapConnectionOptions[] {
  const envAccounts: ImapAccountEnv[] = ENV.IMAP_ACCOUNTS;

  return envAccounts.map((a) => ({
    id: a.id,
    user: a.user,
    password: a.password,
    host: a.host,
    port: a.port ?? 993,
    tls: a.tls === undefined ? true : Boolean(a.tls),
    mailbox: a.mailbox ?? "INBOX",
    keepalive: DEFAULT_KEEPALIVE,
  }));
}

/**
 * Helper: get single account by id (or first) — useful when bootstrapping a single connection during dev
 */
export function getImapAccountById(id?: string): ImapConnectionOptions | null {
  const accounts = getImapAccounts();
  if (!accounts.length) return null;
  if (!id) return accounts[0];
  return accounts.find((a) => a.id === id) ?? null;
}
