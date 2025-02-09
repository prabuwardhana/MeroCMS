import mongoose, { Schema } from "mongoose";

import { Item } from "@/components/NestableList/Libs/types";

export interface NavMenuDocument extends mongoose.Document<mongoose.Types.ObjectId> {
  title: string;
  navMenuContent?: Item[];
}

const postSchema = new mongoose.Schema<NavMenuDocument>(
  {
    title: { type: String, required: true, unique: true },
    navMenuContent: { type: Schema.Types.Mixed, required: false, default: [] },
  },
  {
    timestamps: true,
  },
);

const NavMenuModel = mongoose.model<NavMenuDocument>("NavMenu", postSchema);

export default NavMenuModel;
