import React, { useState } from "react";
import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import { usePageWidgetsStore } from "@/src/store/pageComponentsStore";
import { PageWidgetButtonDragOverlay } from "@/components/PageWidgetButton";

const DragOverlayWrapper = () => {
  const { pageWidgets } = usePageWidgetsStore();
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);

  useDndMonitor({
    onDragStart: (event) => {
      setDraggedItem(event.active);
    },
    onDragCancel: () => {
      setDraggedItem(null);
    },
    onDragEnd: () => {
      setDraggedItem(null);
    },
  });

  if (!draggedItem) return null;

  let node = <div>no drag overlay</div>;
  const isPageWidgetBtn = draggedItem?.data?.current?.isPageWidgetBtn;
  const type = draggedItem?.data?.current?.type;

  if (isPageWidgetBtn) {
    node = <PageWidgetButtonDragOverlay pageWidget={pageWidgets.find((item) => item.title === type)} />;
  }

  return <DragOverlay>{node}</DragOverlay>;
};

export default DragOverlayWrapper;
