export default Page;
import React from "react";
import CreateOrEditPage from "../CreateOrEditPage";
import { DndContext } from "@dnd-kit/core";
import DragOverlayWrapper from "@/components/DragOverlayWrapper";

function Page() {
  return (
    <DndContext>
      <CreateOrEditPage />
      <DragOverlayWrapper />
    </DndContext>
  );
}
