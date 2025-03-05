import React from "react";

import { insertOrUpdateBlock } from "@blocknote/core";
import { MdCode } from "react-icons/md";

import { CustomBlockNoteEditor } from "../../types";

// Slash menu item to insert an Alert block
export const insertCodeEditor = (editor: CustomBlockNoteEditor) => ({
  title: "Code",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "procode",
    });
  },
  aliases: ["code"],
  group: "Other",
  icon: <MdCode />,
  subtext: "Insert a code block.",
});
