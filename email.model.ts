// backend/src/models/email.model.ts

/**
 * Represents a single email stored and indexed in Elasticsearch.
 * This aligns with the assignment's EmailDocument interface.
 * 
 * Fields:
 *  - id: Unique message ID (from IMAP)
 *  - accountId: Identifier for which email account this belongs to
 *  - folder: e.g., INBOX, Sent, etc.
 *  - subject: Email subject line
 *  - body: Plain-text version of email body
 *  - from: Sender address
 *  - to: Recipient addresses
 *  - date: Message sent/received date
 *  - aiCategory: LLM-based category tag
 *  - indexedAt: Timestamp when stored in Elasticsearch
 */

export type AICategory =
  | "Interested"
  | "Meeting Booked"
  | "Not Interested"
  | "Spam"
  | "Out of Office"
  | "General"
  | "Work"
  | "Uncategorized";

/**
 * Core Email interface for both persistence and indexing.
 */
export interface EmailDocument {
  id: string;
  accountId: string;
  folder: string; // INBOX, Sent, etc.
  subject: string;
  body: string;
  from: string;
  to: string[];
  date: Date;
  aiCategory: AICategory;
  indexedAt: Date;
}

/**
 * Represents a partial email object that can be passed
 * during the initial sync (when body might not be fetched yet).
 */
export type PartialEmail = Partial<EmailDocument> & {
  id: string;
  accountId: string;
};

/**
 * Helper: used for Elasticsearch index mapping (for setup)
 */
export const EMAIL_INDEX_NAME = "emails";

export const EMAIL_INDEX_MAPPING = {
  mappings: {
    properties: {
      subject: { type: "text" },
      body: { type: "text" },
      accountId: { type: "keyword" },
      folder: { type: "keyword" },
      date: { type: "date" },
      aiCategory: { type: "keyword" },
      from: { type: "keyword" },
      to: { type: "keyword" },
      indexedAt: { type: "date" },
    },
  },
};

/**
 * Utility: default category assigned before AI categorization
 */
export const DEFAULT_CATEGORY: AICategory = "Uncategorized";
