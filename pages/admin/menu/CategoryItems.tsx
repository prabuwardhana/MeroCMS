import React, { useCallback, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import { useNestableItemsContext } from "@/components/NestableList/providers/useNestableItemsContext";

import { useGetCategoriesQuery } from "@/hooks/api/useGetCategoriesQuery";

import { Item } from "@/components/NestableList/Libs/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import Accordion from "@/components/ui/accordion";
import { CategoryType } from "@/lib/types";

const CategoryItems = () => {
  const { categoriesQuery } = useGetCategoriesQuery();

  const [selectedCategories, setSelectedCategories] = useState<Array<CategoryType>>([]);
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
    <Accordion title="Categories">
      <Card className="mb-4 border">
        <CardContent className="p-4">
          {categoriesQuery.data.map((category) => {
            const isChecked = selectedCategories.find((item) => item.name === category.name) ? true : false;
            const isAdded = findItem(category.slug, items);
            return (
              <div key={category.name} className="flex items-center space-x-2 [&:not(:last-child)]:mb-3">
                <Checkbox
                  id={category.name}
                  checked={isChecked || isAdded}
                  onCheckedChange={(checked: boolean) => {
                    setSelectedCategories((prev) => {
                      if (checked) {
                        return Array.from(new Set([...(prev || []), category]));
                      } else {
                        return prev.filter((id) => id !== category);
                      }
                    });
                  }}
                  disabled={isAdded}
                />
                <label
                  htmlFor={category.name}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.name}
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
            selectedCategories.forEach((selectedCategory) => {
              addItem({
                id: `${uuidv4()}`,
                name: `${selectedCategory.name}`,
                url: `/category/${selectedCategory.slug}`,
              });
            });
            setSelectedCategories([]);
          }}
        >
          Add to Menu
        </Button>
      </div>
    </Accordion>
  );
};

export default CategoryItems;
