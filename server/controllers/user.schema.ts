import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email().min(1).max(255),
  password: z.string().min(6).max(255),
  verified: z.boolean(),
});
