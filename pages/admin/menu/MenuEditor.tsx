import React, { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePageContext } from "vike-react/usePageContext";

import { NavMenuType } from "@/lib/types";
import { navMenuFormSchema } from "@/lib/schemas";

import { useNestableItemsContext } from "@/components/NestableList/providers/useNestableItemsContext";
import { useGetSingleNavMenuQuery } from "@/hooks/api/useGetSingleNavMenuQuery";
import { useCreateUpdateNavMenuMutation } from "@/hooks/api/useCreateUpdateNavMenuMutation";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NestableList from "@/components/NestableList";
import { ListItemContent } from "./ListItemContent";

const MenuEditor = () => {
  const { routeParams } = usePageContext();
  const [navMenuData, setNavMenuData] = useState<NavMenuType>({ _id: null, title: "", navMenuContent: [] });

  const { items, updateItems } = useNestableItemsContext();

  const { navMenuQuery } = useGetSingleNavMenuQuery(routeParams.id);
  const mutation = useCreateUpdateNavMenuMutation(routeParams.id);

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
    // Saves the content to DB.
    mutation.mutate({ ...navMenuData, ...formData, navMenuContent: items });
  };

  // In edit mode, loads the content from DB.
  useEffect(() => {
    if (routeParams.id && navMenuQuery) {
      const navMenu: NavMenuType = navMenuQuery.data;
      // replace postData with the new one from the DB
      setNavMenuData(navMenu);
      updateItems(navMenu.navMenuContent);
    }
  }, [routeParams.id]);

  // The following useEffect expects formMethods as dependency
  // when formMethods.reset is called within useEffect.
  // Adding the entire return value of useForm to a useEffect dependency list
  // may lead to infinite loops.
  // https://github.com/react-hook-form/react-hook-form/issues/12463
  const reset = useMemo(() => formMethods.reset, [formMethods.reset]);

  // Reset the form states when the previously stored
  // post data has been loaded sucessfuly from the DB
  useEffect(() => {
    reset({
      title: navMenuData.title,
    });
  }, [reset, navMenuData]);

  return (
    <div className="bg-background border min-h-44">
      <Form {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(handleSubmit)}>
          <FormField
            control={formMethods.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <div className="bg-muted py-2 px-4">
                  <div className="grid grid-cols-10 gap-3 font-semibold">
                    <div className="flex items-center col-span-2">
                      <FormLabel className="text-sm">Title</FormLabel>
                    </div>
                    <div className="flex items-center col-span-5">
                      <FormControl>
                        <Input
                          className="box-border h-[40px] rounded-md border bg-background py-4 text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <Button type="submit" className="bg-primary text-secondary col-span-3">
                      {routeParams.id ? "Update" : "+ Create"}
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

      {items.length ? (
        <NestableList
          items={items}
          renderListItemContent={ListItemContent}
          onChange={(nestableItems) => {
            updateItems(nestableItems);
            setNavMenuData({
              ...navMenuData,
              title: formMethods.formState.defaultValues?.title,
              navMenuContent: nestableItems,
            });
          }}
          confirmChange={({ draggedItem }) => {
            return draggedItem.preventDrag ? false : true;
          }}
          className="p-4"
        />
      ) : (
        <div className="text-center h-full py-2 px-4">
          <p>Selected menu items will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default MenuEditor;
