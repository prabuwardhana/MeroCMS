import React, { useEffect, useMemo, useState } from "react";

import { useCreateUpdateComponentMutation } from "@/hooks/api/useCreateUpdateCamponentMutation";
import { useGetSingleComponentQuery } from "@/hooks/api/useGetSingleComponentQuery";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SubmitErrorHandler, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { componentFormSchema } from "@/lib/schemas";
import { PageComponentType, TextInputType } from "@/lib/types";
import { CirclePlus, Trash2 } from "lucide-react";

interface CreateOrEditComponentProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  componentId?: string;
}
const CreateOrEditComponent = ({ isOpen, setIsOpen, componentId }: CreateOrEditComponentProps) => {
  const initialComponentData = useMemo(
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
  const [componentData, setComponentData] = useState<PageComponentType>(initialComponentData);

  const { componentQuery } = useGetSingleComponentQuery(componentId);
  const mutation = useCreateUpdateComponentMutation(componentId);

  // 1. Define our form.
  const formMethods = useForm<PageComponentType>({
    // Integrate zod as the schema validation library
    resolver: async (data, context, options) => {
      return zodResolver(componentFormSchema)(data, context, options);
    },
    // form states
    defaultValues: {
      title: componentData.title,
      fields: componentData.fields,
    },
  });

  const { fields, append, remove } = useFieldArray<PageComponentType, "fields", "fieldId">({
    control: formMethods.control,
    name: "fields",
    keyName: "fieldId",
  });

  // 2. Define the form submit handler.
  const handleSubmit: SubmitHandler<PageComponentType> = (formData) => {
    // Saves the content to DB.
    console.log(formData);
    setIsOpen(false);
    mutation.mutate(formData);
  };
  const handleSubmitError: SubmitErrorHandler<PageComponentType> = (formData) => {
    // if (formData.sections?.root?.message) toast(formData.sections?.root?.message);
    console.log(formData);
  };

  // In edit mode, loads the content from DB.
  useEffect(() => {
    if (componentId && componentQuery) {
      const component: PageComponentType = componentQuery.data;
      // replace postData with the new one from the DB
      setComponentData(component);
    }
  }, [componentId]);

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
      title: componentData.title,
      fields: componentData.fields,
    });
  }, [reset, componentData]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] md:max-w-screen-md">
        <DialogHeader>
          <DialogTitle>{componentId ? "Edit " : "Create "}Component</DialogTitle>
          <DialogDescription>Create a component for your page</DialogDescription>
        </DialogHeader>
        <Form {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(handleSubmit, handleSubmitError)}>
            <FormField
              control={formMethods.control}
              name="title"
              render={({ field }) => (
                <FormItem className="[&:not(:last-child)]:mb-3">
                  <FormLabel className="font-normal text-xs text-primary">Component Name</FormLabel>
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
                <div key={item.fieldId} className="flex gap-4">
                  <FormField
                    control={formMethods.control}
                    name={`fields.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="basis-1/3">
                        <FormLabel className="font-normal text-xs text-primary">Name</FormLabel>
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
                  <FormField
                    control={formMethods.control}
                    name={`fields.${index}.label`}
                    render={({ field }) => (
                      <FormItem className="basis-1/3">
                        <FormLabel className="font-normal text-xs text-primary">Label</FormLabel>
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
                  <FormField
                    control={formMethods.control}
                    name={`fields.${index}.type`}
                    render={({ field }) => (
                      <FormItem className="basis-1/3">
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

export default CreateOrEditComponent;
