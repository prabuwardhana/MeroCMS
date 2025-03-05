import React from "react";

import { SideMenuProps, useComponentsContext } from "@blocknote/react";

import { CirclePlus } from "lucide-react";

export const CustomAddBlockButton = (props: SideMenuProps) => {
  const Components = useComponentsContext()!;

  return (
    <Components.SideMenu.Button
      label="Add new block"
      className={"bn-button"}
      // We are using the BlockNote editor inside a form.
      // prevent clicking the block's side menu from submitting the form.
      onClick={(e) => e.preventDefault()}
      icon={
        <CirclePlus
          size={24}
          onClick={() => {
            props.editor.insertBlocks([{ type: "paragraph", content: "" }], props.block.id, "after");
          }}
        />
      }
    />
  );
};
