import React from "react";
import { z } from "zod";
import Role from "@/constants/role";
import { CustomPartialBlock } from "@/components/admin/Blocknote";
import { Item } from "@/components/admin/NestableList/libs/types";
import { commentFormSchema, pageWidgetFormSchema, pageFormSchema, postFormSchema } from "./schemas";

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
  _id: string | null;
  profile: UserProfile;
  email: string;
  role?: Role;
  password: string;
  verified: boolean;
};
export type UserMutationResponseType = { user: User; message: string };

export type CategoryType = {
  _id: string | null;
  name: string;
  slug: string;
  description: string;
};
export type CategoryMutationResponseType = { category: CategoryType; message: string };

export type TextInputType = "rich-text" | "long-text" | "short-text";
export type PageType = z.infer<typeof pageFormSchema> & {
  _id: string | null;
  published: boolean;
  publishedAt: Date | string | null;
  fields?: Record<string, string>[];
  author: string | null;
  updatedAt: Date | null;
};
export type PageMutationResponseType = { page: PageType; message: string };

export type PostType = z.infer<typeof postFormSchema> & {
  _id: string | null;
  editorDocument?: CustomPartialBlock[] | undefined | "loading";
  documentHtml?: string;
  published: boolean;
  publishedAt: Date | string | null;
  coverImage: CloudinaryResourceType;
  categories: string[];
  author: string | null;
  updatedAt: Date | null;
};
export type PostMutationResponseType = { post: PostType; message: string };

export type PostDtoType = PostType & {
  author: UserProfile;
};

export type CommentType = z.infer<typeof commentFormSchema> & {
  _id: string | null;
  author: User | null;
  post: Pick<PostType, "title" | "slug">;
  parentId: string | null;
  edited: boolean;
  approved: boolean;
  children?: Array<CommentType>;
  createdAt?: Date | null;
};
export type CommentMutationResponseType = { comment: CommentType; message: string };

export type NavMenuType = {
  _id: string | null;
  title: string | undefined;
  navItems: Item[];
};
export type NavMenuResponseType = { navMenu: NavMenuType; message: string };

export type TableType =
  | "posts"
  | "comments"
  | "categories"
  | "pages"
  | "products"
  | "portfolios"
  | "users"
  | "navmenu"
  | "page widgets";

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

export type PageWidgetFieldType = {
  fieldId: string;
  name: string;
  label: string;
  type: TextInputType;
};
export type PageWidgetType = z.infer<typeof pageWidgetFormSchema> & {
  _id: string | null;
  fields: PageWidgetFieldType[];
};
export type PageWidgetMutationResponseType = { pageWidget: PageWidgetType; message: string };

export type SocialLinkType = {
  id: string;
  name: string;
};
