import { z } from "zod";
import { CustomPartialBlock } from "./types";

// Create or edit post form schema
export const postFormSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  slug: z.string().min(1, {
    message: "Slug is required",
  }),
  editorContent: z.custom<CustomPartialBlock[] | "loading">().optional(),
});

// Create or edit category form schema
export const categoryFormSchema = z.object({
  name: z.string().min(1, {
    message: "Title is required",
  }),
  slug: z.string().min(1, {
    message: "Slug is required",
  }),
  description: z.string(),
});

// Create or edit user form schema
export const userFormSchema = z.object({
  profile: z.object({
    name: z.string(),
    username: z.string(),
  }),
  email: z.string(),
  password: z.string(),
  verified: z.boolean(),
});

// Edit profile form schema
export const profileFormSchema = z.object({
  name: z.string(),
  username: z.string(),
  biography: z.string(),
  avatarUrl: z.string(),
});

// Create or edit navigation menu schema
export const navMenuFormSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});
