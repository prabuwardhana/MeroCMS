import React, { useCallback, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import { usePages } from "@/hooks/api/usePages";
import { PageType } from "@/lib/types";

import { useNestableItemsContext } from "@/components/admin/NestableList/providers/useNestableItemsContext";
import { Item } from "@/components/admin/NestableList/Libs/types";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Accordion from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const PageItems = () => {
  const { pagesQuery } = usePages();

  const [selectedPages, setSelectedPages] = useState<Array<PageType>>([]);
  const { items, addItem } = useNestableItemsContext();

  const findItem = useCallback(
    (slug: string, items: Item[]): boolean => {
      const result = items.some((item) => {
        if ((item["url"] as string).includes(slug)) {
          return true;
        } else if (item["children"]) {
          return findItem(slug, item["children"]);
        }
      });

      return result;
    },
    [items],
  );

  return (
    <Accordion className="border-b" title="Pages" open={true}>
      <Card className="mb-4 border">
        <CardContent className="p-4">
          {pagesQuery.data.map((page) => {
            const isChecked = selectedPages.find((item) => item.title === page.title) ? true : false;
            const isAdded = findItem(page.slug, items);
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
            selectedPages.forEach((selectedCategory) => {
              addItem({
                id: `${uuidv4()}`,
                name: `${selectedCategory.title}`,
                url: `/${selectedCategory.slug}`,
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
