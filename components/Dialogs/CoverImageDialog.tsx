import React from "react";

import type { CloudinaryResourceType } from "@/lib/types";

import ImageGallery from "@/components/ImageGallery";
import FileUpload from "@/components/FileUpload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface ImageManagerDialogProps {
  title: string;
  buttonText: string;
  tab: string;
  selected: Array<CloudinaryResourceType>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onTabChange: (value: string) => void;
  onImageSelected: (isChecked: boolean, image: CloudinaryResourceType) => void;
  onClearSelectedImage: () => void;
  onSetImage: () => void;
}

const ImageManagerDialog = ({
  title,
  buttonText,
  tab,
  selected,
  isOpen,
  onTabChange,
  onSetImage,
  onImageSelected,
  onClearSelectedImage,
  setIsOpen,
}: ImageManagerDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] md:max-w-screen-lg bg-card">
        <DialogHeader>
          <div>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription></DialogDescription>
          </div>
        </DialogHeader>
        <Tabs value={tab} onValueChange={onTabChange} className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
            <TabsTrigger value="gallery">Image Gallery</TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <FileUpload onTabChange={onTabChange} className="h-[460px]" />
          </TabsContent>
          <TabsContent value="gallery">
            <ImageGallery
              selected={selected}
              onImageSelected={onImageSelected}
              onClearSelectedImage={onClearSelectedImage}
            />
          </TabsContent>
        </Tabs>
        <DialogFooter className="flex justify-end">
          <Button type="button" disabled={selected.length < 1} onClick={onSetImage}>
            <span className="sr-only">{buttonText}</span>
            {buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

ImageManagerDialog.displayName = "ImageManagerDialog";

export default ImageManagerDialog;
