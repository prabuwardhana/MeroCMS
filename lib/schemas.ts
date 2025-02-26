import { z } from "zod";
import { type CustomPartialBlock } from "@/components/admin/Blocknote";
import Role from "@/constants/role";

// Create or edit post form schema
export const postFormSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  slug: z.string().min(1, {
    message: "Slug is required",
  }),
  excerpt: z.string().optional(),
  editorContent: z.custom<CustomPartialBlock[] | "loading">().optional(),
});

// Create or edit comment form schema
export const commentFormSchema = z.object({
  content: z.string().min(1, {
    message: "Please say something!",
  }),
});

// Create or edit page form schema
export const pageFormSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  slug: z.string().min(1, {
    message: "Slug is required",
  }),
  coverImageUrl: z.string(),
  fields: z.array(z.record(z.string(), z.string())).optional(),
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
  role: z.nativeEnum(Role),
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

// Create or edit component form schema
export const fieldFormSchema = z.object({
  name: z.string().min(1, {
    message: "Field name is required",
  }),
  label: z.string().min(1, {
    message: "Field label is required",
  }),
  type: z.string().min(1, {
    message: "Field type is required",
  }),
});

export const pageWidgetFormSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  fields: z.array(fieldFormSchema).refine(
    (entries) => {
      const names = new Set(entries.map((e) => e.name));
      return names.size === entries.length;
    },
    {
      message: "Field names must be unique!",
    },
  ),
});
