import React, { useCallback, useState } from "react";

import { usePages } from "@/core/hooks/api/usePages";
import type { PageType } from "@/core/lib/types";

import { useNestableItemsContext } from "@/components/NestableList/providers/useNestableItemsContext";
import { Item } from "@/components/NestableList/libs/types";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Accordion from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const PageItems = () => {
  const { pagesQuery } = usePages();

  const [selectedPages, setSelectedPages] = useState<Array<PageType>>([]);
  const { items, addItem } = useNestableItemsContext();

  const findItem = useCallback(
    (id: string, items: Item[]): boolean => {
      const result = items.some((item) => {
        if (item["id"].includes(id)) {
          return true;
        } else if (item["children"]) {
          return findItem(id, item["children"]);
        }
      });

      return result;
    },
    [items],
  );

  return (
    <Accordion className="border-b text-sm" title="Pages" open={true}>
      <Card className="mb-4 border">
        <CardContent className="p-4">
          {pagesQuery.data.map((page) => {
            const isChecked = selectedPages.find((item) => item.title === page.title) ? true : false;
            const isAdded = findItem(page._id as string, items);
            return (
              <div key={page.title} className="flex items-center space-x-2 [&:not(:last-child)]:mb-3">
                <Checkbox
                  id={page.title}
                  checked={isChecked || isAdded}
                  onCheckedChange={(checked: boolean) => {
                    setSelectedPages((prev) => {
                      if (checked) {
                        return Array.from(new Set([...(prev || []), page]));
                      } else {
                        return prev.filter((id) => id !== page);
                      }
                    });
                  }}
                  disabled={isAdded}
                />
                <label
                  htmlFor={page.title}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {page.title}
                </label>
              </div>
            );
          })}
        </CardContent>
      </Card>
      <div className="flex flex-col items-end">
        <Button
          size={"sm"}
          onClick={() => {
            selectedPages.forEach((selectedPage) => {
              addItem({
                id: selectedPage._id?.toString(),
                type: "page-item",
                name: selectedPage.title,
                url: `/${selectedPage.slug}`,
              });
            });
            setSelectedPages([]);
          }}
        >
          Add to Menu
        </Button>
      </div>
    </Accordion>
  );
};

export default PageItems;
