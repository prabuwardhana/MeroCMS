import { Types } from "mongoose";
import { z } from "zod";

export const createProfileSchema = z.object({
  name: z.string().min(5).max(255),
  username: z.string().min(5).max(255),
  biography: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export const createUserSchema = z.object({
  _id: z.custom<Types.ObjectId>(),
  email: z.string().email().min(1).max(255),
  password: z.string().min(6).max(255),
  verified: z.boolean(),
  profile: createProfileSchema,
});
