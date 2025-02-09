import React from "react";
import { withFallback } from "vike-react-query";
import { NestableItemsProvider } from "@/providers/nestableItemsProvider";
import { Button } from "@/components/ui/button";
import AddItemForm from "./AddItemForm";
import MenuEditor from "./MenuEditor";
import { RotateCcw } from "lucide-react";

const CreateOrEditNavMenu = withFallback(
  () => {
    return (
      <NestableItemsProvider>
        <div className="flex flex-col md:flex-row max-w-screen-md gap-x-6">
          <div className="basis-1/2">
            <h2 className="mb-2">Add Menu Item</h2>
            <AddItemForm />
          </div>
          <div className="basis-1/2">
            <h2 className="mb-2">Menu Structure</h2>
            <MenuEditor />
          </div>
        </div>
      </NestableItemsProvider>
    );
  },
  () => <div>Loading Nav Menus...</div>,
  ({ retry, error }) => (
    <div>
      <div>Failed to load Nav Menus: {error.message}</div>
      <Button variant="destructive" onClick={() => retry()}>
        <RotateCcw />
        Retry
      </Button>
    </div>
  ),
);

export default CreateOrEditNavMenu;
