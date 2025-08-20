import * as z from "zod";
const authValidatorSchema = () => ({
  login: z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
  }),
  signup: z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
  }),
});

export default authValidatorSchema;
