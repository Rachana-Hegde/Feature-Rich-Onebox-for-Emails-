import express from "express";
import cors from "cors";
// import { startImapListeners } from "./services/imap.service"; // ✅ IMAP disabled
// import { ensureEmailIndex } from "./services/email.service"; // ✅ Elasticsearch disabled
import { searchEmails } from "./services/email.service";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Home route
app.get("/", (req, res) => {
  res.json({ success: true, message: "ReachInbox Onebox Backend API is running 🚀" });
});

// Emails API
app.get("/api/emails", async (req, res) => {
  try {
    const query = req.query.q as string;
    const emails = await searchEmails(query);
    res.json({ success: true, data: emails });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  // startImapListeners(); // ✅ Disabled
  // ensureEmailIndex();   // ✅ Disabled
});
