import React from "react";
import { FieldValues, UseControllerProps } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";

interface LongTextProps<T extends FieldValues> extends UseControllerProps<T> {
  label: string;
  disabled?: boolean;
}

export const LongText = <T extends FieldValues>({ name, control, label, disabled }: LongTextProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // console.log(field);
        return (
          <FormItem className="space-y-1">
            <FormLabel className="text-white text-xs">{label}</FormLabel>
            <FormControl>
              <Textarea disabled={disabled} {...field} className="min-h-[156px] border-primary/70 bg-background/20" />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
