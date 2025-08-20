"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const healthCheck_controller_1 = require("../controllers/healthCheck.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", healthCheck_controller_1.handleHealthCheck);
router.get("/me", auth_middleware_1.requireAuth, (_req, res) => {
    return res.json({ ok: true });
});
exports.default = router;
