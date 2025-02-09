import React from "react";
import { withFallback } from "vike-react-query";
import AddItemForm from "./AddItemForm";
import MenuEditor from "./MenuEditor";
import { NestableItemsProvider } from "@/providers/nestableItemsProvider";

const CreateOrEditNavMenu = withFallback(() => {
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
});

export default CreateOrEditNavMenu;
