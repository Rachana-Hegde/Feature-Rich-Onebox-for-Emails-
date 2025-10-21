import React, { useEffect, useState } from "react";
import EmailList from "../components/EmailList";

interface Email {
  id: string;
  subject: string;
  body: string;
  from: string;
  to: string[];
  date: string;
  aiCategory: string;
}

const HomePage: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState("gmail"); // default provider

  const loadEmails = async () => {
    setLoading(true); // start loading
    try {
      const res = await fetch("http://localhost:5000/api/emails");
      const data = await res.json();

      // Filter emails based on selected provider
      const filteredEmails: Email[] = data.data.filter((e: Email) =>
        e.from.toLowerCase().includes(provider)
      );

      // Sort by date descending and pick latest 3 emails
      filteredEmails.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setEmails(filteredEmails.slice(0, 3));
    } catch (err) {
      console.error("Failed to fetch emails:", err);
      setEmails([]); // clear emails if error
    } finally {
      setLoading(false); // stop loading
    }
  };

  // Fetch emails whenever provider changes
  useEffect(() => {
    loadEmails();
  }, [provider]);

  return (
    <div className="homepage container">
      <h1>ReachInbox OneBox</h1>

      {/* Provider Dropdown */}
      <select
        value={provider}
        onChange={(e) => setProvider(e.target.value)}
        style={{ marginBottom: "20px" }}
      >
        <option value="gmail">Gmail</option>
        <option value="outlook">Outlook</option>
        <option value="yahoo">Yahoo</option>
      </select>

      {/* Refresh Button */}
      <button onClick={loadEmails} style={{ marginLeft: "10px" }}>
        Refresh
      </button>

      {/* Loading Indicator */}
      {loading ? (
        <p>Loading emails...</p>
      ) : emails.length === 0 ? (
        <p>No {provider} emails found.</p>
      ) : (
        <EmailList emails={emails} />
      )}
    </div>
  );
};

export default HomePage;
