// React hooks import
import React, { useMemo } from "react";

// BlockNote import
import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/shadcn";

// local import
import { CustomPartialBlock } from "./types";
import { schema } from "./custom-schemas";

// BlockNote Shadcn styles
import "@blocknote/shadcn/style.css";

interface EditorPreviewProps {
  initialContent: CustomPartialBlock[] | undefined | "loading";
}

export const EditorPreview = ({ initialContent }: EditorPreviewProps) => {
  // Creates a new editor instance.
  // We use useMemo + createBlockNoteEditor instead of useCreateBlockNote so we
  // can delay the creation of the editor until the initial content is loaded.
  const editor = useMemo(() => {
    if (initialContent === "loading") {
      return undefined;
    }
    return BlockNoteEditor.create({ schema, initialContent });
  }, [initialContent]);

  // Our editor is still loading the content. Wait for it!
  if (editor === undefined) {
    return "Loading content...";
  }

  return <BlockNoteView editor={editor} editable={false} className="preview"></BlockNoteView>;
};
