// React hooks import
import React, { useMemo } from "react";

// BlockNote import
import { BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";
import {
  DragHandleButton,
  getDefaultReactSlashMenuItems,
  SideMenu,
  SideMenuController,
  SuggestionMenuController,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";

// local import
import { CustomBlockNoteEditor, CustomPartialBlock } from "@/lib/types";
import { useTheme } from "@/hooks/useTheme";
import API from "@/config/apiClient";
import { insertAlert } from "./custom-blocks/alert/alert-menu";
import { CustomAddBlockButton } from "./custom-side-menu";
import { schema } from "./custom-schemas";

// BlockNote Shadcn styles
import "@blocknote/shadcn/style.css";

interface EditorProps {
  initialContent: CustomPartialBlock[] | undefined | "loading";
  onChange: (editor: CustomBlockNoteEditor) => void;
}

async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

  const res = await API.post(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return res.data.secure_url;
}

const Editor = ({ initialContent, onChange }: EditorProps) => {
  // BlockNote themes are only available when using the default Mantine components.
  // As we are using BlockNote with shadcn, we need to use our own theme context.
  const { theme } = useTheme();

  // Creates a new editor instance.
  // We use useMemo + createBlockNoteEditor instead of useCreateBlockNote so we
  // can delay the creation of the editor until the initial content is loaded.
  const editor = useMemo(() => {
    if (initialContent === "loading") {
      return undefined;
    }
    return BlockNoteEditor.create({ schema, initialContent, uploadFile });
  }, [initialContent]);

  // Our editor is still loading the content. Wait for it!
  if (editor === undefined) {
    return "Loading content...";
  }

  return (
    <div className="rounded-md border pb-8 pt-8 bg-white dark:bg-[#020817] text-card-foreground">
      <BlockNoteView
        editor={editor}
        // we are using slash menu with our custom item.
        // disable the default one.
        slashMenu={false}
        // we are using side menu with our custom Add Block button.
        // disable the default one.
        sideMenu={false}
        onChange={() => {
          onChange(editor);
        }}
        theme={theme as "light" | "dark"}
      >
        {/* Render our custom side menu */}
        <SideMenuController
          sideMenu={(props) => (
            <SideMenu {...props}>
              <CustomAddBlockButton {...props} />
              <DragHandleButton {...props} />
            </SideMenu>
          )}
        />

        {/* Render our custom suggestion (slash) menu that includes our custom item*/}
        <SuggestionMenuController
          triggerCharacter={"/"}
          getItems={async (query) =>
            // Gets all default slash menu items and `insertAlert` item.
            filterSuggestionItems([...getDefaultReactSlashMenuItems(editor), insertAlert(editor)], query)
          }
        />
      </BlockNoteView>
    </div>
  );
};

export default Editor;
