import React from "react";

// BlockNote import
import { defaultProps } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";

// Icons import
import { CircleX, CircleAlert, CircleCheck, Info } from "lucide-react";

// Shadcn components import
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Alert block style
import "./style.css";

// The types of alerts that users can choose from.
const alertTypes = [
  {
    title: "Warning",
    value: "warning",
    icon: CircleAlert,
    color: "#e69819",
    backgroundColor: {
      light: "#fff6e6",
      dark: "#805d20",
    },
  },
  {
    title: "Error",
    value: "error",
    icon: CircleX,
    color: "#d80d0d",
    backgroundColor: {
      light: "#ffe6e6",
      dark: "#802020",
    },
  },
  {
    title: "Info",
    value: "info",
    icon: Info,
    color: "#507aff",
    backgroundColor: {
      light: "#e6ebff",
      dark: "#203380",
    },
  },
  {
    title: "Success",
    value: "success",
    icon: CircleCheck,
    color: "#0bc10b",
    backgroundColor: {
      light: "#e6ffe6",
      dark: "#208020",
    },
  },
] as const;

// The Alert block.
export const Alert = createReactBlockSpec(
  {
    type: "alert",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      type: {
        default: "warning",
        values: ["warning", "error", "info", "success"],
      },
    },
    content: "inline",
  },
  {
    render: ({ block, editor, contentRef }) => {
      const alertType = alertTypes.find((a) => a.value === block.props.type)!;
      const Icon = alertType.icon;
      return (
        <div className={"alert"} data-alert-type={block.props.type}>
          {/*Icon which opens a menu to choose the Alert type*/}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className={"alert-icon-wrapper"} contentEditable={false}>
                <Icon className={"alert-icon"} data-alert-icon-type={block.props.type} size={32} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Alert Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {alertTypes.map((type) => {
                const ItemIcon = type.icon;

                return (
                  <DropdownMenuItem
                    key={type.value}
                    onClick={() =>
                      editor.updateBlock(block, {
                        type: "alert",
                        props: { type: type.value },
                      })
                    }
                  >
                    <ItemIcon className={"alert-icon"} data-alert-icon-type={type.value} />
                    {type.title}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          {/*Rich text field for user to type in*/}
          <div className={"inline-content"} ref={contentRef} />
        </div>
      );
    },
  },
);
