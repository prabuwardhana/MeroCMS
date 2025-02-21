import React from "react";
import { FieldValues, UseControllerProps } from "react-hook-form";
import { LongText, RichText, ShortText } from "./TextInputs";
import { ImageInput } from "./ImageInput";

interface FieldProps<T extends FieldValues> extends UseControllerProps<T> {
  type: string;
  label: string;
  disabled?: boolean;
}

const Field = <T extends FieldValues>({ type, name, control, label }: FieldProps<T>) => {
  return {
    "rich-text": <RichText control={control} name={name} label={label} />,
    "long-text": <LongText control={control} name={name} label={label} />,
    "short-text": <ShortText name={name} label={label} />,
    "image-input": <ImageInput name={name} label={label} />,
  }[type];
};

export default Field;
