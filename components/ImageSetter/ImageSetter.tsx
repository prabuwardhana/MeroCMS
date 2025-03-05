import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadButtonProps {
  type: string;
  imageUrl: string | undefined;
  className?: string;
  onSetImageClick: () => void;
  onRemoveImageClick: () => void;
}

const ImageSetter = ({ type, imageUrl, className, onSetImageClick, onRemoveImageClick }: FileUploadButtonProps) => {
  return imageUrl ? (
    <div className={className}>
      <img src={imageUrl} className="h-48 w-full object-cover rounded-md" />
      <Button
        type="button"
        variant="link"
        className="p-0 flex justify-center items-center text-sm text-destructive"
        onClick={onRemoveImageClick}
      >
        <Trash2 />
        Remove {type} image
      </Button>
    </div>
  ) : (
    <Button
      type="button"
      onClick={onSetImageClick}
      className="h-20 w-full text-wrap rounded-sm border border-dashed border-accent-foreground bg-accent hover:bg-accent/50 text-sm text-accent-foreground transition-colors"
    >
      <span className="sr-only">Set {type} Image</span>
      Set {type} Image
    </Button>
  );
};

export default ImageSetter;
