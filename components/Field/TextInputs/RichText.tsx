import React from "react";
import { FieldValues, UseControllerProps } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import RichTextEditor from "../../RichTextEditor";

interface RichTextProps<T extends FieldValues> extends UseControllerProps<T> {
  label: string;
  disabled?: boolean;
}

export const RichText = <T extends FieldValues>({ name, control, label }: RichTextProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="space-y-1">
            <FormLabel className="text-card-foreground text-xs">{label}</FormLabel>
            <FormControl>
              <RichTextEditor
                content={field.value}
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
