import React, { useCallback, useState } from "react";

// BlockNote import
import { createReactBlockSpec } from "@blocknote/react";

import ReactCodeMirror from "@uiw/react-codemirror";
import { langs } from "@uiw/codemirror-extensions-langs";

// Shadcn components import
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { langTypes } from "./constants";

import { Check, ChevronsUpDown } from "lucide-react";

// Code block style
import "./style.css";
import { CodeBlock } from "@/components/admin/CodeBlock";

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
      const [value, setValue] = useState("");

      const onChange = useCallback(
        (val: string) =>
          editor.updateBlock(block, {
            props: { ...block.props, code: val },
          }),
        [],
      );

      const langType = langTypes.find((a) => a.name === block.props.langName)!;
      const Icon = langType.icon;

      return editor.isEditable ? (
        <div className="w-full">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                data-button-type="lang-selector"
                className="justify-between hover:bg-transparent text-white"
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} />
                  <div className="text-sm">{langName}</div>
                </div>
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search languages..." />
                <CommandList>
                  <CommandEmpty>No languages found.</CommandEmpty>
                  <CommandGroup>
                    {langTypes.map((type) => {
                      const ItemIcon = type.icon;
                      return (
                        <CommandItem
                          key={type.name}
                          value={type.name}
                          onSelect={(currentValue) => {
                            setValue(currentValue === value ? "" : currentValue);
                            setOpen(false);
                            editor.updateBlock(block, {
                              type: "procode",
                              props: { langName: type.name },
                            });
                          }}
                        >
                          <ItemIcon />
                          {type.name}
                          <Check className={cn("ml-auto", value === type.name ? "opacity-100" : "opacity-0")} />
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
