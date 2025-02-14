import React from "react";
import { FieldValues, UseControllerProps } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

interface ShortTextProps<T extends FieldValues> extends UseControllerProps<T> {
  label: string;
  disabled?: boolean;
}

export const ShortText = <T extends FieldValues>({ name, control, label, disabled }: ShortTextProps<T>) => {
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
              <Input
                disabled={disabled}
                className="box-border rounded-md border border-primary/70 bg-background/20 text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
