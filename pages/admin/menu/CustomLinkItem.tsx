import React, { type ChangeEvent, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import { useNestableItemsContext } from "@/providers/hooks/useNestableItemsContext";

import { Button } from "@/components/ui/button";
import Accordion from "@/components/ui/accordion";

const CustomLinkItem = () => {
  const [navName, setNavName] = useState("");
  const [navUrl, setNavUrl] = useState("");
  const { items, updateItems } = useNestableItemsContext();

  return (
    <Accordion className="border-b" title="Custom Link" open={true}>
      <div className="grid grid-cols-4 md:grid-cols-6 gap-3 font-semibold mb-4">
        <div className="flex items-center">
          <label htmlFor="NavName">Label</label>
        </div>
        <div className="flex items-center col-span-3 md:col-span-5">
          <input
            id="NavName"
            type="text"
            value={navName}
            className="block border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNavName(e.target.value)}
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="NavUrl">URL</label>
        </div>
        <div className="flex items-center col-span-3 md:col-span-5">
          <input
            id="NavUrl"
            type="text"
            value={navUrl}
            className="block border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNavUrl(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col items-end">
        <Button onClick={() => updateItems([...items, { id: `${uuidv4()}`, name: `${navName}`, url: `${navUrl}` }])}>
          Add to Menu
        </Button>
      </div>
    </Accordion>
  );
};

export default CustomLinkItem;
