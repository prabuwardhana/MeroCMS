import React, { forwardRef } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { dropInVariant } from "@/constants/framerMotion";
import { CloudinaryResourceType } from "@/lib/types";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ImageGallery from "@/components/ImageGallery";
import FileUpload from "@/components/FileUpload";

interface CoverImageDialogProps {
  tab: string;
  selected: Array<CloudinaryResourceType>;
  modalOpen: boolean;
  onTabChange: (value: string) => void;
  onImageSelected: (isChecked: boolean, image: CloudinaryResourceType) => void;
  onClearSelectedImage: () => void;
  onSetCoverImage: () => void;
  onCloseDialog: () => void;
}

export const CoverImageDialog = forwardRef<HTMLDialogElement | null, CoverImageDialogProps>(
  (
    { tab, selected, modalOpen, onTabChange, onSetCoverImage, onImageSelected, onClearSelectedImage, onCloseDialog },
    ref,
  ) => {
    return (
      <AnimatePresence>
        {modalOpen && (
          <motion.dialog
            ref={ref}
            key="modal"
            variants={dropInVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClose={onCloseDialog}
            className="block z-50 overflow-hidden w-2/3 text-md inset-0 rounded-md backdrop:backdrop-blur-sm [&:not([open])]:pointer-events-none"
          >
            <header className="flex justify-between p-4">
              <h1 className="text-2xl font-bold">Cover Image</h1>
              <Button
                type="button"
                variant="destructive"
                onClick={onCloseDialog}
                className="flex h-8 w-8 items-center justify-center rounded-md p-3 text-xl"
              >
                <span className="sr-only">close</span> &times;
              </Button>
            </header>
            <Tabs value={tab} onValueChange={onTabChange} className="w-full px-4">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="upload">Upload Image</TabsTrigger>
                <TabsTrigger value="gallery">Image Gallery</TabsTrigger>
              </TabsList>
              <TabsContent value="upload">
                <FileUpload onTabChange={onTabChange} />
              </TabsContent>
              <TabsContent value="gallery">
                <ImageGallery
                  selected={selected}
                  onImageSelected={onImageSelected}
                  onClearSelectedImage={onClearSelectedImage}
                />
              </TabsContent>
            </Tabs>
            <footer className="flex justify-end p-4 mt-2 bg-muted">
              <Button type="button" disabled={selected.length < 1} onClick={onSetCoverImage}>
                <span className="sr-only">set cover image</span>
                Set Cover Image
              </Button>
            </footer>
          </motion.dialog>
        )}
      </AnimatePresence>
    );
  },
);

CoverImageDialog.displayName = "ImageManagerDialog";
