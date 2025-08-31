import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .email("Invalid email address")
  .min(1)
  .max(255);

const passwordSchema = z.string().trim().min(4);

const registerSchema = z.object({
  name: z.string().trim().min(1),
  email: emailSchema,
  password: passwordSchema,
  profilePicture: z.string().optional(),
});

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

type RegisterSchemaType = z.infer<typeof registerSchema>;
type LoginSchemaType = z.infer<typeof loginSchema>;

export {
  emailSchema,
  loginSchema,
  LoginSchemaType,
  passwordSchema,
  registerSchema,
  RegisterSchemaType,
};
