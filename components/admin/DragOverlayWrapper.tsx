import React, { useState } from "react";
import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import { usePageComponentsStore } from "@/store/pageComponentsStore";
import { PageComponentButtonDragOverlay } from "@/components/admin/PageComponentButton";

const DragOverlayWrapper = () => {
  const { pageComponents } = usePageComponentsStore();
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
  const isComponentBtn = draggedItem?.data?.current?.isComponentBtn;
  const type = draggedItem?.data?.current?.type;

  if (isComponentBtn) {
    node = <PageComponentButtonDragOverlay pageComponent={pageComponents.find((item) => item.title === type)} />;
  }

  return <DragOverlay>{node}</DragOverlay>;
};

export default DragOverlayWrapper;
