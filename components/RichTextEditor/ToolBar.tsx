import React, { useCallback, useState } from "react";
import { type Editor, BubbleMenu } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  AlignCenter,
  AlignLeft,
  AlignRight,
  List,
  ListOrdered,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
  Link2,
  Trash2,
  PencilLine,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { LinkModal } from "./LinkModal";
import { Button } from "../ui/button";

interface ToolBarProps {
  editor: Editor | null;
}

export default function ToolBar({ editor }: ToolBarProps) {
  if (!editor) return null;

  const [modalIsOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState<string>("");

  const openModal = useCallback(() => {
    setUrl(editor.getAttributes("link").href);
    setIsOpen(true);
  }, [editor]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setUrl("");
  }, []);

  const saveLink = useCallback(() => {
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    closeModal();
  }, [editor, url, closeModal]);

  const removeLink = useCallback(() => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    closeModal();
  }, [editor, closeModal]);

  const Options = [
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold"),
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
    },
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive("heading", { level: 3 }),
    },
    {
      icon: <Link2 className="size-4" />,
      onClick: () => openModal(),
      pressed: editor.isActive("link"),
    },
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      pressed: editor.isActive({ textAlign: "left" }),
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      pressed: editor.isActive({ textAlign: "center" }),
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      pressed: editor.isActive({ textAlign: "right" }),
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive("orderedList"),
    },
    {
      icon: <Highlighter className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      pressed: editor.isActive("highlight"),
    },
  ];

  return (
    <>
      <div className="flex justify-start gap-1 flex-wrap border border-b-0 rounded-t-md bg-background p-1.5">
        {Options.map((option, i) => (
          <Toggle variant="default" key={i} size="xs" pressed={option.pressed} onPressedChange={option.onClick}>
            {option.icon}
          </Toggle>
        ))}
      </div>
      <BubbleMenu
        className="flex gap-2 bg-white p-2 border rounded-md"
        tippyOptions={{ duration: 150 }}
        editor={editor}
        shouldShow={({ editor, from, to }) => {
          // only show the bubble menu for links.
          return from === to && editor.isActive("link");
        }}
      >
        <Button type="button" size={"sm"} onClick={openModal}>
          <PencilLine />
          Edit
        </Button>
        <Button variant={"destructive"} type="button" size={"sm"} onClick={removeLink}>
          <Trash2 />
          Remove
        </Button>
      </BubbleMenu>
      <LinkModal
        url={url}
        isOpen={modalIsOpen}
        setIsOpen={setIsOpen}
        onChangeUrl={(e) => setUrl(e.target.value)}
        onSaveLink={saveLink}
        onRemoveLink={removeLink}
      />
    </>
  );
}
