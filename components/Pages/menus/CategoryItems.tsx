import React, { useCallback, useState } from "react";

import { useCategories } from "@/hooks/api/useCategories";
import type { CategoryType } from "@/lib/types";

import { useNestableItemsContext } from "@/components/NestableList/providers/useNestableItemsContext";
import type { Item } from "@/components/NestableList/libs/types";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Accordion from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const CategoryItems = () => {
  const { categoriesQuery } = useCategories();

  const [selectedCategories, setSelectedCategories] = useState<Array<CategoryType>>([]);
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
    <Accordion className="border-b text-sm" title="Categories">
      <Card className="mb-4 border">
        <CardContent className="p-4">
          {categoriesQuery.data.map((category) => {
            const isChecked = selectedCategories.find((item) => item.name === category.name) ? true : false;
            const isAdded = findItem(category._id as string, items);
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
                <Label
                  htmlFor={category.name}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.name}
                </Label>
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
                id: selectedCategory._id?.toString(),
                type: "category-item",
                name: selectedCategory.name,
                url: `/category/${selectedCategory.slug}`,
                description: selectedCategory.description,
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
