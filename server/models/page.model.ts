import mongoose from "mongoose";
import { Schema } from "mongoose";

export interface PageDocument extends mongoose.Document<mongoose.Types.ObjectId> {
  title: string;
  slug: string;
  fields?: Array<Record<string, string>>;
  published: boolean;
  publishedAt: Date | null;
  author: mongoose.Types.ObjectId;
  coverImageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const pageSchema = new mongoose.Schema<PageDocument>(
  {
    title: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    fields: { type: [Schema.Types.Mixed], default: [] },
    published: { type: Boolean, required: true, default: false },
    publishedAt: { type: Date },
    author: { ref: "User", type: mongoose.Schema.Types.ObjectId },
    coverImageUrl: { type: String },
  },
  {
    timestamps: true,
  },
);

const PageModel = mongoose.model<PageDocument>("Page", pageSchema);

export default PageModel;
