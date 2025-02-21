import React from "react";
import { GripVertical } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import type { PageComponentType } from "@/lib/types";
import { cn } from "@/lib/utils";

const PageComponentButton = ({ pageComponent }: { pageComponent: PageComponentType }) => {
  const draggable = useDraggable({
    id: `component-btn-[${pageComponent.title}]`,
    data: {
      type: pageComponent.title,
      isComponentBtn: true,
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
      <div className="flex flex-row items-center py-2">{pageComponent.title}</div>
    </button>
  );
};

export const PageComponentButtonDragOverlay = ({ pageComponent }: { pageComponent: PageComponentType | undefined }) => {
  return (
    <button className="flex items-center gap-x-2 w-full h-9 border-2 border-slate-500 rounded-sm bg-accent text-accent-foreground cursor-grab">
      <div className="flex items-center bg-background rounded-l-sm h-full px-1">
        <GripVertical size={16} />
      </div>
      <div className="flex flex-row items-center py-2">{pageComponent?.title}</div>
    </button>
  );
};

export default PageComponentButton;
