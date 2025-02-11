import mongoose from "mongoose";

export interface ComponentFieldDocument extends mongoose.Document<mongoose.Types.ObjectId> {
  _id: mongoose.Types.ObjectId;
  name: string;
  label: string;
  type: string;
}

export interface ComponentDocument extends mongoose.Document<mongoose.Types.ObjectId> {
  title: string;
  fields: ComponentFieldDocument;
  createdAt: Date;
  updatedAt: Date;
}

const componentFieldSchema = new mongoose.Schema<ComponentFieldDocument>({
  name: { type: String },
  label: { type: String },
  type: { type: String },
});

const componentSchema = new mongoose.Schema<ComponentDocument>(
  {
    title: { type: String, required: true, unique: true },
    fields: [componentFieldSchema],
  },
  {
    timestamps: true,
  },
);

const ComponentModel = mongoose.model<ComponentDocument>("Component", componentSchema);

export default ComponentModel;
