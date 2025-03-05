import React, { useCallback, useState } from "react";

// BlockNote import
import { createReactBlockSpec } from "@blocknote/react";

import ReactCodeMirror from "@uiw/react-codemirror";
import { langs } from "@uiw/codemirror-extensions-langs";

import { langTypes } from "./constants";

// Code block style
import "./style.css";
import { CodeBlock } from "@/components/CodeBlock";
import { DropdownSelectWithIcon } from "@/components/Dropdowns";
import { IconListType } from "@/lib/types";

type langNameList = "css" | "javascript" | "jsx" | "typescript" | "tsx" | undefined;

export const CodeBlockEditor = createReactBlockSpec(
  {
    type: "procode",
    propSchema: {
      code: {
        default: "",
        values: [] as Array<string>,
      },
      langName: {
        default: "typescript",
        values: ["css", "javascript", "jsx", "typescript", "tsx"],
      },
    },
    content: "none",
  },
  {
    render: ({ block, editor }) => {
      const { code, langName } = block.props;

      const [open, setOpen] = useState(false);
      const [value, setValue] = useState("typescript");

      const onChange = useCallback(
        (val: string) =>
          editor.updateBlock(block, {
            props: { ...block.props, code: val },
          }),
        [],
      );

      const handleSelect = (currentValue: string, type?: IconListType) => {
        setValue(currentValue === value ? "" : currentValue);
        setOpen(false);
        editor.updateBlock(block, {
          type: "procode",
          props: { langName: type?.name as langNameList },
        });
      };

      return editor.isEditable ? (
        <div className="w-full">
          <DropdownSelectWithIcon
            icons={langTypes}
            value={langName}
            open={open}
            setOpen={setOpen}
            onSelect={handleSelect}
          />
          <ReactCodeMirror
            id={block?.id}
            autoFocus
            placeholder={"Write your code here..."}
            style={{ resize: "vertical" }}
            extensions={[langs[langName]()]}
            value={code}
            theme={"dark"}
            editable={editor.isEditable}
            maxHeight="300px"
            width="100%"
            onChange={onChange}
          />
        </div>
      ) : (
        <CodeBlock code={code} language={langName} className="text-white" enableCopy={false} />
      );
    },
  },
);
