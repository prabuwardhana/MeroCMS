import React, { useEffect, useMemo, useState } from "react";

import { usePageContext } from "vike-react/usePageContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { withFallback } from "vike-react-query";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageTitle from "@/components/PageTitle";

import { CategoryType } from "@/lib/types";
import { categoryFormSchema } from "@/lib/schemas";
import { slugify } from "@/lib/utils";

import { RotateCcw } from "lucide-react";
import { useGetSingleCategoryQuery } from "@/hooks/api/useGetSingleCategoryQuery";
import { useCreateUpdateCategoryMutation } from "@/hooks/api/useCreateUpdateCategoryMutation";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const CreateOrEditCategory = withFallback(
  () => {
    const { routeParams } = usePageContext();
    const pageTitle = routeParams.id ? "Edit Category" : "Add New Category";

    const initialCategoryData = useMemo(
      () => ({
        name: "",
        slug: "",
        description: "",
      }),
      [],
    );

    // local states
    const [categoryData, setCategoryData] = useState<CategoryType>(initialCategoryData);

    const { categoryQuery } = useGetSingleCategoryQuery(routeParams.id);
    const mutation = useCreateUpdateCategoryMutation(routeParams.id);

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
      mutation.mutate(formData);
    };

    // In edit mode, loads the content from DB.
    useEffect(() => {
      if (routeParams.id && categoryQuery) {
        const category: CategoryType = categoryQuery.data;
        // replace postData with the new one from the DB
        setCategoryData(category);
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
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
      });
    }, [reset, categoryData]);

    return (
      <>
        <Form {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(handleSubmit)}>
            <div className="mb-6">
              <PageTitle>{pageTitle}</PageTitle>
            </div>
            <div className="flex flex-col gap-y-6 md:flex-row md:gap-x-6">
              <main className="basis-1/3">
                <Card className="p-4">
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
                  <div className="flex justify-between">
                    <Button type="submit" className="bg-primary text-secondary">
                      {routeParams.id ? "Update Category" : "Create New Category"}
                    </Button>
                  </div>
                </Card>
              </main>
              <aside className="basis-2/3">
                <Card>
                  <CardHeader>
                    <CardTitle>Categories</CardTitle>
                  </CardHeader>
                  <CardContent>Categories Table</CardContent>
                </Card>
              </aside>
            </div>
          </form>
        </Form>
      </>
    );
  },
  () => <div>Loading Category...</div>,
  ({ retry, error }) => (
    <div>
      <div>Failed to load Category: {error.message}</div>
      <Button variant="destructive" onClick={() => retry()}>
        <RotateCcw />
        Retry
      </Button>
    </div>
  ),
);

export default CreateOrEditCategory;
