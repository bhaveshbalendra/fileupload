import { Router } from "express";
import {
  loginController,
  registerController,
} from "../../controllers/auth.controller";
import { validateBody } from "../../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../../validators/auth.validator";

const router = Router();

router.post(
  "/register",
  validateBody(registerSchema), // 1. Validation
  registerController // 2. Business logic
);

router.post(
  "/login",
  validateBody(loginSchema), // 1. Validation
  loginController // 2. Business logic
);

export default router;
