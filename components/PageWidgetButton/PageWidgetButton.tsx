import React from "react";
import { GripVertical } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import type { PageWidgetType } from "@/core/lib/types";
import { cn } from "@/core/lib/utils";

export const PageWidgetButton = ({ pageWidget }: { pageWidget: PageWidgetType }) => {
  const draggable = useDraggable({
    id: `page-widget-btn-[${pageWidget.title}]`,
    data: {
      type: pageWidget.title,
      isPageWidgetBtn: true,
    },
  });
  return (
    <button
      ref={draggable.setNodeRef}
      className={cn(
        "flex items-center gap-x-2 w-full h-9 border-2 border-slate-200 dark:border-accent rounded-sm bg-slate-200 dark:bg-accent text-accent-foreground cursor-grab",
        draggable.isDragging && "border-2 border-primary",
      )}
      {...draggable.listeners}
      {...draggable.attributes}
    >
      <div className="flex items-center bg-slate-300 dark:bg-background rounded-l-sm h-full px-1">
        <GripVertical size={16} />
      </div>
      <div className="flex items-center text-left py-2 text-xs">{pageWidget.title}</div>
    </button>
  );
};

export const PageWidgetButtonDragOverlay = ({ pageWidget }: { pageWidget: PageWidgetType | undefined }) => {
  return (
    <button className="flex items-center gap-x-2 w-full h-9 border-2 border-slate-500 rounded-sm bg-accent text-accent-foreground cursor-grab">
      <div className="flex items-center bg-background rounded-l-sm h-full px-1">
        <GripVertical size={16} />
      </div>
      <div className="flex items-center text-left py-2 text-xs">{pageWidget?.title}</div>
    </button>
  );
};
