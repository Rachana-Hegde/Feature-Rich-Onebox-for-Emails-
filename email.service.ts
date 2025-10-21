import { EmailDocument } from "../models/email.model";
import { mockEmails } from "../data/mockEmails";

export async function searchEmails(
  query: string,
  accountId?: string,
  folder?: string
): Promise<EmailDocument[]> {
  let emails = mockEmails;

  if (accountId) {
    emails = emails.filter((e) => e.accountId === accountId);
  }
  if (folder) {
    emails = emails.filter((e) => e.folder === folder);
  }
  if (query) {
    emails = emails.filter(
      (e) =>
        e.subject.toLowerCase().includes(query.toLowerCase()) ||
        e.body.toLowerCase().includes(query.toLowerCase())
    );
  }
  return emails;
}
