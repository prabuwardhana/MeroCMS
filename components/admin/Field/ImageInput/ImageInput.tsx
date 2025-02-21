import React, { useEffect, useState } from "react";
import { FieldValues, UseControllerProps, useFormContext } from "react-hook-form";
import { CloudinaryResourceType } from "@/lib/types";
import ImageManagerDialog from "@/components/admin/Dialogs";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ImageSetter from "@/components/admin/ImageSetter";

interface ShortTextProps<T extends FieldValues> extends UseControllerProps<T> {
  label: string;
}

export const ImageInput = <T extends FieldValues>({ name, control, label }: ShortTextProps<T>) => {
  const [tab, setTab] = useState("gallery");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>("");
  const [selectedImages, setSelectedImages] = useState<Array<CloudinaryResourceType>>([]);

  const { setValue, getValues } = useFormContext();

  const onTabChange = (value: string) => {
    setTab(value);
  };

  const onImageSelected = (isChecked: boolean, image: CloudinaryResourceType) => {
    setSelectedImages((prev) => {
      if (!isChecked) {
        const ret = Array.from(new Set([...(prev || []), image]));
        return ret.filter((id) => id === image);
      } else {
        return prev.filter((id) => id !== image);
      }
    });
  };

  const onClearSelectedImage = () => {
    setSelectedImages([]);
  };

  const onSetCoverImage = () => {
    setImageUrl(selectedImages[0].secure_url);
    setIsDialogOpen(false);
    setValue<string>(name, selectedImages[0].secure_url);
  };

  useEffect(() => {
    const singleValue = getValues(name) as string;
    setImageUrl(singleValue);
  }, []);

  return (
    <>
      <div className="space-y-1 basis-[calc(50%-8px)]">
        <FormField
          control={control}
          name={name}
          render={({ field }) => {
            return (
              <FormItem className="space-y-1">
                <FormLabel className="text-card-foreground text-xs">{label}</FormLabel>
                <FormControl>
                  <Input
                    type="hidden"
                    className="box-border rounded-sm border text-card-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <ImageSetter
          type="Page Section"
          imageUrl={imageUrl}
          onSetImageClick={() => setIsDialogOpen(true)}
          onRemoveImageClick={() => {
            setImageUrl("");
            setSelectedImages([]);
          }}
        />
      </div>
      <ImageManagerDialog
        title="Page Image"
        buttonText="Set Page Image"
        tab={tab}
        selected={selectedImages}
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onTabChange={onTabChange}
        onImageSelected={onImageSelected}
        onClearSelectedImage={onClearSelectedImage}
        onSetImage={onSetCoverImage}
      />
    </>
  );
};
