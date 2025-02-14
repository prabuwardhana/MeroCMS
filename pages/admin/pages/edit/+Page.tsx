export default Page;
import React from "react";
import { DndContext } from "@dnd-kit/core";
import DragOverlayWrapper from "@/components/DragOverlayWrapper";
import CreateOrEditPage from "../CreateOrEditPage";

function Page() {
  return (
    <DndContext>
      <CreateOrEditPage />
      <DragOverlayWrapper />
    </DndContext>
  );
}
