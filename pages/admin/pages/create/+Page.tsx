export default Page;
import React from "react";
import CreateOrEditPage from "../CreateOrEditPage";
import { DndContext } from "@dnd-kit/core";
import DragOverlayWrapper from "@/components/admin/DragOverlayWrapper";

function Page() {
  return (
    <DndContext>
      <CreateOrEditPage />
      <DragOverlayWrapper />
    </DndContext>
  );
}
