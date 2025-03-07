import React, { ChangeEvent } from "react";
import { Trash2 } from "lucide-react";

import { cn } from "@/core/lib/utils";

import type { RenderItemOptions } from "@/components/NestableList/libs/types";
import SocialIcon from "@/components/SocialIcon";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// render function to render the list items' content
const ListItemContent = ({ item, isAccordionOpen, isCopy, draggableElAttr, eventCallbacks }: RenderItemOptions) => {
  // generate random id for the list item while being dragged to prevent
  // duplicate element id.
  // When being dragged, the list item is copied as drag layer and should not posses
  // The same id as the actual list item.
  const copyElId = Math.random().toString(36).slice(2);

  return (
    <div className="border rounded-sm">
      <div
        className="flex justify-between py-2 px-4 border-b bg-neutral-200 text-slate-900 cursor-grab"
        {...draggableElAttr}
      >
        {item.name ? item.name : "Empty Item"}
        <button
          onClick={(e) => {
            e.preventDefault();
            if (eventCallbacks.onToggleAccordion) eventCallbacks.onToggleAccordion(item);
          }}
        >
          <svg className="fill-slate-600 shrink-0 ml-8" width="12" height="12" xmlns="http://www.w3.org/2000/svg">
            <rect
              y="5"
              width="12"
              height="2"
              rx="1"
              className={`transform origin-center transition duration-200 ease-out ${isAccordionOpen && "!rotate-180"}`}
            />
            <rect
              y="5"
              width="12"
              height="2"
              rx="1"
              className={`transform origin-center rotate-90 transition duration-200 ease-out ${
                isAccordionOpen && "!rotate-180"
              }`}
            />
          </svg>
        </button>
      </div>

      <div
        className={cn(
          "grid overflow-hidden transition-all duration-300 ease-in-out rounded-sm text-primary text-sm bg-card",
          isAccordionOpen && "grid-rows-[1fr] opacity-100 p-4",
          !isAccordionOpen && "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden space-y-6">
          {item.type !== "social-link-item" && item.name && (
            <div className="space-y-2">
              <Label htmlFor={isCopy ? `nameInputCopy-${copyElId}` : `nameInput-${item.id}`}>Navigation Label</Label>
              <Input
                id={isCopy ? `nameInputCopy-${copyElId}` : `nameInput-${item.id}`}
                type="text"
                value={item.name}
                className="box-border rounded-md border bg-background text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  eventCallbacks.onInputChange("name", e.target.value, item)
                }
              />
            </div>
          )}

          {item.type === "social-link-item" && item.name && (
            <div className="flex gap-4 items-center">
              <span>Icon </span>
              <SocialIcon name={item.name} size="24" />
            </div>
          )}

          {item.url && (
            <div className="space-y-2">
              <Label htmlFor={isCopy ? `urlInputCopy-${copyElId}` : `urlInput-${item.id}`}>Navigation URL</Label>
              <Input
                id={isCopy ? `urlInputCopy-${copyElId}` : `urlInput-${item.id}`}
                type="text"
                value={item.url}
                className="box-border rounded-md border bg-background text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  eventCallbacks.onInputChange("url", e.target.value, item)
                }
              />
            </div>
          )}

          {item.description && (
            <div className="space-y-2">
              <Label htmlFor={isCopy ? `descriptionInputCopy-${copyElId}` : `descriptionInput-${item.id}`}>
                Description
              </Label>
              <Textarea
                id={isCopy ? `descriptionInputCopy-${copyElId}` : `descriptionInput-${item.id}`}
                value={item.description}
                className="box-border rounded-md border bg-background text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  eventCallbacks.onInputChange("description", e.target.value, item)
                }
              />
            </div>
          )}
          <div className="flex flex-col items-end">
            <Button
              variant="link"
              className="p-0 flex justify-center items-center text-sm text-destructive"
              onClick={(e) => {
                e.preventDefault();
                eventCallbacks.onRemoveItem(item.id);
              }}
            >
              <Trash2 />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItemContent;
