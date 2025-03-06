import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePageContext } from "vike-react/usePageContext";
import { AxiosResponse } from "axios";
import { produce } from "immer";
import { CirclePlus, Save } from "lucide-react";

import type { CategoryType, NavMenuType, PageType } from "@/src/lib/types";
import { navMenuFormSchema } from "@/src/lib/schemas";
import { useNavMenus } from "@/src/hooks/api/useNavMenus";

import { useNestableItemsContext } from "@/components/NestableList/providers/useNestableItemsContext";
import { Item } from "@/components/NestableList/libs/types";
import NestableList from "@/components/NestableList";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import ListItemContent from "./ListItemContent";

const MenuEditor = () => {
  const { routeParams } = usePageContext();
  const [navMenuData, setNavMenuData] = useState<NavMenuType>({ _id: null, title: "", navItems: [] });
  const [warningMessage, setWarningMessage] = useState("");

  const { items, updateItems } = useNestableItemsContext();

  const { navMenuQuery, upsertMutation } = useNavMenus(routeParams.id);

  const queryClient = useQueryClient();
  const pagesQueryData = queryClient.getQueryData<AxiosResponse>(["pages"])?.data as PageType[];
  const categoriesQueryData = queryClient.getQueryData<AxiosResponse>(["categories"])?.data as CategoryType[];

  // 1. Define our form.
  const formMethods = useForm<{ title: string }>({
    // Integrate zod as the schema validation library
    resolver: async (data, context, options) => {
      return zodResolver(navMenuFormSchema)(data, context, options);
    },
    // form states
    defaultValues: {
      title: navMenuData.title,
    },
  });

  // 2. Define the form submit handler.
  const handleSubmit: SubmitHandler<{ title: string }> = (formData) => {
    setWarningMessage("");
    // Saves the content to DB.
    upsertMutation.mutate({ ...navMenuData, ...formData, navItems: items });
  };

  const getItemIndexPathById = useCallback((id: unknown, navItems: Item[]) => {
    let path: number[] = [];

    navItems.every((item, i) => {
      if (item["id"] === id) {
        // When the item id is equal to id

        // fill the path array with the index
        path.push(i);
      } else if (item["children"]) {
        // When not, check if it has children

        // find the id within the children array
        const childrenPath = getItemIndexPathById(id, item["children"]);

        if (childrenPath.length) {
          // When it's found in the children array,
          // fill the array with the index of the parrent and
          // the index of the children array
          path = path.concat(i).concat(childrenPath);
        }
      }

      return path.length === 0;
    });

    return path;
  }, []);

  let ids: string[] = [];
  const traverseNavItems = useCallback((type: string, items: Item[]) => {
    items.forEach((item) => {
      if (item["type"] === type) {
        ids.push(item["id"]);
        if (item["children"]) {
          traverseNavItems(type, item["children"]);
        }
      } else {
        if (item["children"]) {
          traverseNavItems(type, item["children"]);
        }
      }
    });

    return ids;
  }, []);

  const removeItem = useCallback((id: string, navItems: Item[]): Item[] => {
    const path = getItemIndexPathById(id, navItems);

    const newItems = produce(navItems, (draft) => {
      const lastIndex = path.length - 1;
      const route: (number | string)[] = [];

      path.forEach((index, i) => {
        if (i === lastIndex) {
          if (path.length === 1) {
            // the path has no children
            route.push(index);
            draft.splice(index, 1);
          } else {
            route
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .reduce((accumulator: any, currentValue: any) => {
                return accumulator[currentValue];
              }, draft)
              .splice(index, 1);
          }
        } else {
          route.push(index, "children");
        }
      });
    });

    return newItems;
  }, []);

  const checkForDeletedItems = (type: string, items: Item[], current: PageType[] | CategoryType[]) => {
    const foundItems = traverseNavItems(type, items);
    const existingItemIds = current.map((item) => item._id);
    const deletedItemIds = foundItems.filter((item) => !existingItemIds.includes(item));
    if (deletedItemIds.length === 1)
      setWarningMessage(
        `A ${type.split("-")[0].toUpperCase()} item has been removed from the editor because it was deleted from the Database. Please save it to make your Database in sync!`,
      );
    else if (deletedItemIds.length > 1)
      setWarningMessage(
        `Some ${type.split("-")[0].toUpperCase()} items have been removed from the editor because they were deleted from the Database. Please save it to make your Database in sync!`,
      );
    ids = [];

    return deletedItemIds.reduce((accumulator, currentValue) => {
      return removeItem(currentValue, accumulator);
    }, items);
  };

  // In edit mode, loads the content from DB.
  useEffect(() => {
    if (routeParams.id && navMenuQuery) {
      const navMenuOriginal: NavMenuType = navMenuQuery.data;

      let navMenuClean = checkForDeletedItems("page-item", navMenuOriginal.navItems, pagesQueryData);
      navMenuClean = checkForDeletedItems("category-item", navMenuClean, categoriesQueryData);

      // replace navMenuData with the new one from the DB
      setNavMenuData({ ...navMenuOriginal, navItems: navMenuClean });
      updateItems(navMenuClean);
    }
  }, [routeParams.id]);

  // The following useEffect expects formMethods as dependency
  // when formMethods.reset is called within useEffect.
  // Adding the entire return value of useForm to a useEffect dependency list
  // may lead to infinite loops.
  // https://github.com/react-hook-form/react-hook-form/issues/12463
  const reset = useMemo(() => formMethods.reset, [formMethods.reset]);

  // Reset the form states when the previously stored
  // navMenu data has been loaded sucessfuly from the DB
  useEffect(() => {
    reset({
      title: navMenuData.title,
    });
  }, [reset, navMenuData]);

  return (
    <div className="bg-slate-100 dark:bg-card min-h-44">
      <Form {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(handleSubmit)}>
          <FormField
            control={formMethods.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <div className="bg-slate-200 dark:bg-background border-b px-4 py-2">
                  <div className="grid grid-cols-10 gap-3 font-semibold">
                    <div className="flex items-center col-span-1">
                      <FormLabel className="text-sm">Title</FormLabel>
                    </div>
                    <div className="flex items-center col-span-7">
                      <FormControl>
                        <Input
                          className="box-border h-[40px] rounded-md border bg-background py-4 text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                          onChange={(e) => {
                            // send back data to hook form (update formState)
                            field.onChange(e.target.value);

                            setNavMenuData({ ...navMenuData, title: e.target.value });
                          }}
                          value={field.value}
                        />
                      </FormControl>
                    </div>
                    <Button type="submit" size={"sm"} className="bg-primary text-primary-foreground col-span-2">
                      {routeParams.id ? <Save /> : <CirclePlus />}
                      {routeParams.id ? "Save" : "Create"}
                    </Button>
                  </div>
                  <div className="flex justify-center">
                    <FormMessage className="mt-2" />
                  </div>
                </div>
              </FormItem>
            )}
          />
        </form>
      </Form>

      {warningMessage && (
        <div className="p-4 pb-0">
          <div className="bg-destructive text-destructive-foreground text-xs p-2 rounded-sm">{warningMessage}</div>
        </div>
      )}

      {items.length ? (
        <NestableList
          items={items}
          renderListItemContent={ListItemContent}
          onChange={(nestableItems) => {
            updateItems(nestableItems);
            setNavMenuData({
              ...navMenuData,
              navItems: nestableItems,
            });
          }}
          confirmChange={({ draggedItem }) => {
            return draggedItem.preventDrag ? false : true;
          }}
          className="p-4"
        />
      ) : (
        <div className="flex flex-col items-center justify-center-center h-full py-2 px-4">
          <p>Selected menu items will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default MenuEditor;
