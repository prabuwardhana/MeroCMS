import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudUpload } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { cn } from "@/lib/utils";
import { opacityVariants } from "@/constants/framerMotion";
import { useImages } from "@/hooks/api/useImages";
import { useFileUploadStore } from "@/store/fileUploadStore";

import UploadProgressCard from "@/components/admin/UploadProgressCard";
import Container from "@/components/common/Container";

interface FileUploadProps {
  className?: string;
  onTabChange?: (value: string) => void;
}

const FileUpload = ({ onTabChange, className }: FileUploadProps) => {
  const { files } = useFileUploadStore((state) => state);

  const { uploadMutation } = onTabChange ? useImages(null, undefined, undefined, onTabChange) : useImages(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      uploadMutation.mutate(
        acceptedFiles.map((item) => ({
          file: item,
          id: `${item.name}${item.size}`,
          uploadProgress: 0,
          uploadStatus: "idle",
        })),
      );
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxFiles: 4,
    maxSize: 4 * 1024 * 1024,
    onDrop,
  });

  return (
    <Container className={cn("overflow-y-auto", className)}>
      <div {...getRootProps()} className="h-full">
        {files.length ? (
          <UploadProgressCard files={files} />
        ) : (
          <>
            <input {...getInputProps()} />
            <label htmlFor="file_upload_btn" className="cursor-pointer">
              <AnimatePresence>
                <motion.div
                  key="drop-zone"
                  variants={opacityVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="border-2 border-dotted border-primary bg-primary/10 w-full h-full flex flex-col gap-2 items-center justify-center p-4 rounded-md"
                >
                  <CloudUpload size={96} className="text-primary" />
                  {isDragActive ? (
                    <p className="text-primary text-center">Drop the files here ...</p>
                  ) : (
                    <>
                      <p className="text-primary text-center">
                        <strong>Choose a file,</strong> or drag it here.
                      </p>
                      <p className="text-xs text-primary text-center">(Max file size: 1MB)</p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </label>
          </>
        )}
      </div>
    </Container>
  );
};

export default FileUpload;
