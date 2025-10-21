// backend/src/routes/account.routes.ts
import { Router } from "express";
import { getAccounts } from "../controllers/account.controller";

const router = Router();

// GET /api/accounts → list IMAP accounts
router.get("/", getAccounts);

export default router;
