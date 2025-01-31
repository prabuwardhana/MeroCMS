import { z } from "zod";
import { Types } from "mongoose";
import { formSchema } from "./schemas";
import { schema } from "@/components/blocknote/custom-schemas";

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

export type PostType = z.infer<typeof formSchema> & {
  published: boolean;
  coverImage: CloudinaryResourceType;
  authorId: Types.ObjectId | undefined;
  updatedAt: Date | null;
};
export type PostMutationResponseType = { post: PostType & { _id: Types.ObjectId }; message: string };

// Since we are using a custom schema for the BlockNote,
// using the default BlockNoteEditor and PartialBlock type
// to anotate our editor and the editor content (document) simply won't work.
// TypeScript will complaint about missing custom block!
// https://www.blocknotejs.org/docs/custom-schemas#usage-with-typescript
export type CustomBlockNoteEditor = typeof schema.BlockNoteEditor;
export type CustomPartialBlock = typeof schema.PartialBlock;
