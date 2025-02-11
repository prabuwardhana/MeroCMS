import mongoose from "mongoose";

export interface CategoryDocument extends mongoose.Document<mongoose.Types.ObjectId> {
  name: string;
  slug: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new mongoose.Schema<CategoryDocument>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);

const CategoryModel = mongoose.model<CategoryDocument>("Category", categorySchema);

export default CategoryModel;
