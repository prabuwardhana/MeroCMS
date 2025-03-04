import React from "react";
import { FieldValues, UseControllerProps } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface RichTextProps<T extends FieldValues> extends UseControllerProps<T> {
  label: string;
  disabled?: boolean;
  cleared?: boolean;
}

export const RichText = <T extends FieldValues>({ name, control, label, cleared }: RichTextProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="space-y-1 basis-1/3 flex-grow-[1]">
            <FormLabel className="text-card-foreground text-xs">{label}</FormLabel>
            <FormControl>
              <RichTextEditor
                content={field.value}
                cleared={cleared}
                onChange={(value) => field.onChange(value)}
                className="bg-background"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
