import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import { cn } from "@/lib/utils";
import ToolBar from "./ToolBar";

const RichTextEditor = ({
  content,
  cleared,
  onChange,
  className,
}: {
  content: string | undefined;
  onChange: (richText: string) => void;
  className?: string;
  cleared?: boolean;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "min-h-[96px] border rounded-b-md py-2 px-3 text-sm",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (cleared) editor?.commands.clearContent();
  }, [cleared]);

  return (
    <div>
      <ToolBar editor={editor} />
      <EditorContent editor={editor} className={cn(className)} />
    </div>
  );
};

export default RichTextEditor;
