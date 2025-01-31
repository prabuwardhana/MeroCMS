import mongoose, { Schema } from "mongoose";

import { CloudinaryResourceType, CustomPartialBlock } from "@/lib/types";

export interface PostDocument extends mongoose.Document<mongoose.Types.ObjectId> {
  title: string;
  slug: string;
  editorContent?: CustomPartialBlock[] | undefined | "loading";
  published: boolean;
  authorId: mongoose.Types.ObjectId;
  coverImage: CloudinaryResourceType;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new mongoose.Schema<PostDocument>(
  {
    title: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    editorContent: { type: Schema.Types.Mixed, required: false, default: undefined },
    published: { type: Boolean, required: true, default: false },
    authorId: { ref: "User", type: mongoose.Schema.Types.ObjectId },
    coverImage: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
    // https://mongoosejs.com/docs/guide.html#minimize
    // Mongoose will, by default, "minimize" schemas by removing empty objects.
    // This behavior can be overridden by setting minimize option to false. It will then store empty objects.
    // minimizing schema might break the document structure of BlockNote PartialBlock (editorContent).
    minimize: false,
  },
);

const PostModel = mongoose.model<PostDocument>("Post", postSchema);

export default PostModel;
