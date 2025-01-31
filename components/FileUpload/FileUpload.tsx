import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudUpload } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { opacityVariants } from "@/constants/framerMotion";
import { useAppStore } from "@/store/store";

import UploadProgressCard from "@/components/UploadProgressCard";
import Container from "@/components/Container";
import { useUploadImageMutation } from "@/hooks/api/useUploadImageMutation";

interface FileUploadProps {
  onTabChange: (value: string) => void;
}

const FileUpload = ({ onTabChange }: FileUploadProps) => {
  const files = useAppStore((state) => state.files);

  const mutation = useUploadImageMutation(onTabChange);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      console.log(acceptedFiles);

      mutation.mutate(
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
    <Container className="h-[460px] overflow-y-auto">
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
