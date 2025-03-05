import React from "react";
import { FieldValues, UseControllerProps } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

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
        return (
          <FormItem className="space-y-1 basis-1/3 flex-grow-[1]">
            <FormLabel className="text-card-foreground text-xs">{label}</FormLabel>
            <FormControl>
              <Textarea disabled={disabled} {...field} className="min-h-[96px] bg-background" />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
