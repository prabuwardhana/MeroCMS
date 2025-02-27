import mongoose, { Schema } from "mongoose";

import type { Item } from "@/components/admin/NestableList/libs/types";

export interface NavMenuDocument extends mongoose.Document<mongoose.Types.ObjectId> {
  title: string;
  navItems?: Item[];
}

const postSchema = new mongoose.Schema<NavMenuDocument>(
  {
    title: { type: String, required: true, unique: true },
    navItems: { type: Schema.Types.Mixed, required: false, default: [] },
  },
  {
    timestamps: true,
  },
);

const NavMenuModel = mongoose.model<NavMenuDocument>("NavMenu", postSchema);

export default NavMenuModel;
