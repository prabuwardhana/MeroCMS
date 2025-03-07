import React, { useEffect, useMemo, useState } from "react";
import { SubmitErrorHandler, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlus, Trash2 } from "lucide-react";

import type { PageWidgetType, TextInputType } from "@/core/lib/types";
import { usePageWidgets } from "@/core/hooks/api/usePageComponents";
import { pageWidgetFormSchema } from "@/core/lib/schemas";
import { slugify } from "@/core/lib/utils";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateOrEditPageWidgetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  pageWidgetId?: string;
}
export const CreateOrEditPageWidget = ({ isOpen, setIsOpen, pageWidgetId }: CreateOrEditPageWidgetProps) => {
  const initialPageWidgetData = useMemo(
    () => ({
      _id: null,
      title: "",
      fields: [
        {
          fieldId: "",
          name: "",
          label: "",
          type: "short-text" as TextInputType,
        },
      ],
    }),
    [],
  );

  // local states
  const [pageWidgetData, setPageWidgetData] = useState<PageWidgetType>(initialPageWidgetData);

  const { pageWidgetQuery, upsertMutation } = usePageWidgets(pageWidgetId);

  // 1. Define our form.
  const formMethods = useForm<PageWidgetType>({
    // Integrate zod as the schema validation library
    resolver: async (data, context, options) => {
      return zodResolver(pageWidgetFormSchema)(data, context, options);
    },
    // form states
    defaultValues: {
      title: pageWidgetData.title,
      fields: pageWidgetData.fields,
    },
  });

  const { fields, append, remove } = useFieldArray<PageWidgetType, "fields", "fieldId">({
    control: formMethods.control,
    name: "fields",
    keyName: "fieldId",
  });

  // 2. Define the form submit handler.
  const handleSubmit: SubmitHandler<PageWidgetType> = (formData) => {
    // Saves the content to DB.
    upsertMutation.mutate({ ...pageWidgetData, ...formData });
    setIsOpen(false);
  };
  const handleSubmitError: SubmitErrorHandler<PageWidgetType> = (formData) => {
    // if (formData.sections?.root?.message) toast(formData.sections?.root?.message);
    console.log(formData);
  };

  // In edit mode, loads the content from DB.
  useEffect(() => {
    if (pageWidgetId && pageWidgetQuery) {
      const pageWidget: PageWidgetType = pageWidgetQuery.data;
      // replace pageWidgetData with the new one from the DB
      setPageWidgetData(pageWidget);
    }
  }, [pageWidgetId]);

  // The following useEffect expects formMethods as dependency
  // when formMethods.reset is called within useEffect.
  // Adding the entire return value of useForm to a useEffect dependency list
  // may lead to infinite loops.
  // https://github.com/react-hook-form/react-hook-form/issues/12463
  const reset = useMemo(() => formMethods.reset, [formMethods.reset]);

  // Reset the form states when the previously stored
  // widget data has been loaded sucessfuly from the DB
  useEffect(() => {
    reset({
      title: pageWidgetData.title,
      fields: pageWidgetData.fields,
    });
  }, [reset, pageWidgetData]);

  // Reset the form states on successful submition
  useEffect(() => {
    if (formMethods.formState.isSubmitSuccessful) {
      reset({ ...pageWidgetData });
    }
  }, [formMethods.formState, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] md:max-w-screen-sm">
        <DialogHeader>
          <DialogTitle>{pageWidgetId ? "Edit " : "Create "}Page Widget</DialogTitle>
          <DialogDescription>Create a page widget for your page</DialogDescription>
        </DialogHeader>
        <Form {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(handleSubmit, handleSubmitError)}>
            <FormField
              control={formMethods.control}
              name="title"
              render={({ field }) => (
                <FormItem className="[&:not(:last-child)]:mb-3">
                  <FormLabel className="font-normal text-xs text-primary">Page Widget Name</FormLabel>
                  <FormControl>
                    <Input
                      className="box-border rounded-md border bg-background text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <span className="text-md text-primary">Input Fields:</span>
              {fields.map((item, index) => (
                <div key={item.fieldId} className="flex justify-between gap-4">
                  <FormField
                    control={formMethods.control}
                    name={`fields.${index}.name`}
                    render={({ field }) => (
                      <>
                        <FormControl>
                          <Input
                            type="hidden"
                            className="box-border rounded-md border bg-background text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </>
                    )}
                  />
                  <FormField
                    control={formMethods.control}
                    name={`fields.${index}.label`}
                    render={({ field }) => (
                      <FormItem className="basis-1/2">
                        <FormLabel className="font-normal text-xs text-primary">Label</FormLabel>
                        <FormControl>
                          <Input
                            className="box-border rounded-md border bg-background text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                            onChange={(e) => {
                              // send back data to hook form (update formState)
                              field.onChange(e.target.value);

                              // create slug for the title
                              const slug = slugify(e.target.value);

                              // Set the value for the slug field
                              formMethods.setValue(`fields.${index}.name`, slug);
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
                    name={`fields.${index}.type`}
                    render={({ field }) => (
                      <FormItem className="basis-1/2">
                        <FormLabel className="font-normal text-xs text-primary">Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an Input type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="short-text">Short Text</SelectItem>
                            <SelectItem value="long-text">Long Text</SelectItem>
                            <SelectItem value="rich-text">Rich Text</SelectItem>
                            <SelectItem value="image-input">Image</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col justify-end">
                    <Button
                      type="button"
                      variant={"destructive"}
                      size={"sm"}
                      className="h-10 w-10 flex justify-center items-center text-sm"
                      onClick={() => remove(index)}
                      disabled={fields.length < 2}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter className="md:justify-between mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => append({ fieldId: fields.length.toString(), type: "short-text", name: "", label: "" })}
                className="justify-start items-center flex gap-2 rounded-md p-2"
              >
                <CirclePlus />
                add more field
              </Button>
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
