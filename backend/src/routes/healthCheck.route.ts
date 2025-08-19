import { Router } from "express";
import { handleHealthCheck } from "../controllers/healthCheck.controller";

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

export default router;
