import React from "react";
import { FieldArrayWithId, UseFieldArrayRemove, useFormContext } from "react-hook-form";
import { PageType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Field from "@/components/Field";
import { Trash2 } from "lucide-react";

const PageComponent = ({
  componentIndex,
  field,
  remove,
}: {
  componentIndex: number;
  field: FieldArrayWithId<PageType, "fields", "fieldId">;
  remove: UseFieldArrayRemove;
}) => {
  const { control } = useFormContext<PageType>();
  const labels = field.fieldLabels.split("_");
  return (
    <div className="border w-full rounded-sm bg-card">
      <div className="flex justify-between bg-background border-b rounded-sm py-2 px-4">
        <div className="flex items-center text-foreground">{field.fieldsTitle}</div>
        <div className="flex items-center">
          <Button type="button" variant={"destructive"} className="h-8 w-8" onClick={() => remove(componentIndex)}>
            <Trash2 />
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 p-4">
        {Object.keys(field).map((key, index) => {
          const type = key.split("_")[1];
          if (["short-text", "long-text", "rich-text", "image-input"].includes(type)) {
            return (
              <Field
                key={`${key}-${componentIndex}`}
                control={control}
                type={type as string}
                name={`fields.${componentIndex}.${key}`}
                label={labels[index]}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default PageComponent;
