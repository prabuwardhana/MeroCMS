import React from "react";
import { FieldArrayWithId, UseFieldArrayRemove, useFormContext } from "react-hook-form";
import { Trash2 } from "lucide-react";
import type { PageType } from "@/lib/types";
import Field from "@/components/Field";
import { Button } from "@/components/ui/button";

const PageWidget = ({
  pageWidgetIndex,
  field,
  remove,
}: {
  pageWidgetIndex: number;
  field: FieldArrayWithId<PageType, "fields", "fieldId">;
  remove: UseFieldArrayRemove;
}) => {
  const { control } = useFormContext<PageType>();
  const labels = field.fieldLabels.split(",");
  return (
    <div className="border w-full rounded-sm bg-card">
      <div className="flex justify-between bg-background border-b rounded-sm py-2 px-4">
        <div className="flex items-center text-foreground">{field.fieldsTitle}</div>
        <div className="flex items-center">
          <Button type="button" variant={"destructive"} className="h-8 w-8" onClick={() => remove(pageWidgetIndex)}>
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
                key={`${key}-${pageWidgetIndex}`}
                control={control}
                type={type as string}
                name={`fields.${pageWidgetIndex}.${key}`}
                label={labels[index]}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default PageWidget;
