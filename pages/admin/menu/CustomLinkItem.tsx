import React, { type ChangeEvent, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import { useNestableItemsContext } from "@/components/NestableList/providers/useNestableItemsContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Accordion from "@/components/ui/accordion";

const CustomLinkItem = () => {
  const [navName, setNavName] = useState("");
  const [navUrl, setNavUrl] = useState("");
  const { items, updateItems } = useNestableItemsContext();

  return (
    <Accordion className="border-b" title="Custom Link">
      <div className="grid grid-cols-4 md:grid-cols-6 gap-3 font-semibold mb-4">
        <div className="flex items-center">
          <Label htmlFor="NavName" className="text-primary">
            Label
          </Label>
        </div>
        <div className="flex items-center col-span-3 md:col-span-5">
          <Input
            id="NavName"
            type="text"
            value={navName}
            className="box-border rounded-md border bg-background text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNavName(e.target.value)}
          />
        </div>
        <div className="flex items-center">
          <Label htmlFor="NavUrl" className="text-primary">
            URL
          </Label>
        </div>
        <div className="flex items-center col-span-3 md:col-span-5">
          <Input
            id="NavUrl"
            type="text"
            value={navUrl}
            className="box-border rounded-md border bg-background text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
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
