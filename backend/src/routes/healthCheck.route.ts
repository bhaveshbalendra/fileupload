import { Router } from "express";
import { handleHealthCheck } from "../controllers/healthCheck.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

//Health Check Route
/**
 * @swagger
 * /:
 *   get:
 *     summary: Returns a health check message
 *     responses:
 *       200:
 *         description: A successful response
 */
router.get("/", handleHealthCheck);
router.get("/me", requireAuth, (_req, res) => {
  // @ts-ignore
  return res.json({ ok: true });
});

export default router;
