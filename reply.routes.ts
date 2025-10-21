// backend/src/routes/reply.routes.ts
import { Router } from "express";
import { suggestReplyController } from "../controllers/reply.controller";

const router = Router();

// POST /api/emails/:id/suggest-reply
router.post("/:id/suggest-reply", suggestReplyController);

export default router;
