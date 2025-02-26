import mongoose from "mongoose";

export interface PageWidgetFieldDocument extends mongoose.Document<mongoose.Types.ObjectId> {
  name: string;
  label: string;
  type: string;
}

export interface PageWidgetDocument extends mongoose.Document<mongoose.Types.ObjectId> {
  title: string;
  fields: PageWidgetFieldDocument;
  createdAt: Date;
  updatedAt: Date;
}

const pageWidgetFieldSchema = new mongoose.Schema<PageWidgetFieldDocument>({
  name: { type: String },
  label: { type: String },
  type: { type: String },
});

const pageWidgetSchema = new mongoose.Schema<PageWidgetDocument>(
  {
    title: { type: String, required: true, unique: true },
    fields: [pageWidgetFieldSchema],
  },
  {
    timestamps: true,
  },
);

const PageWidgetModel = mongoose.model<PageWidgetDocument>("PageWidget", pageWidgetSchema);

export default PageWidgetModel;
