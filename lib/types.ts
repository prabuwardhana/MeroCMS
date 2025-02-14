import React from "react";
import { z } from "zod";
import { Types } from "mongoose";
import { componentFormSchema, pageFormSchema, postFormSchema } from "./schemas";
import { schema } from "@/components/blocknote/custom-schemas";
import Role from "@/server/constants/role";
import { Item } from "@/components/NestableList/Libs/types";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export type ExtendedFile = {
  file: File;
  id: string;
  uploadProgress: number;
  uploadStatus: UploadStatus;
};

export type CloudinaryResourceType = {
  bytes: number;
  created_at: string;
  height: number;
  format: string;
  public_id: string;
  display_name: string;
  secure_url: string;
  tags: Array<string>;
  width: number;
};

export type CloudinaryResponseType = {
  result: {
    resources: Array<CloudinaryResourceType>;
    next_cursor: string;
  };
};

export type UserProfile = {
  name: string;
  username: string;
  biography?: string;
  avatarUrl?: string;
};

export type User = {
  _id: Types.ObjectId | undefined;
  profile: UserProfile;
  email: string;
  role?: Role[];
  password: string;
  verified: boolean;
};
export type UserMutationResponseType = { user: User; message: string };

export type CategoryType = {
  _id: Types.ObjectId | null;
  name: string;
  slug: string;
  description: string;
};
export type CategoryMutationResponseType = { category: CategoryType; message: string };

export type TextInputType = "rich-text" | "long-text" | "short-text";
export type PageType = z.infer<typeof pageFormSchema> & {
  _id: Types.ObjectId | null;
  published: boolean;
  fields?: Record<string, string>[];
  author: Types.ObjectId | undefined;
  updatedAt: Date | null;
};
export type PageMutationResponseType = { page: PageType; message: string };

export type PostType = z.infer<typeof postFormSchema> & {
  _id: Types.ObjectId | null;
  published: boolean;
  coverImage: CloudinaryResourceType;
  categories: string[];
  author: Types.ObjectId | undefined;
  updatedAt: Date | null;
};
export type PostMutationResponseType = { post: PostType; message: string };

export type NavMenuType = {
  _id: Types.ObjectId | null;
  title: string | undefined;
  navMenuContent: Item[];
};
export type NavMenuResponseType = { navMenu: NavMenuType; message: string };

// Since we are using a custom schema for the BlockNote,
// using the default BlockNoteEditor and PartialBlock type
// to anotate our editor and the editor content (document) simply won't work.
// TypeScript will complaint about missing custom block!
// https://www.blocknotejs.org/docs/custom-schemas#usage-with-typescript
export type CustomBlockNoteEditor = typeof schema.BlockNoteEditor;
export type CustomPartialBlock = typeof schema.PartialBlock;

export type TableType =
  | "posts"
  | "categories"
  | "pages"
  | "products"
  | "portfolios"
  | "users"
  | "navmenu"
  | "components";

export type FilterOptions = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export type FilterOnType = {
  column: string;
  title: string;
  options: FilterOptions[];
};

export type PageComponentFieldType = {
  fieldId: string;
  name: string;
  label: string;
  type: TextInputType;
};
export type PageComponentType = z.infer<typeof componentFormSchema> & {
  _id: Types.ObjectId | null;
  fields: PageComponentFieldType[];
};
export type PageComponentMutationResponseType = { component: PageComponentType; message: string };
