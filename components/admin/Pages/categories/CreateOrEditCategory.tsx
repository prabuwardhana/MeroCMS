import React, { useEffect, useMemo, useState } from "react";

import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCategories } from "@/hooks/api/useCategories";
import { categoryFormSchema } from "@/lib/schemas";
import { slugify } from "@/lib/utils";
import type { CategoryType } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface CreateOrEditCategoryProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  categoryId?: string;
}
export const CreateOrEditCategory = ({ isOpen, setIsOpen, categoryId }: CreateOrEditCategoryProps) => {
  const initialCategoryData = useMemo(
    () => ({
      _id: null,
      name: "",
      slug: "",
      description: "",
    }),
    [],
  );

  // local states
  const [categoryData, setCategoryData] = useState<CategoryType>(initialCategoryData);

  const { categoryQuery, upsertMutation } = useCategories(categoryId);

  // 1. Define our form.
  const formMethods = useForm<CategoryType>({
    // Integrate zod as the schema validation library
    resolver: async (data, context, options) => {
      return zodResolver(categoryFormSchema)(data, context, options);
    },
    // form states
    defaultValues: {
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description,
    },
  });

  // 2. Define the form submit handler.
  const handleSubmit: SubmitHandler<CategoryType> = (formData) => {
    // Saves the content to DB.
    upsertMutation.mutate({ ...categoryData, ...formData });
    setIsOpen(false);
  };
  const handleSubmitError: SubmitErrorHandler<CategoryType> = (formData) => {
    // if (formData.sections?.root?.message) toast(formData.sections?.root?.message);
    console.log(formData);
  };

  // In edit mode, loads the content from DB.
  useEffect(() => {
    if (categoryId && categoryQuery) {
      const category: CategoryType = categoryQuery.data;
      // replace categoryData with the new one from the DB
      setCategoryData(category);
    }
  }, [categoryId]);

  // The following useEffect expects formMethods as dependency
  // when formMethods.reset is called within useEffect.
  // Adding the entire return value of useForm to a useEffect dependency list
  // may lead to infinite loops.
  // https://github.com/react-hook-form/react-hook-form/issues/12463
  const reset = useMemo(() => formMethods.reset, [formMethods.reset]);

  // Reset the form states when the previously stored
  // category data has been loaded sucessfuly from the DB
  useEffect(() => {
    reset({
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description,
    });
  }, [reset, categoryData]);

  // Reset the form states on successful submition
  useEffect(() => {
    if (formMethods.formState.isSubmitSuccessful) {
      reset({ ...categoryData });
    }
  }, [formMethods.formState, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] md:max-w-screen-md">
        <DialogHeader>
          <DialogTitle>{categoryId ? "Edit " : "Create "}Category</DialogTitle>
          <DialogDescription>Create a category for your blog post</DialogDescription>
        </DialogHeader>
        <Form {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(handleSubmit, handleSubmitError)}>
            <FormField
              control={formMethods.control}
              name="name"
              render={({ field }) => (
                <FormItem className="[&:not(:last-child)]:mb-3">
                  <FormLabel className="text-xs font-bold uppercase text-primary">Name</FormLabel>
                  <FormControl>
                    <Input
                      className="box-border h-12 rounded-md border bg-background py-4 text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="Enter category name here"
                      onChange={(e) => {
                        // send back data to hook form (update formState)
                        field.onChange(e.target.value);

                        // create slug for the title
                        const slug = slugify(e.target.value);

                        // Set the value for the slug field
                        formMethods.setValue("slug", slug);
                      }}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="[&:not(:last-child)]:mb-3">
                  <FormLabel className="text-xs font-bold uppercase text-primary">Generated Slug</FormLabel>
                  <FormControl>
                    <Input
                      className="box-border rounded-md border bg-background text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={field.value}
                      onChange={(e) => {
                        // send back data to hook form (update formState)
                        field.onChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={formMethods.control}
              name="description"
              render={({ field }) => (
                <FormItem className="[&:not(:last-child)]:mb-3">
                  <FormLabel className="text-xs font-bold uppercase text-primary">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      value={field.value}
                      onChange={(e) => {
                        // send back data to hook form (update formState)
                        field.onChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="justify-end mt-4">
              <Button type="submit" size={"sm"}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
