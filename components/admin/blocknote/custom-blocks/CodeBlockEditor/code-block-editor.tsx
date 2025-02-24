import React from "react";

import { insertOrUpdateBlock } from "@blocknote/core";

import { CustomBlockNoteEditor } from "../../types";

import { MdCode } from "react-icons/md";

// Slash menu item to insert an Alert block
export const insertCode = (editor: CustomBlockNoteEditor) => ({
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
