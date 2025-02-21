import React from "react";

import { insertOrUpdateBlock } from "@blocknote/core";

import { schema } from "../../custom-schemas";

import { TriangleAlert } from "lucide-react";

// Slash menu item to insert an Alert block
export const insertAlert = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Alert",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "alert",
    });
  },
  aliases: ["alert", "notification", "emphasize", "warning", "error", "info", "success"],
  group: "Other",
  icon: <TriangleAlert />,
});
