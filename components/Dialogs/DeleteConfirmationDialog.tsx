"use client";

import React, { Dispatch, SetStateAction, useEffect } from "react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  objectId: z.string(),
});

export function DeleteConfirmationDialog({
  title,
  description,
  isOpen,
  objectId,
  setIsOpen,
  mutate,
}: {
  isOpen: boolean;
  objectId: string;
  title: string;
  description?: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  mutate: (id: string) => void;
}) {
  // 1. Define our form.
  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: async (data, context, options) => {
      return zodResolver(formSchema)(data, context, options);
    },
    defaultValues: {
      objectId: objectId,
    },
  });

  const isLoading = formMethods.formState.isSubmitting;

  // 2. Define the form submit handler.
  const handleSubmit: SubmitHandler<z.infer<typeof formSchema>> = ({ objectId }) => {
    try {
      mutate(objectId);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmitError: SubmitErrorHandler<z.infer<typeof formSchema>> = (formData) => {
    console.log(formData);
  };

  useEffect(() => {
    formMethods.setValue("objectId", objectId);
  }, [objectId]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] md:max-w-screen-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(handleSubmit, handleSubmitError)} className="space-y-6 sm:px-0 px-4">
            <div className="w-full flex justify-center gap-6">
              <FormField
                control={formMethods.control}
                name="objectId"
                render={({ field }) => (
                  <>
                    <FormControl>
                      <input type="hidden" {...field} />
                    </FormControl>
                  </>
                )}
              />
              <Button
                size="lg"
                variant="outline"
                disabled={isLoading}
                className="w-full hidden sm:block"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button size="lg" type="submit" disabled={isLoading} className="w-full bg-red-500 hover:bg-red-400">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
