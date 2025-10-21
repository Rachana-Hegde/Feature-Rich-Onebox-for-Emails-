// frontend/src/services/emailApi.ts
export interface Email {
  id: string;
  subject: string;
  body: string;
  from: string;
  to: string[];
  date: string;
  aiCategory: string;
}

export async function fetchEmails(
  searchTerm: string = "",
  filter: string = ""
): Promise<Email[]> {
  try {
    const params = new URLSearchParams();
    if (searchTerm) params.append("query", searchTerm);
    if (filter) params.append("filter", filter);

    const res = await fetch(`http://localhost:5000/api/emails?${params.toString()}`);
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error("Error fetching emails:", err);
    return [];
  }
}
