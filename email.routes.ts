import { Router } from "express";
import { mockEmails } from "../data/mockEmails";

const router = Router();

// GET /api/emails - return all mock emails
router.get("/", (req, res) => {
  return res.json({
    success: true,
    data: mockEmails,
  });
});

export default router;
